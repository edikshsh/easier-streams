/// <reference types="node" />
import { TransformOptions } from "stream";
import { SimpleAsyncTransform } from "./simple-async-transform";
import { SimpleTransform } from "./simple-transform";
import { ArrayJoinTransform } from "./utility-transforms/array-join-transform";
import { ArraySplitTransform } from "./utility-transforms/array-split-transform";
declare type PassedFunctionOptions = {
    shouldBeAwaited: boolean;
};
export declare class UtilityTransforms {
    private defaultTrasformOptions?;
    constructor(defaultTrasformOptions?: TransformOptions | undefined);
    private mergeOptions;
    arrayJoin<TSource>(length: number, options?: TransformOptions): ArrayJoinTransform<TSource>;
    arraySplit<TSource extends any[]>(options?: TransformOptions): ArraySplitTransform<TSource>;
    callOnData<TSource>(functionToCallOnData: (data: TSource) => (void | Promise<void>), options?: {
        transformOptions?: TransformOptions;
        functionOptions?: PassedFunctionOptions;
    }): SimpleAsyncTransform<TSource, TSource> | SimpleTransform<TSource, TSource>;
    void<TSource>(options?: TransformOptions): SimpleTransform<TSource, void>;
    filter<TSource>(filterFunction: (chunk: TSource) => boolean, options?: TransformOptions): SimpleTransform<TSource, TSource>;
    fromFunction<TSource, TDestination>(...[transformer, options]: ConstructorParameters<typeof SimpleTransform<TSource, TDestination>>): SimpleTransform<TSource, TDestination>;
    fromAsyncFunction<TSource, TDestination>(...[transformer, options]: ConstructorParameters<typeof SimpleAsyncTransform<TSource, TDestination>>): SimpleAsyncTransform<TSource, TDestination>;
}
export declare const utilityTransforms: UtilityTransforms;
export declare const objectUtilityTransforms: UtilityTransforms;
export {};
