import { Transform, TransformOptions } from 'stream';
import { BaseTransform } from './base-transform';
import { TransformFunction } from './simple-transform';
import { TypedTransformCallback } from '../types/typed-transform-callback';

export type AsyncTransformFunction<TSource, TDestination> = TransformFunction<TSource, Promise<TDestination>>;

export class SimpleAsyncTransform<TSource, TDestination> extends BaseTransform<TSource, TDestination> {
    constructor(
        private transformer: AsyncTransformFunction<TSource, TDestination | undefined>,
        options?: TransformOptions,
    ) {
        super(options);
    }

    async _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>) {
        try {
            const result = await this.transformer(chunk, this as Transform);
            return callback(null, result);
        } catch (error) {
            return callback(error as Error);
        }
    }
}
