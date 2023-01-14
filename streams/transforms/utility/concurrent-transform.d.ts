/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter, TransformCallback } from 'stream';
import { BaseTransform } from '../base/base-transform';
import { AsyncTransformFunction } from '../base/simple-async-transform';
import { FullTransformOptions } from '../types/full-transform-options.type';
import { TypedTransformCallback } from '../types/typed-transform-callback';
export declare class ConcurrentTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> {
    private transformer;
    private concurrency;
    private options?;
    itemQueue: TSource[];
    liveWorkers: number;
    ee: EventEmitter;
    itemsDone: number;
    constructor(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, concurrency: number, options?: FullTransformOptions<TSource> | undefined);
    inputQueueIsEmpty(): Promise<void>;
    allWorkersFinished(): Promise<void>;
    startWorker(): Promise<void>;
    getItemFromQueue(): TSource | undefined;
    worker(): Promise<boolean>;
    enqueueItems(items: TSource[]): Promise<void>;
    _transform(item: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>): Promise<void>;
    _destroy(error: Error | null, callback: (error: Error | null) => void): Promise<void>;
    _flush(callback: TransformCallback): Promise<void>;
    _final(callback: (error?: Error | null | undefined) => void): Promise<void>;
    onStreamEnd(): Promise<void>;
}
