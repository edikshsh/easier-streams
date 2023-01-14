import { SimpleTransform } from '../base/simple-transform';
import { FullTransformOptions } from '../types/full-transform-options.type';
export declare function typeFilterTransform<TSource, TDestination extends TSource>(typeFilterFunction: (chunk: TSource) => chunk is TDestination, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TDestination>;
