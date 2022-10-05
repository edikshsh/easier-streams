"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const simple_async_transform_1 = require("../classes/simple-async-transform");
const simple_transform_1 = require("../classes/simple-transform");
const stream_pipe_1 = require("../classes/stream-pipe");
const helpers_for_tests_1 = require("./helpers-for-tests");
describe('Stream pipe', () => {
    it('should pipe transforms', () => __awaiter(void 0, void 0, void 0, function* () {
        const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]).pipe(new simple_transform_1.SimpleTransform((n) => n, { objectMode: true }));
        const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
        const create3ElementsFrom1 = (n) => [n + 1, n + 2, n + 3];
        const takeOnlyFirstElementOfArray = (arr) => arr[0];
        const filterOutOdds = (n) => n % 2 ? undefined : n;
        const numberToString = (n) => n.toString();
        const add1Transform = (new simple_async_transform_1.SimpleAsyncTransform(add1, { objectMode: true }));
        const create3ElementsFrom1Transform = (new simple_transform_1.SimpleTransform(create3ElementsFrom1, { objectMode: true }));
        const takeOnlyFirstElementOfArrayTransform = (new simple_transform_1.SimpleTransform(takeOnlyFirstElementOfArray, { objectMode: true }));
        const filterOutOddsTranform = new simple_transform_1.SimpleTransform(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = new simple_transform_1.SimpleTransform(numberToString, { objectMode: true });
        const streamPipe = (0, stream_pipe_1.getStreamPipe)(a, add1Transform, create3ElementsFrom1Transform, takeOnlyFirstElementOfArrayTransform, filterOutOddsTranform, numberToStringTrasnform);
        const result = [];
        streamPipe.destination.on('data', (data) => result.push(data));
        yield (0, helpers_for_tests_1.streamEnd)(streamPipe.destination);
        expect(result).toEqual(['4', '6', '8', '10']);
    }));
    it('should pipe async transforms', () => __awaiter(void 0, void 0, void 0, function* () {
        const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]).pipe(new simple_transform_1.SimpleTransform((n) => n, { objectMode: true }));
        const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
        const create3ElementsFrom1 = (n) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, helpers_for_tests_1.sleep)(100);
            return [n + 1, n + 2, n + 3];
        });
        const takeOnlyFirstElementOfArray = (arr) => arr[0];
        const filterOutOdds = (n) => n % 2 ? undefined : n;
        const numberToString = (n) => n.toString();
        const add1Transform = (new simple_async_transform_1.SimpleAsyncTransform(add1, { objectMode: true }));
        const create3ElementsFrom1Transform = (new simple_async_transform_1.SimpleAsyncTransform(create3ElementsFrom1, { objectMode: true }));
        const takeOnlyFirstElementOfArrayTransform = (new simple_transform_1.SimpleTransform(takeOnlyFirstElementOfArray, { objectMode: true }));
        const filterOutOddsTranform = new simple_transform_1.SimpleTransform(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = new simple_transform_1.SimpleTransform(numberToString, { objectMode: true });
        const streamPipe = (0, stream_pipe_1.getStreamPipe)(a, add1Transform, create3ElementsFrom1Transform, takeOnlyFirstElementOfArrayTransform, filterOutOddsTranform, numberToStringTrasnform);
        const result = [];
        streamPipe.on('data', (data) => result.push(data));
        yield (0, helpers_for_tests_1.streamEnd)(streamPipe.destination);
        expect(result).toEqual(['4', '6', '8', '10']);
    }));
    it('should promisify the end of stream correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]).pipe(new simple_transform_1.SimpleTransform((n) => n, { objectMode: true }));
        const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
        const create3ElementsFrom1 = (n) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, helpers_for_tests_1.sleep)(100);
            return [n + 1, n + 2, n + 3];
        });
        const takeOnlyFirstElementOfArray = (arr) => arr[0];
        const filterOutOdds = (n) => n % 2 ? undefined : n;
        const numberToString = (n) => n.toString();
        const add1Transform = (new simple_async_transform_1.SimpleAsyncTransform(add1, { objectMode: true }));
        const create3ElementsFrom1Transform = (new simple_async_transform_1.SimpleAsyncTransform(create3ElementsFrom1, { objectMode: true }));
        const takeOnlyFirstElementOfArrayTransform = (new simple_transform_1.SimpleTransform(takeOnlyFirstElementOfArray, { objectMode: true }));
        const filterOutOddsTranform = new simple_transform_1.SimpleTransform(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = new simple_transform_1.SimpleTransform(numberToString, { objectMode: true });
        const streamPipe = (0, stream_pipe_1.getStreamPipe)(a, add1Transform, create3ElementsFrom1Transform, takeOnlyFirstElementOfArrayTransform, filterOutOddsTranform, numberToStringTrasnform);
        const result = [];
        streamPipe.on('data', (data) => result.push(data));
        yield streamPipe.promisifyEvents(['end']);
        expect(result).toEqual(['4', '6', '8', '10']);
    }));
});
// async function testPipingWithSyncTransforms() {
//     const a = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]).pipe(new SimpleTransform((n: number) => n, { objectMode: true }));
//     const add1 = async (n: number) => n + 1;
//     const create3ElementsFrom1 = (n: number) => [n, n + 1, n + 2];
//     const takeOnlyFirstElementOfArray = (arr: unknown[]) => arr[0];
//     const filterOutOdds = (n: number) => n % 2 ? undefined : n;
//     const numberToString = (n: number) => n.toString();
//     const add1Transform = (new SimpleAsyncTransform(add1, { objectMode: true }));
//     const create3ElementsFrom1Transform = (new SimpleTransform(create3ElementsFrom1, { objectMode: true }));
//     const takeOnlyFirstElementOfArrayTransform = (new SimpleTransform(takeOnlyFirstElementOfArray, { objectMode: true }));
//     const filterOutOddsTranform = new SimpleTransform(filterOutOdds, { objectMode: true });
//     const numberToStringTrasnform = new SimpleTransform(numberToString, { objectMode: true });
//     const streamPipe = getStreamPipe(
//         a,
//         add1Transform,
//         create3ElementsFrom1Transform,
//         takeOnlyFirstElementOfArrayTransform,
//         filterOutOddsTranform,
//         numberToStringTrasnform
//     );
//     const result: number[] = [];
//     streamPipe.destination.on('data', (data: number) => result.push(data));
//     await streamEnd(streamPipe.destination);
//     console.log(result);
//     console.log('done');
// }
// async function testPipingWithAsyncTransforms() {
//     const a = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]).pipe(new SimpleTransform((n: number) => n, { objectMode: true }));
//     const add1 = async (n: number) => n + 1;
//     const create3ElementsFrom1 = async (n: number) => {
//         await sleep(100);
//         return [n, n + 1, n + 2]
//     };
//     const takeOnlyFirstElementOfArray = (arr: unknown[]) => arr[0];
//     const filterOutOdds = (n: number) => n % 2 ? undefined : n;
//     const numberToString = (n: number) => n.toString();
//     const add1Transform = (new SimpleAsyncTransform(add1, { objectMode: true }));
//     const create3ElementsFrom1Transform = (new SimpleAsyncTransform(create3ElementsFrom1, { objectMode: true }));
//     const takeOnlyFirstElementOfArrayTransform = (new SimpleTransform(takeOnlyFirstElementOfArray, { objectMode: true }));
//     const filterOutOddsTranform = new SimpleTransform(filterOutOdds, { objectMode: true });
//     const numberToStringTrasnform = new SimpleTransform(numberToString, { objectMode: true });
//     const streamPipe = getStreamPipe(
//         a,
//         add1Transform,
//         create3ElementsFrom1Transform,
//         takeOnlyFirstElementOfArrayTransform,
//         filterOutOddsTranform,
//         numberToStringTrasnform
//     );
//     const result: string[] = [];
//     streamPipe.on('data', (data) => result.push(data));
//     // streamPipe.destination.on('data', (data) => result.push(data));
//     // streamPipe.on('close', () => console.log(`streamPipe close ${Date.now()}`))
//     // streamPipe.destination.on('close', () => console.log(`destination close ${Date.now()}`))
//     await streamPipe.promisifyEvents(['end']).then(() => console.log(`streamPipe ${Date.now()}`));
//     // await streamEnd(streamPipe.destination).then(() => console.log(`destination ${Date.now()}`));
//     console.log(result);
//     console.log('done');
// }
// testPipingWithAsyncTransforms();
//# sourceMappingURL=test-stream-pipe.spec.js.map