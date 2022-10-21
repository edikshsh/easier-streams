/// <reference types="node" />
import { TransformOptions } from "stream";
import { TypedPassThrough } from "./typed-pass-through";
export declare function fromIterable<T>(iterable: Iterable<T> | AsyncIterable<T>, options?: TransformOptions): TypedPassThrough<T>;
