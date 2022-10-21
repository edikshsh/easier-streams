/// <reference types="node" />
import { TransformCallback, TransformOptions } from "stream";
import { BaseTransform } from "../base/base-transform";
import { TypedTransformCallback } from "../types/typed-transform-callback";
export declare class ArrayJoinTransform<TSource> extends BaseTransform<TSource, TSource[]> {
    private length;
    array: TSource[];
    constructor(length: number, options?: TransformOptions);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TSource[]>): void;
    _flush(callback: TransformCallback): void;
}
