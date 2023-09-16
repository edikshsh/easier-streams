import { Transform } from 'stream';
import { TransformFunction } from '../../transforms/base/simple-transform';
import { waitForThrottlers } from './wait-for-throttlers';
import { ThrottleWindow } from './throttle-window';

export function throttleWrapper<TSource, TDestination>(
    func: TransformFunction<TSource, TDestination>,
    ...throttlers: ThrottleWindow[]
) {
    return async (item: TSource, self: Transform) => {
        await waitForThrottlers(throttlers);
        return func(item, self);
    };
}
