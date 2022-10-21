/// <reference types="node" />
import { FullTransformOptions } from "../types/full-transform-options.type";
import { BaseTransform } from "./base-transform";
import { TransformFunction } from "./simple-transform";
import { TypedTransformCallback } from "../types/typed-transform-callback";
export declare type AsyncTransformFunction<TSource, TDestination> = TransformFunction<TSource, Promise<TDestination>>;
export declare class SimpleAsyncTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> {
    private transformer;
    private options?;
    constructor(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource> | undefined);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>): Promise<void>;
}
