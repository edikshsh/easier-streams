import { TransformOptions } from 'stream';
import { AsyncTransformFunction } from '../base/simple-async-transform';
import { ConcurrentTransform } from './concurrent-transform';

export function fromFunctionConcurrentTransform<TSource, TDestination>(
    transformer: AsyncTransformFunction<TSource, TDestination | undefined>,
    concurrency: number,
    options: TransformOptions = {},
) {
    return new ConcurrentTransform(transformer, concurrency, options);
}
