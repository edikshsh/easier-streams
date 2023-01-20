/// <reference types="node" />
import { TransformOptions } from 'stream';
import { FullTransformOptions } from './transforms/types/full-transform-options.type';
import { ErrorTransform } from './errors/error-transform';
import { AsyncTransformFunction } from './transforms/base/simple-async-transform';
import { TransformFunction } from './transforms/base/simple-transform';
import { ArraySplitTransform } from './transforms/utility/array-split-transform';
import { FilterOptions } from './transforms/utility/filter-transforms';
import { TypedPassThrough } from './transforms/utility/typed-pass-through';
import { ArrayJoinTransform } from './transforms/utility/array-join-transform';
export declare class TransformerBase {
    private defaultTrasformOptions?;
    constructor(defaultTrasformOptions?: TransformOptions | undefined);
    protected mergeOptions<T>(options?: T): TransformOptions & T;
    errorTransform<T>(options?: TransformOptions): ErrorTransform<T>;
}
export declare class Transformer extends TransformerBase {
    readonly async: AsyncTransformer;
    constructor(defaultTrasformOptions?: TransformOptions);
    arrayJoin<TSource>(length: number, options?: FullTransformOptions<TSource>): ArrayJoinTransform<TSource>;
    arraySplit<TSource>(options?: FullTransformOptions<TSource[]>): ArraySplitTransform<TSource[]>;
    callOnDataSync<TSource>(functionToCallOnData: (data: TSource) => void, options?: FullTransformOptions<TSource>): import("./transforms/base/simple-transform").SimpleTransform<TSource, TSource>;
    void<TSource>(options?: FullTransformOptions<TSource>): import("./transforms/base/simple-transform").SimpleTransform<TSource, void>;
    passThrough<T>(options?: FullTransformOptions<T>): TypedPassThrough<T>;
    filter<TSource>(filterFunction: (chunk: TSource) => boolean, options?: FullTransformOptions<TSource> & FilterOptions): import("./transforms/base/simple-transform").SimpleTransform<TSource, TSource>;
    fork<TSource>(filterFunction: (chunk: TSource) => boolean, options?: FullTransformOptions<TSource>): {
        filterTrueTransform: import("./transforms/base/simple-transform").SimpleTransform<TSource, TSource>;
        filterFalseTransform: import("./transforms/base/simple-transform").SimpleTransform<TSource, TSource>;
    };
    typeFilter<TSource, TDestination extends TSource>(filterFunction: (chunk: TSource) => chunk is TDestination, options?: FullTransformOptions<TSource>): import("./transforms/base/simple-transform").SimpleTransform<TSource, TDestination>;
    fromFunction<TSource, TDestination>(transformer: TransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): import("./transforms/base/simple-transform").SimpleTransform<TSource, TDestination>;
    pickElementFromArray<T>(index: number, options?: FullTransformOptions<T[]>): import("./transforms/base/simple-transform").SimpleTransform<T[], T>;
    fromIterable<T>(iterable: Iterable<T>, options?: TransformOptions): TypedPassThrough<T>;
}
export declare class AsyncTransformer extends TransformerBase {
    callOnData<TSource>(functionToCallOnData: (data: TSource) => Promise<void>, options?: FullTransformOptions<TSource>): import("./transforms/base/simple-async-transform").SimpleAsyncTransform<TSource, TSource>;
    filter<TSource>(filterFunction: (chunk: TSource) => Promise<boolean>, options?: FullTransformOptions<TSource> & FilterOptions): import("./transforms/base/simple-async-transform").SimpleAsyncTransform<TSource, TSource>;
    fork<TSource>(filterFunction: (chunk: TSource) => Promise<boolean>, options?: FullTransformOptions<TSource>): {
        filterTrueTransform: import("./transforms/base/simple-async-transform").SimpleAsyncTransform<TSource, TSource>;
        filterFalseTransform: import("./transforms/base/simple-async-transform").SimpleAsyncTransform<TSource, TSource>;
    };
    fromFunction<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): import("./transforms/base/simple-async-transform").SimpleAsyncTransform<TSource, TDestination>;
    fromFunctionConcurrent<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, concurrency: number, options?: FullTransformOptions<any>): {
        input: TypedPassThrough<TSource>;
        output: TypedPassThrough<TDestination>;
    };
    fromFunctionConcurrent2<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, concurrency: number, options?: FullTransformOptions<any>): import("./transforms/utility/concurrent-transform").ConcurrentTransform<TSource, TDestination>;
    fromIterable<T>(iterable: AsyncIterable<T>, options?: TransformOptions): TypedPassThrough<T>;
}
export declare const transformer: Transformer;
