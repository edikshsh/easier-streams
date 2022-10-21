/// <reference types="node" />
import { TransformOptions } from "stream";
import { ErrorTransformOptions } from "../../errors/error-transform-options.type";
export declare type FullTransformOptions<TSource> = TransformOptions & ErrorTransformOptions<TSource>;
