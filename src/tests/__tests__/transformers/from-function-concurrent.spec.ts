import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { transformer } from '../../../streams/transformer';
import { noop, range } from '../../../helpers/helper-functions';
import {
    DEFAULT_ERROR_TEXT,
    delayer,
    delayerMult2,
    getFailOnNumberAsyncFunctionMult2,
    getFailOnNumberFunction,
} from '../../../helpers/test-helper';
import { eventPromisifier } from '../../../emitters/eventPromisifier';

describe('fromFunctionConcurrent', () => {
    const errorOn4 = getFailOnNumberFunction(4);

    it('should return correct but unordered output', async () => {
        const delay = 20;
        const concurrency = 5;
        const arr = range(200, 1);
        const expectedOutput = arr.map((n) => n * 2);

        const concurrentTransform = transformer.async.fromFunctionConcurrent(delayerMult2(delay), concurrency);

        Readable.from(arr).pipe(concurrentTransform);

        const outArr = await concurrentTransform.toArray();

        outArr.sort((a, b) => a - b);
        expect(outArr).toEqual(expectedOutput);
    });

    it('should take less time then running sequentially', async () => {
        const delay = 20;
        const concurrency = 5;
        const arr = range(100);
        const estimatedRunTimeSequential = delay * arr.length;
        const startTime = Date.now();

        const concurrentTransform = transformer.async.fromFunctionConcurrent(delayerMult2(delay), concurrency);

        Readable.from(arr).pipe(concurrentTransform);

        await concurrentTransform.toArray();
        expect(estimatedRunTimeSequential).toBeGreaterThan(Date.now() - startTime);
    });

    it('should send error to output if one of the concurrent actions fails', async () => {
        const delay = 10;
        const errorOnIndex = 20;
        const arr = range(100);
        const outArr: number[] = [];
        const concurrency = 5;

        const concurrentTransform = transformer.async.fromFunctionConcurrent(
            getFailOnNumberAsyncFunctionMult2(errorOnIndex, delay),
            concurrency,
        );

        Readable.from(arr).pipe(concurrentTransform);

        concurrentTransform.on('data', (data) => {
            outArr.push(data);
        });
        await expect(concurrentTransform.promisifyEvents(['end'], ['error'])).rejects.toThrow(DEFAULT_ERROR_TEXT);
        expect(outArr.length).toBeLessThan(errorOnIndex);
    });

    it('should not break pipeline chain of error passing if error comes before concurrent', async () => {
        const delay = 10;
        const arr = range(30);
        const concurrency = 5;

        const erroringTransform = transformer.fromFunction(errorOn4);
        const concurrentTransform = transformer.async.fromFunctionConcurrent(delayer(delay), concurrency);
        const source = transformer.fromIterable(arr);

        const streamDonePromise = concurrentTransform.promisifyEvents('close', 'error');
        pipeline(source as Transform, erroringTransform as Transform, concurrentTransform).catch(noop);
        await expect(streamDonePromise).rejects.toThrow(DEFAULT_ERROR_TEXT);
    });

    it('should not break pipeline chain of error passing if error comes after concurrent', async () => {
        const delay = 10;
        const arr = range(30);
        const concurrency = 5;

        const concurrentTransform = transformer.async.fromFunctionConcurrent(delayer(delay), concurrency);
        const erroringTransform = transformer.fromFunction(errorOn4);
        const passThrough = transformer.passThrough();
        const source = transformer.fromIterable(arr);

        const p = passThrough.promisifyEvents('close', 'error');
        pipeline(source as Transform, concurrentTransform as Transform, erroringTransform as Transform, passThrough).catch(noop);
        await expect(p).rejects.toThrow(DEFAULT_ERROR_TEXT);
    });

    it('should not break pipeline chain of error passing if concurrent errors', async () => {
        const delay = 10;
        const errorOnIndex = 10;
        const arr = range(30);
        const concurrency = 5;

        const concurrentTransform = transformer.async.fromFunctionConcurrent(
            getFailOnNumberAsyncFunctionMult2(errorOnIndex, delay),
            concurrency,
        );
        const passThrough = transformer.passThrough();
        const source = transformer.fromIterable(arr);

        const p = passThrough.promisifyEvents('close', 'error');
        pipeline(source as Transform, concurrentTransform as Transform, passThrough).catch(noop);
        await expect(p).rejects.toThrow(DEFAULT_ERROR_TEXT);
    });

    it('doesnt break backpressure', async () => {
        const delay = 10;
        const arr = range(300);
        const outArr: number[] = [];
        const concurrency = 2;

        const concurrentTransform = transformer.async.fromFunctionConcurrent(delayer(delay), concurrency);

        const readable = Readable.from(arr);
        readable.pipe(concurrentTransform);
        readable.on('data', () => {});

        concurrentTransform.on('data', (data) => {
            outArr.push(data);
        });
        await eventPromisifier._promisifyEvents(readable, 'close');
        expect(outArr.length).toBeGreaterThan(arr.length - 50);
        await concurrentTransform.promisifyEvents('close', 'error');
        expect(outArr.length).toBe(arr.length);
    });
});
