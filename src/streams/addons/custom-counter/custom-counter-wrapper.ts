import { Transform } from 'stream';
import { TransformFunction } from '../../transforms/base/simple-transform';
import { AsyncTransformFunction } from '../../transforms/base/simple-async-transform';
import { CustomCounterEvents } from './custom-counter-events';

export function customCounterSyncWrapper<TSource, TDestination, Counter extends Record<string, number>>(
    func: TransformFunction<TSource, TDestination>,
    counter: Counter,
    events: Partial<CustomCounterEvents<TSource, TDestination, Counter>>,
) {
    return (item: TSource, self: Transform) => {
        events.beforeTransformer && events.beforeTransformer(item, counter);
        let itemAfterTransformer;
        try {
            itemAfterTransformer = func(item, self);
        } catch (error) {
            events.onError && events.onError(item, error, counter);
            throw error;
        }
        events.afterTransformer && events.afterTransformer(itemAfterTransformer, counter);
        return itemAfterTransformer;
    };
}

export function customCounterAsyncWrapper<TSource, TDestination, Counter extends Record<string, number>>(
    func: AsyncTransformFunction<TSource, TDestination>,
    counter: Counter,
    events: Partial<CustomCounterEvents<TSource, TDestination, Counter>>,
) {
    return async (item: TSource, self: Transform) => {
        events.beforeTransformer && events.beforeTransformer(item, counter);
        let itemAfterTransformer;
        try {
            itemAfterTransformer = await func(item, self);
        } catch (error) {
            events.onError && events.onError(item, error, counter);
            throw error;
        }
        events.afterTransformer && events.afterTransformer(itemAfterTransformer, counter);
        return itemAfterTransformer;
    };
}
