/// <reference types="node" />
/// <reference types="node" />
import { Transform, TransformCallback, TransformOptions } from "stream";
import { TypedTransform } from "../../types/typed-transform";
import { TypedTransformCallback } from "../../types/typed-transform-callback";
export declare class ArrayJoinTransform<TSource> extends Transform implements TypedTransform<TSource, TSource[]> {
    private length;
    array: TSource[];
    constructor(length: number, options?: TransformOptions);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TSource[]>): void;
    _flush(callback: TransformCallback): void;
}
