import { Readable } from 'stream';
import { range } from '../../../helpers/helper-functions';
import { ThrottleWindow } from '../../../streams/addons/throttle/throttle-window';
import { throttleWrapper } from '../../../streams/addons/throttle/throttle-wrapper';
import { add, streamToArray } from '../../../helpers/test-helper';
import { SimpleAsyncTransform } from '../../../streams/transforms/base/simple-async-transform';
import { addon } from '../../../streams/addon';

describe('Throttler', () => {
    function getNotThrottlingThrottler() {
        return new ThrottleWindow(1000, Number.MAX_SAFE_INTEGER);
    }
    describe('Single throttler', () => {
        it('should not block', async () => {
            const source = Readable.from(range(8, 1));
            const throttler = getNotThrottlingThrottler();
            const throttledAdd1 = addon.async.throttler(add(1), throttler);
            const add1Transform = new SimpleAsyncTransform(throttledAdd1, { objectMode: true });

            source.pipe(add1Transform);

            const result = await streamToArray(add1Transform);

            expect(result).toEqual(range(8, 2));
        });

        it('should throttle', async () => {
            const throttleTimeFrameMs = 200;
            const source = Readable.from(range(8, 1));
            const throttler = new ThrottleWindow(throttleTimeFrameMs, 6);
            const throttledAdd1 = addon.async.throttler(add(1), throttler);
            const add1Transform = new SimpleAsyncTransform(throttledAdd1, { objectMode: true });

            source.pipe(add1Transform);
            const streamStartTime = Date.now();

            await streamToArray(add1Transform);

            const timeTaken = Date.now() - streamStartTime;
            expect(timeTaken).toBeGreaterThan(throttleTimeFrameMs);
        });
    });

    describe('Multiple throttlers', () => {
        // const sixEvery100Ms = new Throttler(100, 6);
        it('should not block', async () => {
            const source = Readable.from(range(8, 1));
            const throttlers = range(2).map(getNotThrottlingThrottler);
            const throttledAdd1 = addon.async.throttler(add(1), ...throttlers);
            const add1Transform = new SimpleAsyncTransform(throttledAdd1, { objectMode: true });

            source.pipe(add1Transform);

            const result = await streamToArray(add1Transform);

            expect(result).toEqual(range(8, 2));
        });

        it('should block correctly when only first throttler throttles', async () => {
            const throttleTimeFrameMs = 200;
            const source = Readable.from(range(8, 1));
            const throttlers = [new ThrottleWindow(throttleTimeFrameMs, 6), getNotThrottlingThrottler()];
            const throttledAdd1 = addon.async.throttler(add(1), ...throttlers);
            const add1Transform = new SimpleAsyncTransform(throttledAdd1, { objectMode: true });

            source.pipe(add1Transform);
            const streamStartTime = Date.now();

            await streamToArray(add1Transform);

            const timeTaken = Date.now() - streamStartTime;
            expect(timeTaken).toBeGreaterThan(throttleTimeFrameMs);
        });

        it('should block correctly when first throttler doesnt throttle', async () => {
            const throttleTimeFrameMs = 200;
            const source = Readable.from(range(8, 1));
            const throttlers = [getNotThrottlingThrottler(), new ThrottleWindow(throttleTimeFrameMs, 6)];
            const throttledAdd1 = throttleWrapper(add(1), ...throttlers);
            const add1Transform = new SimpleAsyncTransform(throttledAdd1, { objectMode: true });

            source.pipe(add1Transform);
            const streamStartTime = Date.now();

            await streamToArray(add1Transform);

            const timeTaken = Date.now() - streamStartTime;
            expect(timeTaken).toBeGreaterThan(throttleTimeFrameMs);
        });
    });
});
