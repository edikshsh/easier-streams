import { TransformOptions } from 'stream';
import { SimpleTransform, TransformFunction } from '../base/simple-transform';

type ArrayElementType<T extends unknown[]> = T extends (infer U)[] ? U : never;

export function arraySplitTransform<TSource extends unknown[]>(options?: TransformOptions) {
    const transformer: TransformFunction<TSource, ArrayElementType<TSource> | undefined> = (chunks, transform) => {
        chunks.forEach((chunk) => transform.push(chunk));
        return undefined;
    };
    return new SimpleTransform(transformer, options);
}
