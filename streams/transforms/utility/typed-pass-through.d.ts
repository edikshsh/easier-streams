/// <reference types="node" />
import { TransformOptions } from "stream";
import { BaseTransform } from "../base/base-transform";
import { TypedTransformCallback } from "../types/typed-transform-callback";
export declare class TypedPassThrough<T> extends BaseTransform<T, T> {
    constructor(options?: TransformOptions);
    _transform(chunk: T, encoding: BufferEncoding, callback: TypedTransformCallback<T>): void;
}
