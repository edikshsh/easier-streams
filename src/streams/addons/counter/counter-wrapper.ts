import { TransformFunction } from '../../transforms/base/simple-transform';
import { AsyncTransformFunction } from '../../transforms/base/simple-async-transform';
import { Counter } from './basic-counter.type';
import { customCounterAsyncWrapper, customCounterSyncWrapper } from '../custom-counter/custom-counter-wrapper';

export function counterSyncWrapper<TSource, TDestination>(
    func: TransformFunction<TSource, TDestination>,
    counter: Counter,
) {
    return customCounterSyncWrapper(func, counter, {
        beforeTransformer: () => counter.in++,
        afterTransformer: () => counter.out++,
    });
}

export function counterAsyncWrapper<TSource, TDestination>(
    func: AsyncTransformFunction<TSource, TDestination>,
    counter: Counter,
) {
    return customCounterAsyncWrapper(func, counter, {
        beforeTransformer: () => counter.in++,
        afterTransformer: () => counter.out++,
    });
}
