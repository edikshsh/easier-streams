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
const utility_transforms_1 = require("../classes/utility-transforms");
const helpers_for_tests_1 = require("./helpers-for-tests");
describe('Test Utility transforms', () => {
    describe('callOnData', () => {
        describe('sync', () => {
            it('should not modify the original chunk', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map(item => { return { a: item }; });
                const expectedModifiedArr = [11, 12, 13, 14, 15, 16, 17, 18].map(item => { return { a: item }; });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => {
                    item.a += 10;
                    modified.push(item);
                };
                const sideEffectsTransform = utility_transforms_1.objectUtilityTransforms.callOnDataSync(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                // b.on('data')
                yield helpers_for_tests_1.streamEnd(b);
                expect(result).toEqual(arr);
                expect(modified).toEqual(expectedModifiedArr);
            }));
            it('handles errors from side effects', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map(item => { return { a: item }; });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => {
                    if (item.a === 3)
                        throw Error('aaaaa');
                    item.a += 10;
                    modified.push(item);
                };
                const sideEffectsTransform = utility_transforms_1.objectUtilityTransforms.callOnDataSync(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                b.on('error', () => undefined);
                yield expect(b.promisifyEvents(['end', 'close'], ['error'])).rejects.toThrow(Error('aaaaa'));
            }));
        });
        describe('async', () => {
            it('should not modify the original chunk', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map(item => { return { a: item }; });
                const expectedModifiedArr = [11, 12, 13, 14, 15, 16, 17, 18].map(item => { return { a: item }; });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => __awaiter(void 0, void 0, void 0, function* () {
                    item.a += 10;
                    modified.push(item);
                });
                const sideEffectsTransform = utility_transforms_1.objectUtilityTransforms.callOnDataAsync(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                // b.on('data')
                yield helpers_for_tests_1.streamEnd(b);
                expect(result).toEqual(arr);
                expect(modified).toEqual(expectedModifiedArr);
            }));
            it('Should await call on data to finish before ending stream', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map(item => { return { a: item }; });
                const expectedModifiedArr = [11, 12, 13, 14, 15, 16, 17, 18].map(item => { return { a: item }; });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => __awaiter(void 0, void 0, void 0, function* () {
                    yield new Promise(res => setTimeout(res, 100));
                    item.a += 10;
                    modified.push(item);
                });
                const sideEffectsTransform = utility_transforms_1.objectUtilityTransforms.callOnDataAsync(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                yield helpers_for_tests_1.streamEnd(b);
                expect(result).toEqual(arr);
                expect(modified).toEqual(expectedModifiedArr);
            }));
            it('handles errors from side effects', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map(item => { return { a: item }; });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => __awaiter(void 0, void 0, void 0, function* () {
                    if (item.a === 3)
                        throw Error('aaaaa');
                    item.a += 10;
                    modified.push(item);
                });
                const sideEffectsTransform = utility_transforms_1.objectUtilityTransforms.callOnDataAsync(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                b.on('error', () => undefined);
                yield expect(b.promisifyEvents(['end', 'close'], ['error'])).rejects.toThrow(Error('aaaaa'));
            }));
        });
    });
    describe('filter', () => {
        it('should filter out correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const filterOutOdds = (n) => (n % 2) === 0;
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.filter(filterOutOdds));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([2, 4, 6, 8]);
        }));
    });
    describe('void', () => {
        it('should throw away all data', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.void());
            const result = [];
            b.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([]);
        }));
    });
    describe('arrayJoin', () => {
        it('should join input into arrays of correct length', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6]);
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.arrayJoin(3, { objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6]]);
        }));
        it('should flush remaining data even if array is not full', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7]);
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.arrayJoin(3, { objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
        }));
    });
    describe('arraySplit', () => {
        it('should split array correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([[1, 2, 3], [4, 5, 6], [7, 8]]);
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.arraySplit({ objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        }));
    });
    describe('fromFunction', () => {
        it('creates a typed transform from function', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => n + 1;
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromFunction(add1, { objectMode: true }));
            a.pipe(add1Transform);
            const result = [];
            add1Transform.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(add1Transform);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        }));
        it('pipes created transforms correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => n + 1;
            const filterOutOdds = (n) => n % 2 ? n : undefined;
            const numberToString = (n) => n.toString();
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromFunction(add1));
            const filterOutOddsTranform = utility_transforms_1.objectUtilityTransforms.fromFunction(filterOutOdds);
            const numberToStringTrasnform = utility_transforms_1.objectUtilityTransforms.fromFunction(numberToString);
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(numberToStringTrasnform);
            expect(result).toEqual(['3', '5', '7', '9']);
        }));
        describe('typedPassThrough', () => {
            it('should pass items correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8];
                const a = stream_1.Readable.from(arr);
                const b = a.pipe(utility_transforms_1.objectUtilityTransforms.passThrough());
                const result = [];
                b.on('data', (data) => result.push(data));
                yield helpers_for_tests_1.streamEnd(b);
                expect(result).toEqual(arr);
            }));
        });
    });
    describe('fromAsyncFunction', () => {
        it('creates a typed transform from async function', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(add1, { objectMode: true }));
            a.pipe(add1Transform);
            const result = [];
            add1Transform.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(add1Transform);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        }));
        it('pipes created transforms correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () { return n % 2 ? n : undefined; });
            const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(add1));
            const filterOutOddsTranform = utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(filterOutOdds);
            const numberToStringTrasnform = utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(numberToString);
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(numberToStringTrasnform);
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
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(add1));
            const filterOutOddsTranform = utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(filterOutOdds);
            const numberToStringTrasnform = utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(numberToString);
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(numberToStringTrasnform);
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
        const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromFunction(add1, { objectMode: true }));
        const filterOutOddsTranform = utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(numberToString, { objectMode: true });
        a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
        const result = [];
        numberToStringTrasnform.on('data', (data) => result.push(data));
        yield helpers_for_tests_1.streamEnd(numberToStringTrasnform);
        expect(result).toEqual(['3', '5', '7', '9']);
    }));
});
//# sourceMappingURL=test-utility.spec.js.map