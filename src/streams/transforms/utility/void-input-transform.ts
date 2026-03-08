import { TransformOptions } from 'stream';
import { noop } from '../../../helpers/helper-functions';
import { SimpleTransform } from '../base/simple-transform';

export function voidInputTransform<TSource>(options?: TransformOptions) {
    return new SimpleTransform<TSource, void>(noop, options);
}
