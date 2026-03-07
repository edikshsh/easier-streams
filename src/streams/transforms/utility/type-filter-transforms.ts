import { TransformOptions } from 'stream';
import { SimpleTransform } from '../base/simple-transform';
import { FilterOptions, onFilterError } from './filter-transforms';

export function typeFilterTransform<TSource, TDestination extends TSource>(
    typeFilterFunction: (chunk: TSource) => chunk is TDestination,
    options?: TransformOptions & FilterOptions,
) {
    const filter = (chunk: TSource) => {
        try {
            return typeFilterFunction(chunk) ? chunk : undefined;
        } catch (error) {
            onFilterError(error, options?.considerErrorAsFilterOut);
        }
    };
    return new SimpleTransform<TSource, TDestination>(filter, options);
}
