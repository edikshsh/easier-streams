/// <reference types="node" />
import { TransformOptions } from "stream";
import { FullTransformOptions } from "./transforms/types/full-transform-options.type";
import { ErrorTransform } from "./errors/error-transform";
import { AsyncTransformFunction, SimpleAsyncTransform } from "./transforms/base/simple-async-transform";
import { SimpleTransform, TransformFunction } from "./transforms/base/simple-transform";
import { ArraySplitTransform } from "./transforms/utility/array-split-transform";
import { TypedPassThrough } from "./transforms/utility/typed-pass-through";
import { ArrayJoinTransform } from "./transforms/utility/array-join-transform";
export declare class TransformsHelperBase {
    private defaultTrasformOptions?;
    constructor(defaultTrasformOptions?: TransformOptions | undefined);
    protected mergeOptions<T>(options?: T): TransformOptions & T;
    errorTransform<T>(options?: TransformOptions): ErrorTransform<T>;
}
export declare class TransformsHelper extends TransformsHelperBase {
    readonly async: AsyncTransformsHelper;
    constructor(defaultTrasformOptions?: TransformOptions);
    arrayJoin<TSource>(length: number, options?: FullTransformOptions<TSource>): ArrayJoinTransform<TSource>;
    arraySplit<TSource>(options?: FullTransformOptions<TSource[]>): ArraySplitTransform<TSource[]>;
    callOnDataSync<TSource>(functionToCallOnData: (data: TSource) => void, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TSource>;
    void<TSource>(options?: FullTransformOptions<TSource>): SimpleTransform<TSource, void>;
    passThrough<T>(options?: FullTransformOptions<T>): TypedPassThrough<T>;
    filter<TSource>(filterFunction: (chunk: TSource) => boolean, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TSource>;
    fromFunction<TSource, TDestination>(transformer: TransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TDestination>;
    pickElementFromArray<T>(index: number, options?: FullTransformOptions<T[]>): SimpleTransform<T[], T>;
    fromIterable<T>(iterable: Iterable<T>, options?: TransformOptions): TypedPassThrough<T>;
}
export declare class AsyncTransformsHelper extends TransformsHelperBase {
    callOnData<TSource>(functionToCallOnData: (data: TSource) => Promise<void>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TSource>;
    filter<TSource>(filterFunction: (chunk: TSource) => Promise<boolean>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TSource>;
    fromFunction<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TDestination>;
    fromFunctionConcurrent<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, concurrency: number, options?: FullTransformOptions<any>): {
        input: TypedPassThrough<TSource>;
        output: TypedPassThrough<TDestination>;
    };
    fromIterable<T>(iterable: AsyncIterable<T>, options?: TransformOptions): TypedPassThrough<T>;
}
export declare const transformsHelper: TransformsHelper;
export declare const objectTransformsHelper: TransformsHelper;
