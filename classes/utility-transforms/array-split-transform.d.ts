/// <reference types="node" />
/// <reference types="node" />
import { Transform, TransformOptions } from "stream";
import { TypedTransform } from "../../types/typed-transform";
import { TypedTransformCallback } from "../../types/typed-transform-callback";
declare type ArrayElementType<T extends any[]> = T extends (infer U)[] ? U : never;
export declare class ArraySplitTransform<TSource extends any[]> extends Transform implements TypedTransform<TSource, ArrayElementType<TSource>> {
    constructor(options?: TransformOptions);
    _transform(chunks: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<ArrayElementType<TSource>>): void;
}
export {};
