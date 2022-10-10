/// <reference types="node" />
import { TransformOptions } from "stream";
import { AsyncTransformFunction, SimpleAsyncTransform } from "./simple-async-transform";
import { SimpleTransform, TransformFunction } from "./simple-transform";
import { TypedPassThrough } from "./TypedPassThrough";
import { ArrayJoinTransform } from "./utility-transforms/array-join-transform";
import { ArraySplitTransform } from "./utility-transforms/array-split-transform";
export declare class UtilityTransforms {
    private defaultTrasformOptions?;
    constructor(defaultTrasformOptions?: TransformOptions | undefined);
    private mergeOptions;
    arrayJoin<TSource>(length: number, options?: TransformOptions): ArrayJoinTransform<TSource>;
    arraySplit<TSource>(options?: TransformOptions): ArraySplitTransform<TSource[]>;
    callOnDataSync<TSource>(functionToCallOnData: (data: TSource) => void, options?: TransformOptions): SimpleTransform<TSource, TSource>;
    callOnDataAsync<TSource>(functionToCallOnData: (data: TSource) => Promise<void>, options?: TransformOptions): SimpleAsyncTransform<TSource, TSource>;
    void<TSource>(options?: TransformOptions): SimpleTransform<TSource, void>;
    filter<TSource>(filterFunction: (chunk: TSource) => boolean, options?: TransformOptions): SimpleTransform<TSource, TSource>;
    fromFunction<TSource, TDestination>(transformer: TransformFunction<TSource, TDestination | undefined>, options?: TransformOptions): SimpleTransform<TSource, TDestination>;
    fromAsyncFunction<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: TransformOptions): SimpleAsyncTransform<TSource, TDestination>;
    passThrough<T>(options?: TransformOptions): TypedPassThrough<T>;
}
export declare const utilityTransforms: UtilityTransforms;
export declare const objectUtilityTransforms: UtilityTransforms;
