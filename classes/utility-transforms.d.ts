/// <reference types="node" />
import { TransformOptions } from "stream";
import { FullTransformOptions } from "../types/full-transform-options.type";
import { ErrorTransform } from "./error-stream";
import { AsyncTransformFunction, SimpleAsyncTransform } from "./simple-async-transform";
import { SimpleTransform, TransformFunction } from "./simple-transform";
import { TypedPassThrough } from "./TypedPassThrough";
import { ArrayJoinTransform } from "./utility-transforms/array-join-transform";
import { ArraySplitTransform } from "./utility-transforms/array-split-transform";
export declare class UtilityTransforms {
    private defaultTrasformOptions?;
    constructor(defaultTrasformOptions?: TransformOptions | undefined);
    private mergeOptions;
    arrayJoin<TSource>(length: number, options?: FullTransformOptions<TSource>): ArrayJoinTransform<TSource>;
    arraySplit<TSource>(options?: FullTransformOptions<TSource[]>): ArraySplitTransform<TSource[]>;
    callOnDataSync<TSource>(functionToCallOnData: (data: TSource) => void, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TSource>;
    callOnDataAsync<TSource>(functionToCallOnData: (data: TSource) => Promise<void>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TSource>;
    void<TSource>(options?: FullTransformOptions<TSource>): SimpleTransform<TSource, void>;
    filter<TSource>(filterFunction: (chunk: TSource) => boolean, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TSource>;
    fromFunction<TSource, TDestination>(transformer: TransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TDestination>;
    fromAsyncFunction<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TDestination>;
    passThrough<T>(options?: FullTransformOptions<T>): TypedPassThrough<T>;
    pickElementFromArray<T>(index: number, options?: FullTransformOptions<T[]>): SimpleTransform<T[], T>;
    fromFunctionConcurrent<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, concurrency: number, options?: FullTransformOptions<any>): {
        input: TypedPassThrough<TSource>;
        output: TypedPassThrough<TDestination>;
    };
    fromIterable<T>(iterable: Iterable<T>, options?: TransformOptions): TypedPassThrough<T>;
    errorTransform<T>(options?: TransformOptions): ErrorTransform<T>;
}
export declare const utilityTransforms: UtilityTransforms;
export declare const objectUtilityTransforms: UtilityTransforms;
