import { TransformOptions } from 'stream';
import { AsyncFilterFunction, FilterFunction } from '../types/filter-function.type';
import { callOnDataSyncTransform, callOnDataAsyncTransform } from './call-on-data-transforms';

export function counterTransform<TSource>(
    countFilter?: FilterFunction<TSource>,
    options?: TransformOptions,
) {
    const shouldCounterBeIncreased = countFilter || (() => true);
    let count = 0;

    const counter = (chunk: TSource) => {
        count += shouldCounterBeIncreased(chunk) ? 1 : 0;
    };

    const transform = callOnDataSyncTransform(counter, options);
    const getCounter = () => count;
    return { transform, getCounter };
}

export function asyncCounterTransform<TSource>(
    countFilter: AsyncFilterFunction<TSource>,
    options?: TransformOptions,
) {
    let count = 0;

    const counter = async (chunk: TSource) => {
        count += (await countFilter(chunk)) ? 1 : 0;
    };

    const transform = callOnDataAsyncTransform(counter, options);
    const getCounter = () => count;
    return { transform, getCounter };
}
