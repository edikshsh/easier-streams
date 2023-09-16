import { Transform } from 'stream';
import { TransformFunction } from '../../transforms/base/simple-transform';
import { waitForThrottlers } from './wait-for-throttlers';
import { Throttler } from './throttler';

export function throttleWrapper<TSource, TDestination>(
    func: TransformFunction<TSource, TDestination>,
    ...throttlers: Throttler[]
) {
    return async (item: TSource, self: Transform) => {
        await waitForThrottlers(throttlers);
        return func(item, self);
    };
}
