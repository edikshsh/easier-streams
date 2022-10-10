/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedTransformCallback } from "../../types/typed-transform-callback";
import { BaseTransform } from "../base-transform";
declare type ArrayElementType<T extends unknown[]> = T extends (infer U)[] ? U : never;
export declare class ArraySplitTransform<TSource extends unknown[]> extends BaseTransform<TSource, ArrayElementType<TSource>> {
    constructor(options?: TransformOptions);
    _transform(chunks: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<ArrayElementType<TSource>>): void;
}
export {};