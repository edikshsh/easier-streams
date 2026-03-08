import { Readable } from 'stream';
import { transformer } from '../../../streams/transformer';
import { add, addAsync, filterOutEvens, filterOutEvensAsync, numberToString, numberToStringAsync } from '../../../helpers/test-helper';
import { range } from '../../../helpers/helper-functions';

describe('fromFunction', () => {
    describe('sync', () => {
        it('creates a typed transform from function', async () => {
            const source = Readable.from(range(8, 1));
            const add1Transform = transformer.fromFunction(add(1), { objectMode: true });

            source.pipe(add1Transform);

            const result = await add1Transform.toArray();
            expect(result).toEqual(range(8, 2));
        });

        it('pipes created transforms correctly', async () => {
            const source = Readable.from(range(8, 1));
            const add1Transform = transformer.fromFunction(add(1));
            const filterOutOddsTranform = transformer.fromFunction(filterOutEvens);
            const numberToStringTrasnform = transformer.fromFunction(numberToString);

            source.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);

            const result = await numberToStringTrasnform.toArray();
            expect(result).toEqual(['3', '5', '7', '9']);
        });
    });

    describe('async', () => {
        it('creates a typed transform from async function', async () => {
            const source = Readable.from(range(8, 1));
            const add1Transform = transformer.async.fromFunction(addAsync(1), { objectMode: true });

            source.pipe(add1Transform);

            const result = await add1Transform.toArray();
            expect(result).toEqual(range(8, 2));
        });

        it('pipes created transforms correctly', async () => {
            const source = Readable.from(range(8, 1));
            const add1Transform = transformer.async.fromFunction(addAsync(1));
            const filterOutOddsTransform = transformer.async.fromFunction(filterOutEvensAsync);
            const numberToStringTransform = transformer.async.fromFunction(numberToStringAsync);

            source.pipe(add1Transform).pipe(filterOutOddsTransform).pipe(numberToStringTransform);

            const result = await numberToStringTransform.toArray();
            expect(result).toEqual(['3', '5', '7', '9']);
        });

        it('handles non immediate async functions', async () => {
            const source = Readable.from(range(8, 1));
            const filterOutOdds = async (n: number) => {
                await new Promise((res) => setTimeout(res, 20));
                return n % 2 ? n : undefined;
            };

            const add1Transform = transformer.async.fromFunction(addAsync(1));
            const filterOutOddsTranform = transformer.async.fromFunction(filterOutOdds);
            const numberToStringTrasnform = transformer.async.fromFunction(numberToStringAsync);

            source.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);

            const result = await numberToStringTrasnform.toArray();
            expect(result).toEqual(['3', '5', '7', '9']);
        });
    });
});
