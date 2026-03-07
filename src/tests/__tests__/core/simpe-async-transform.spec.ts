import { Readable } from 'stream';
import { SimpleAsyncTransform } from '../../../streams/transforms/base/simple-async-transform';
import { range } from '../../../helpers/helper-functions';
import { addAsync, filterOutEvensAsync, getFailOnNumberAsyncFunction, numberToStringAsync, DEFAULT_ERROR_TEXT } from '../../../helpers/test-helper';

describe('SimpleAsyncTransform', () => {
    it('creates a typed transform from function', async () => {
        const source = Readable.from(range(8, 1));
        const add1Transform = new SimpleAsyncTransform(addAsync(1), { objectMode: true });

        source.pipe(add1Transform);

        const result = await add1Transform.toArray();
        expect(result).toEqual(range(8, 2));
    });

    it('propagates errors from the async transform function', async () => {
        const source = Readable.from(range(8, 1));
        const failOnThree = new SimpleAsyncTransform(getFailOnNumberAsyncFunction(3), { objectMode: true });
        source.pipe(failOnThree);

        await expect(failOnThree.toArray()).rejects.toThrow(DEFAULT_ERROR_TEXT);
    });

    it('pipes created transforms correctly', async () => {
        const source = Readable.from(range(8, 1));
        const add1Transform = new SimpleAsyncTransform(addAsync(1), { objectMode: true });
        const filterOutOddsTranform = new SimpleAsyncTransform(filterOutEvensAsync, { objectMode: true });
        const numberToStringTrasnform = new SimpleAsyncTransform(numberToStringAsync, { objectMode: true });

        source.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);

        const result = await numberToStringTrasnform.toArray();

        expect(result).toEqual(['3', '5', '7', '9']);
    });

    it('handles non immediate async functions', async () => {
        const source = Readable.from(range(8, 1));
        const filterOutOdds = async (n: number) => {
            await new Promise((res) => setTimeout(res, 10));
            return n % 2 ? n : undefined;
        };

        const add1Transform = new SimpleAsyncTransform(addAsync(1), { objectMode: true });
        const filterOutOddsTranform = new SimpleAsyncTransform(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = new SimpleAsyncTransform(numberToStringAsync, { objectMode: true });

        source.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);

        const result = await numberToStringTrasnform.toArray();

        expect(result).toEqual(['3', '5', '7', '9']);
    });
});
