/// <reference types="node" />
import { TypedTransform } from '../typed-transform/typed-transform.interface';
import { FullTransformOptions } from '../types/full-transform-options.type';
import { TypedTransformCallback } from '../types/typed-transform-callback';
import { BaseTransform } from './base-transform';
export type TransformFunction<TSource, TDestination> = (item: TSource) => TDestination;
export declare class SimpleTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> implements TypedTransform<TSource, TDestination> {
    private transformer;
    private options?;
    constructor(transformer: TransformFunction<TSource, TDestination | undefined>, options?: FullTransformOptions<TSource> | undefined);
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>): void;
}
