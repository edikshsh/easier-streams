import { SimpleAsyncTransform } from '../base/simple-async-transform';
import { SimpleTransform } from '../base/simple-transform';
import { FullTransformOptions } from '../types/full-transform-options.type';
export declare function callOnDataSyncTransform<TSource>(functionToCallOnData: (data: TSource) => void, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TSource>;
export declare function callOnDataAsyncTransform<TSource>(functionToCallOnData: (data: TSource) => Promise<void>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TSource>;
