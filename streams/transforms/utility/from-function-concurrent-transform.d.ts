import { AsyncTransformFunction } from "../base/simple-async-transform";
import { FullTransformOptions } from "../types/full-transform-options.type";
import { TypedPassThrough } from "./typed-pass-through";
export declare function fromFunctionConcurrentTransform<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, concurrency: number, options?: FullTransformOptions<any>): {
    input: TypedPassThrough<TSource>;
    output: TypedPassThrough<TDestination>;
};
