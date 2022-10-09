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
const array_join_transform_1 = require("../classes/utility-transforms/array-join-transform");
const array_split_transform_1 = require("../classes/utility-transforms/array-split-transform");
const helpers_for_tests_1 = require("./helpers-for-tests");
describe('Test transforms', () => {
    describe('ArrayJoinTransform', () => {
        it('should join input into arrays of correct length', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6]);
            const b = a.pipe(new array_join_transform_1.ArrayJoinTransform(3, { objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6]]);
            const asdasd = new Promise(res => res);
        }));
        it('should flush remaining data even if array is not full', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7]);
            const b = a.pipe(new array_join_transform_1.ArrayJoinTransform(3, { objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
        }));
    });
    describe('ArraySplitTransform', () => {
        it('should split array correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([[1, 2, 3], [4, 5, 6], [7, 8]]);
            const b = a.pipe(new array_split_transform_1.ArraySplitTransform({ objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        }));
    });
    describe('SimpleTransform', () => {
        it('creates a typed transform from function', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => n + 1;
            const add1Transform = (new simple_transform_1.SimpleTransform(add1, { objectMode: true }));
            a.pipe(add1Transform);
            const result = [];
            add1Transform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(add1Transform);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        }));
        it('pipes created transforms correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => n + 1;
            const filterOutOdds = (n) => n % 2 ? n : undefined;
            const numberToString = (n) => n.toString();
            const add1Transform = (new simple_transform_1.SimpleTransform(add1, { objectMode: true }));
            const filterOutOddsTranform = new simple_transform_1.SimpleTransform(filterOutOdds, { objectMode: true });
            const numberToStringTrasnform = new simple_transform_1.SimpleTransform(numberToString, { objectMode: true });
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
            expect(result).toEqual(['3', '5', '7', '9']);
        }));
    });
    describe('SimpleAsyncTransform', () => {
        it('creates a typed transform from function', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const add1Transform = (new simple_async_transform_1.SimpleAsyncTransform(add1, { objectMode: true }));
            a.pipe(add1Transform);
            const result = [];
            add1Transform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(add1Transform);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        }));
        it('pipes created transforms correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () { return n % 2 ? n : undefined; });
            const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
            const add1Transform = (new simple_async_transform_1.SimpleAsyncTransform(add1, { objectMode: true }));
            const filterOutOddsTranform = new simple_async_transform_1.SimpleAsyncTransform(filterOutOdds, { objectMode: true });
            const numberToStringTrasnform = new simple_async_transform_1.SimpleAsyncTransform(numberToString, { objectMode: true });
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
            expect(result).toEqual(['3', '5', '7', '9']);
        }));
        it('handles non immediate async functions', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise(res => setTimeout(res, 100));
                return n % 2 ? n : undefined;
            });
            const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
            const add1Transform = (new simple_async_transform_1.SimpleAsyncTransform(add1, { objectMode: true }));
            const filterOutOddsTranform = new simple_async_transform_1.SimpleAsyncTransform(filterOutOdds, { objectMode: true });
            const numberToStringTrasnform = new simple_async_transform_1.SimpleAsyncTransform(numberToString, { objectMode: true });
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
            expect(result).toEqual(['3', '5', '7', '9']);
        }));
    });
    it('Able to mix different transforms in a single stream', () => __awaiter(void 0, void 0, void 0, function* () {
        const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
        const add1 = (n) => n + 1;
        const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(res => setTimeout(res, 100));
            return n % 2 ? n : undefined;
        });
        const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
        const add1Transform = (new simple_transform_1.SimpleTransform(add1, { objectMode: true }));
        const filterOutOddsTranform = new simple_async_transform_1.SimpleAsyncTransform(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = new simple_async_transform_1.SimpleAsyncTransform(numberToString, { objectMode: true });
        a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
        const result = [];
        numberToStringTrasnform.on('data', (data) => result.push(data));
        yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
        expect(result).toEqual(['3', '5', '7', '9']);
    }));
});
// async function testArrayJoinTransform() {
//     const a = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
//     const b = a.pipe(new ArrayJoinTransform(3, { objectMode: true }));
//     const result: number[][] = [];
//     b.on('data', (data: number[]) => result.push(data));
//     await streamEnd(b)
//     console.log(result);
//     console.log('done');
// }
// async function testArraySplitTransform() {
//     const a = Readable.from([[1, 2, 3], [4, 5, 6], [7, 8]]);
//     const b = a.pipe(new ArraySplitTransform({ objectMode: true }));
//     const result: number[] = [];
//     b.on('data', (data: number) => result.push(data));
//     await streamEnd(b)
//     console.log(result);
//     console.log('done');
// }
// async function testSimpleTransform() {
//     const a = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
//     const add1 = (n: number) => n + 1;
//     const filterOutOdds = (n: number) => n % 2 ? n : undefined;
//     const numberToString = (n: number) => n.toString();
//     const add1Transform = (new SimpleTransform(add1, { objectMode: true }));
//     const filterOutOddsTranform = new SimpleTransform(filterOutOdds, { objectMode: true });
//     const numberToStringTrasnform = new SimpleTransform(numberToString, { objectMode: true });
//     a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
//     const result: string[] = [];
//     numberToStringTrasnform.on('data', (data) => result.push(data));
//     await streamEnd(numberToStringTrasnform)
//     console.log(result);
//     console.log('done');
// }
// async function testSimpleAsyncTransform() {
//     const a = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
//     const add1 = async (n: number) => n + 1;
//     const filterOutOdds = async (n: number) => n % 2 ? n : undefined;
//     const numberToString = async (n: number) => n.toString();
//     const add1Transform = (new SimpleAsyncTransform(add1, { objectMode: true }));
//     const filterOutOddsTranform = new SimpleAsyncTransform(filterOutOdds, { objectMode: true });
//     const numberToStringTrasnform = new SimpleAsyncTransform(numberToString, { objectMode: true });
//     a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
//     const result: string[] = [];
//     numberToStringTrasnform.on('data', (data) => result.push(data));
//     await streamEnd(numberToStringTrasnform)
//     console.log(result);
//     console.log('done');
// }
// testSimpleTransform()
//# sourceMappingURL=test.spec.js.map