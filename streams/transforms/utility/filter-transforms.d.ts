import { SimpleAsyncTransform } from "../base/simple-async-transform";
import { SimpleTransform } from "../base/simple-transform";
import { FullTransformOptions } from "../types/full-transform-options.type";
export declare function filterTransform<TSource>(filterFunction: (chunk: TSource) => boolean, options?: FullTransformOptions<TSource>): SimpleTransform<TSource, TSource>;
export declare function asyncFilterTransform<TSource>(filterFunction: (chunk: TSource) => Promise<boolean>, options?: FullTransformOptions<TSource>): SimpleAsyncTransform<TSource, TSource>;
