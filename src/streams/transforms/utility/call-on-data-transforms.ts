import { TransformOptions } from 'stream';
import { SimpleAsyncTransform } from '../base/simple-async-transform';
import { SimpleTransform } from '../base/simple-transform';

export function callOnDataSyncTransform<TSource>(
    functionToCallOnData: (data: TSource) => void,
    options?: TransformOptions,
) {
    const callOnData = (data: TSource) => {
        functionToCallOnData(data);
        return data;
    };
    return new SimpleTransform(callOnData, options);
}

export function callOnDataAsyncTransform<TSource>(
    functionToCallOnData: (data: TSource) => Promise<void>,
    options?: TransformOptions,
) {
    const callOnData = async (data: TSource) => {
        await functionToCallOnData(data);
        return data;
    };
    return new SimpleAsyncTransform(callOnData, options);
}
