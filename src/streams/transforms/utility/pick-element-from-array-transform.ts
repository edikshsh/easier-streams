import { TransformOptions } from 'stream';
import { fromFunctionTransform } from './from-function-transforms';

export function pickElementFromArrayTransform<T>(index: number, options?: TransformOptions) {
    return fromFunctionTransform((arr: T[]) => arr[index], options);
}
