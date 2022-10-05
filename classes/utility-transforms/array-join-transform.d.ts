/// <reference types="node" />
/// <reference types="node" />
import { TransformCallback, TransformOptions } from "stream";
import { TypedTransformCallback } from "../../types/typed-transform-callback";
import { BaseTransform } from "../base-transform";
export declare class ArrayJoinTransform<TSource> extends BaseTransform<TSource, TSource[]> {
    private length;
    array: TSource[];
    constructor(length: number, options?: TransformOptions);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TSource[]>): void;
    _flush(callback: TransformCallback): void;
}
