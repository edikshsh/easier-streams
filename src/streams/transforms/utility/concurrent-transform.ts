import { EventEmitter, TransformCallback, TransformOptions } from 'stream';
import { BaseTransform } from '../base/base-transform';
import { AsyncTransformFunction } from '../base/simple-async-transform';
import { TypedTransformCallback } from '../types/typed-transform-callback';

export class ConcurrentTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> {
    itemQueue: TSource[] = [];
    liveWorkers = 0;
    private ee: EventEmitter = new EventEmitter();
    itemsDone = 0;

    constructor(
        private transformer: AsyncTransformFunction<TSource, TDestination | undefined>,
        private concurrency: number,
        options?: TransformOptions,
    ) {
        super(options);
        this.ee.setMaxListeners(concurrency + 5);
    }

    private inputQueueIsEmpty(): Promise<void> {
        return this.itemQueue.length === 0
            ? Promise.resolve()
            : new Promise((res) => this.ee.once('itemQueueEmpty', res));
    }

    private allWorkersFinished(): Promise<void> {
        return this.liveWorkers === 0
            ? Promise.resolve()
            : new Promise((res) => this.ee.once('promiseQueueEmpty', res));
    }

    private async startWorker(): Promise<void> {
        if (this.liveWorkers >= this.concurrency) {
            return;
        }
        this.liveWorkers++;
        while (await this.worker());
        this.liveWorkers--;
        if (this.liveWorkers === 0) {
            this.ee.emit('promiseQueueEmpty');
        }
    }

    private getItemFromQueue(): TSource | undefined {
        const item = this.itemQueue.shift();
        if (this.itemQueue.length === 0) {
            this.ee.emit('itemQueueEmpty');
        }
        return item;
    }

    private async worker(): Promise<boolean> {
        const item = this.getItemFromQueue();
        if (item == null) {
            return false;
        }

        try {
            this.push(await this.transformer(item, this));
            return true;
        } catch (error) {
            this.destroy(error as Error);
        } finally {
            this.itemsDone++;
        }
        return true;
    }

    private async enqueueItems(items: TSource[]): Promise<void> {
        items.forEach((item) => {
            this.itemQueue.push(item);
            void this.startWorker();
        });
        return this.inputQueueIsEmpty();
    }

    async _transform(
        item: TSource,
        encoding: BufferEncoding,
        callback: TypedTransformCallback<TDestination>,
    ): Promise<void> {
        await this.enqueueItems([item]);
        callback();
    }

    async _destroy(error: Error | null, callback: (error: Error | null) => void): Promise<void> {
        this.itemQueue = [];
        await this.allWorkersFinished();
        callback(error);
    }

    async _flush(callback: TransformCallback): Promise<void> {
        await this.allWorkersFinished();
        callback();
    }

    async _final(callback: (error?: Error | null | undefined) => void): Promise<void> {
        await this.allWorkersFinished();
        callback();
    }
}
