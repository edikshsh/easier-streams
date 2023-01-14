/// <reference types="node" />
import { FullTransformOptions } from '../types/full-transform-options.type';
import { TypedTransformCallback } from '../types/typed-transform-callback';
import { BaseTransform } from '../base/base-transform';
type ArrayElementType<T extends unknown[]> = T extends (infer U)[] ? U : never;
export declare class ArraySplitTransform<TSource extends unknown[]> extends BaseTransform<TSource, ArrayElementType<TSource>> {
    private options?;
    constructor(options?: FullTransformOptions<TSource> | undefined);
    _transform(chunks: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<ArrayElementType<TSource>>): void;
}
export {};
