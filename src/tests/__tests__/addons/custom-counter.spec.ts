import { Readable } from 'stream';
import { range } from '../../../helpers/helper-functions';
import { add, addAsync, streamToArray, thrower } from '../../../helpers/test-helper';
import { SimpleAsyncTransform } from '../../../streams/transforms/base/simple-async-transform';
import { SimpleTransform } from '../../../streams/transforms/base/simple-transform';
import {
    customCounterAsyncWrapper,
    customCounterSyncWrapper,
} from '../../../streams/addons/custom-counter/custom-counter-wrapper';
import { CustomCounterEvents } from '../../../streams/addons/custom-counter/custom-counter-events';
import { CustomCounterFunction } from '../../../streams/addons/custom-counter/custom-counter-function.type';
import { CustomCounterErrorFunction } from '../../../streams/addons/custom-counter/custom-counter-error-function.type';

type BasicCounter = { in: number; out: number; both: number; sum: number; errors: number };

describe('Custom Counter', () => {
    const getEmptyBasicCounter = () => ({
        in: 0,
        out: 0,
        both: 0,
        sum: 0,
        errors: 0,
    });

    const basicInCounterFunction: CustomCounterFunction<number, BasicCounter> = (n, counter) => {
        counter.in++;
        counter.both++;
        counter.sum += n;
    };

    const basicOutCounterFunction: CustomCounterFunction<number, BasicCounter> = (n, counter) => {
        counter.out++;
        counter.both++;
    };

    const basicErrorCounterFunction: CustomCounterErrorFunction<number, BasicCounter> = (n, error, counter) => {
        counter.errors++;
    };

    const basicCounterEvents: Partial<CustomCounterEvents<number, number, BasicCounter>> = {
        beforeTransformer: basicInCounterFunction,
        afterTransformer: basicOutCounterFunction,
        onError: basicErrorCounterFunction,
    };

    describe('Sync', () => {
        it('should not block', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyBasicCounter();
            const countingAdd1 = customCounterSyncWrapper(add(1), counter, basicCounterEvents);
            const add1Transform = new SimpleTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            const result = await streamToArray(add1Transform);

            expect(result).toEqual(range(8, 2));
        });

        it('should count', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyBasicCounter();
            const countingAdd1 = customCounterSyncWrapper(add(1), counter, basicCounterEvents);
            const add1Transform = new SimpleTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            await streamToArray(add1Transform);

            expect(counter.in).toEqual(8);
            expect(counter.out).toEqual(8);
            expect(counter.both).toEqual(16);
        });

        it('should have access to chunk when counting', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyBasicCounter();
            const countingAdd1 = customCounterSyncWrapper(add(1), counter, basicCounterEvents);
            const add1Transform = new SimpleTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            await streamToArray(add1Transform);

            expect(counter.sum).toEqual(36);
        });

        it('should count errors', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyBasicCounter();
            const countingAdd1 = customCounterSyncWrapper(thrower<number>(), counter, basicCounterEvents);
            const add1Transform = new SimpleTransform(countingAdd1, { objectMode: true, ignoreErrors: true });

            source.pipe(add1Transform);

            await streamToArray(add1Transform);

            expect(counter.sum).toEqual(36);
            expect(counter.in).toEqual(8);
            expect(counter.out).toEqual(0);
            expect(counter.errors).toEqual(8);
        });
    });

    describe('Async', () => {
        it('should not block', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyBasicCounter();
            const countingAdd1 = customCounterAsyncWrapper(addAsync(1), counter, basicCounterEvents);
            const add1Transform = new SimpleAsyncTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);
            const result = await streamToArray(add1Transform);

            expect(result).toEqual(range(8, 2));
        });

        it('should count', async () => {
            const source = Readable.from(range(8, 1));
            const counter = getEmptyBasicCounter();
            const countingAdd1 = customCounterAsyncWrapper(addAsync(1), counter, basicCounterEvents);
            const add1Transform = new SimpleAsyncTransform(countingAdd1, { objectMode: true });

            source.pipe(add1Transform);

            await streamToArray(add1Transform);

            expect(counter.in).toEqual(8);
            expect(counter.out).toEqual(8);
            expect(counter.both).toEqual(16);
        });
    });
});
