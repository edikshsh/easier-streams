import { TransformCallback, TransformOptions } from 'stream';
import { SimpleTransform, TransformFunction } from '../base/simple-transform';

export function arrayJoinTransform<TSource>(length: number, options?: TransformOptions) {
    let array: TSource[] = [];
    const transformer: TransformFunction<TSource, TSource[] | undefined> = (chunk) => {
        array.push(chunk);
        if (array.length >= length) {
            const tempArray = array;
            array = [];
            return tempArray;
        }
        return undefined;
    };
    const optionsWithFlush: TransformOptions = {
        ...options,
        flush: (callback: TransformCallback) => {
            callback(null, array.length ? array : undefined);
        },
    };
    return new SimpleTransform(transformer, optionsWithFlush);
}
