/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter, TransformOptions } from 'stream';
import { BaseTransform } from '../transforms/base/base-transform';
import { TypedTransform } from '../transforms/typed-transform/typed-transform.interface';
import { TypedTransformCallback } from '../transforms/types/typed-transform-callback';
import { StreamGroupControllerEventCounter } from '../utility/stream-group-output-controller-event-counter.type';
import { StreamError } from './stream-error';
export declare class ErrorTransform<TSource> extends BaseTransform<unknown, StreamError<TSource>> implements TypedTransform<unknown, StreamError<TSource>> {
    streamGroupControllerEventCounter: StreamGroupControllerEventCounter;
    totalInputs: number;
    constructor(options?: TransformOptions);
    _transform(chunk: unknown, encoding: BufferEncoding, callback: TypedTransformCallback<StreamError<TSource>>): void;
    pipeErrorSource(transforms: TypedTransform<TSource, unknown>[]): void;
    streamsManyToOneController(inputLayer: EventEmitter[], output: EventEmitter): void;
}
