import { TransformOptions } from 'stream';
import { AsyncTransformFunction, SimpleAsyncTransform } from '../base/simple-async-transform';
import { SimpleTransform, TransformFunction } from '../base/simple-transform';

export function fromFunctionTransform<TSource, TDestination>(
    transformer: TransformFunction<TSource, TDestination | undefined>,
    options?: TransformOptions,
) {
    return new SimpleTransform<TSource, TDestination>(transformer, options);
}

export function fromAsyncFunctionTransform<TSource, TDestination>(
    transformer: AsyncTransformFunction<TSource, TDestination | undefined>,
    options?: TransformOptions,
) {
    return new SimpleAsyncTransform<TSource, TDestination>(transformer, options);
}
