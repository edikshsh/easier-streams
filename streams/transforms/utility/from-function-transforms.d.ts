import { AsyncTransformFunction, SimpleAsyncTransform } from '../base/simple-async-transform';
import { SimpleTransform, TransformFunction } from '../base/simple-transform';
import { FullTransformOptions } from '../types/full-transform-options.type';
export declare function fromFunctionTransform<TSource, TDestination>(transformer: TransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TDestination>;
export declare function fromAsyncFunctionTransform<TSource, TDestination>(transformer: AsyncTransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TDestination>;
