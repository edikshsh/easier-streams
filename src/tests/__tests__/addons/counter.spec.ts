import { Readable } from 'stream';
import { range } from '../../../helpers/helper-functions';
import { add, addAsync, streamToArray, thrower } from '../../../helpers/test-helper';
import { SimpleAsyncTransform } from '../../../streams/transforms/base/simple-async-transform';
import { getEmptyCounter } from '../../../streams/addons/counter/get-empty-counter';
import { SimpleTransform } from '../../../streams/transforms/base/simple-transform';
import { addon } from '../../../streams/addon';

describe('Counter', () => {
    describe('Sync', () => {
        it('should not block', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyCounter();
            const countingAdd1 = addon.counter(add(1), counter);
            const add1Transform = new SimpleTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            const result = await streamToArray(add1Transform);

            expect(result).toEqual(range(8, 2));
        });

        it('should count', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyCounter();
            const countingAdd1 = addon.counter(add(1), counter);
            const add1Transform = new SimpleTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            await streamToArray(add1Transform);

            expect(counter.in).toEqual(8);
            expect(counter.out).toEqual(8);
        });

        it('should count only "in" when chunks throw', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyCounter();
            const throwingFunction = addon.counter(thrower<number>(), counter);
            const transform = new SimpleTransform(throwingFunction, { objectMode: true, ignoreErrors: true });

            source.pipe(transform);

            await streamToArray(transform);

            expect(counter.in).toEqual(8);
            expect(counter.out).toEqual(0);
        });
    });

    describe('Async', () => {
        it('should not block', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyCounter();
            const countingAdd1 = addon.async.counter(addAsync(1), counter);
            const add1Transform = new SimpleAsyncTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            const result = await streamToArray(add1Transform);

            expect(result).toEqual(range(8, 2));
        });

        it('should count', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyCounter();
            const countingAdd1 = addon.async.counter(addAsync(1), counter);
            const add1Transform = new SimpleAsyncTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            await streamToArray(add1Transform);

            expect(counter.in).toEqual(8);
            expect(counter.out).toEqual(8);
        });
    });
});
