/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedTransformCallback } from "../types/typed-transform-callback";
import { BaseTransform } from "./base-transform";
export declare class TypedPassThrough<T> extends BaseTransform<T, T> {
    constructor(options?: TransformOptions);
    _transform(chunk: T, encoding: BufferEncoding, callback: TypedTransformCallback<T>): void;
}
