import { Readable } from 'stream';
import { range } from '../../../helpers/helper-functions';
import { add, filterOutEvens, getFailOnNumberFunction, numberToString, DEFAULT_ERROR_TEXT } from '../../../helpers/test-helper';
import { SimpleTransform } from '../../../streams/transforms/base/simple-transform';

describe('SimpleTransform', () => {
    it('creates a typed transform from function', async () => {
        const source = Readable.from(range(8, 1));
        const add1Transform = new SimpleTransform(add(1), { objectMode: true });

        source.pipe(add1Transform);

        const result = await add1Transform.toArray();

        expect(result).toEqual(range(8, 2));
    });

    it('propagates errors from the transform function', async () => {
        const source = Readable.from(range(8, 1));
        const failOnThree = new SimpleTransform(getFailOnNumberFunction(3), { objectMode: true });
        source.pipe(failOnThree);

        await expect(failOnThree.toArray()).rejects.toThrow(DEFAULT_ERROR_TEXT);
    });

    it('pipes created transforms correctly', async () => {
        const source = Readable.from(range(8, 1));
        const add1Transform = new SimpleTransform(add(1), { objectMode: true });
        const filterOutEvensTransform = new SimpleTransform(filterOutEvens, { objectMode: true });
        const numberToStringTransform = new SimpleTransform(numberToString, { objectMode: true });

        source.pipe(add1Transform).pipe(filterOutEvensTransform).pipe(numberToStringTransform);

        const result = await numberToStringTransform.toArray();

        expect(result).toEqual(['3', '5', '7', '9']);
    });
});
