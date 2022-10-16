/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedTransformCallback } from "../types/typed-transform-callback";
import { BaseTransform } from "./base-transform";
export declare type StreamError<T> = {
    id: string;
    error: Error;
    data: T;
};
export declare function passStreamError(id: string): (streamError: StreamError<unknown>) => boolean;
export declare function filterOutStreamError(id: string): (streamError: StreamError<unknown>) => boolean;
export declare class ErrorTransform<TSource> extends BaseTransform<StreamError<TSource>, StreamError<TSource>> {
    id: string;
    constructor(options?: TransformOptions);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TSource>): void;
}
