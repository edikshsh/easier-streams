/// <reference types="node" />
/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedTransformCallback } from "../types/typed-transform-callback";
import { BaseTransform } from "./base-transform";
import { TransformFunction } from "./simple-transform";
export declare type AsyncTransformFunction<TSource, TDestination> = TransformFunction<TSource, Promise<TDestination>>;
export declare class SimpleAsyncTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> {
    private transformer;
    constructor(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: TransformOptions);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>): Promise<void>;
}
