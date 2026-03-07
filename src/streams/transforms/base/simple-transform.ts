import { Transform, TransformOptions } from 'stream';
import { TypedTransform } from '../typed-transform/typed-transform.interface';
import { TypedTransformCallback } from '../types/typed-transform-callback';
import { BaseTransform } from './base-transform';

export type TransformFunction<TSource, TDestination> = (item: TSource, self: Transform) => TDestination;

export class SimpleTransform<TSource, TDestination>
    extends BaseTransform<TSource, TDestination>
    implements TypedTransform<TSource, TDestination>
{
    constructor(
        private transformer: TransformFunction<TSource, TDestination | undefined>,
        options?: TransformOptions,
    ) {
        super(options);
    }

    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>) {
        try {
            const result = this.transformer(chunk, this);
            callback(null, result);
        } catch (error) {
            callback(error as Error);
        }
    }
}
