/// <reference types="node" />
/// <reference types="node" />
import { TransformCallback, TransformOptions } from "stream";
import { BaseTransform } from "./base-transform";
export declare class TypedPassThrough<TSource> extends BaseTransform<TSource, TSource> {
    constructor(options?: TransformOptions);
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
}
