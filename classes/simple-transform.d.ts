/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedTransform } from "../types/typed-transform";
import { TypedTransformCallback } from "../types/typed-transform-callback";
import { BaseTransform } from "./base-transform";
export declare type TransformFunction<TSource, TDestination> = (item: TSource) => TDestination;
export declare class SimpleTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> implements TypedTransform<TSource, TDestination> {
    private transformer;
    constructor(transformer: TransformFunction<TSource, TDestination | undefined>, options?: TransformOptions);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>): void;
}
