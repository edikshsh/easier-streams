import { TransformCallback, TransformOptions } from 'stream';
import { BaseTransform } from '../base/base-transform';
import { SimpleTransform } from '../base/simple-transform';

type Tagged<T> = { data: T; result: boolean };

export const FORK_OUTPUT_ERROR =
    'ForkTransform output is already internally piped to filterTrueTransform and filterFalseTransform. ' +
    'Pipe the source into the ForkTransform, then consume those two streams.';

const throwOnExternalPipe = (): never => {
    throw new Error(FORK_OUTPUT_ERROR);
};

export class ForkTransform<TSource> extends BaseTransform<TSource, Tagged<TSource>> {
    readonly filterTrueTransform: SimpleTransform<Tagged<TSource>, TSource>;
    readonly filterFalseTransform: SimpleTransform<Tagged<TSource>, TSource>;

    constructor(
        private filterFunction: (chunk: TSource) => boolean,
        options?: TransformOptions,
    ) {
        super(options);
        this.setMaxListeners(this.getMaxListeners() + 20);
        this.filterTrueTransform = new SimpleTransform<Tagged<TSource>, TSource>(
            (tagged) => (tagged.result ? tagged.data : undefined),
            options,
        );
        this.filterFalseTransform = new SimpleTransform<Tagged<TSource>, TSource>(
            (tagged) => (tagged.result ? undefined : tagged.data),
            options,
        );
        this.pipeBroadcast([this.filterTrueTransform, this.filterFalseTransform]);

        this.pipe = throwOnExternalPipe as unknown as typeof this.pipe;
        this.pipeOne = throwOnExternalPipe as unknown as typeof this.pipeOne;
        this.pipeBroadcast = throwOnExternalPipe as unknown as typeof this.pipeBroadcast;
    }

    _transform(chunk: TSource, _encoding: BufferEncoding, callback: TransformCallback) {
        callback(null, { data: chunk, result: this.filterFunction(chunk) });
    }
}

export class AsyncForkTransform<TSource> extends BaseTransform<TSource, Tagged<TSource>> {
    readonly filterTrueTransform: SimpleTransform<Tagged<TSource>, TSource>;
    readonly filterFalseTransform: SimpleTransform<Tagged<TSource>, TSource>;

    constructor(
        private filterFunction: (chunk: TSource) => Promise<boolean>,
        options?: TransformOptions,
    ) {
        super(options);
        this.setMaxListeners(this.getMaxListeners() + 20);
        this.filterTrueTransform = new SimpleTransform<Tagged<TSource>, TSource>(
            (tagged) => (tagged.result ? tagged.data : undefined),
            options,
        );
        this.filterFalseTransform = new SimpleTransform<Tagged<TSource>, TSource>(
            (tagged) => (tagged.result ? undefined : tagged.data),
            options,
        );
        this.pipeBroadcast([this.filterTrueTransform, this.filterFalseTransform]);

        this.pipe = throwOnExternalPipe as unknown as typeof this.pipe;
        this.pipeOne = throwOnExternalPipe as unknown as typeof this.pipeOne;
        this.pipeBroadcast = throwOnExternalPipe as unknown as typeof this.pipeBroadcast;
    }

    async _transform(chunk: TSource, _encoding: BufferEncoding, callback: TransformCallback) {
        callback(null, { data: chunk, result: await this.filterFunction(chunk) });
    }
}
