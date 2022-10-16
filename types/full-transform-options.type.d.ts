/// <reference types="node" />
import { TransformOptions } from "stream";
import { ErrorTransformOptions } from "./error-transform-options.type";
export declare type FullTransformOptions<TSource> = TransformOptions & ErrorTransformOptions<TSource>;
