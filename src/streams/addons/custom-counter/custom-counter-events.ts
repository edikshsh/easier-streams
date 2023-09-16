import { CustomCounterErrorFunction } from './custom-counter-error-function.type';
import { CustomCounterFunction } from './custom-counter-function.type';

export type CustomCounterEvents<TSource, TDestination, Counter extends Record<string, number>> = {
    beforeTransformer: CustomCounterFunction<TSource, Counter>;
    onError: CustomCounterErrorFunction<TSource, Counter>;
    afterTransformer: CustomCounterFunction<TDestination, Counter>;
};
