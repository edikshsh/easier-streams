/// <reference types="node" />
/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedTransformCallback } from "../../types/typed-transform-callback";
import { BaseTransform } from "../base-transform";
declare type ArrayElementType<T extends any[]> = T extends (infer U)[] ? U : never;
export declare class ArraySplitTransform<TSource extends any[]> extends BaseTransform<TSource, ArrayElementType<TSource>> {
    constructor(options?: TransformOptions);
    _transform(chunks: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<ArrayElementType<TSource>>): void;
}
export {};
