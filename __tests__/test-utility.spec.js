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
const pipe_helper_1 = require("../classes/pipe-helper");
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
                const pt = utility_transforms_1.objectUtilityTransforms.passThrough();
                const b = a.pipe(sideEffectsTransform).pipe(pt);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                yield expect(sideEffectsTransform.promisifyEvents(['end', 'close'], ['error'])).rejects.toThrow(Error('aaaaa'));
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
        it('should filter out on crash', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const filterOutOdds = (n) => {
                if ((n % 2) === 1) {
                    throw Error('asdf');
                }
                return true;
            };
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.filter(filterOutOdds));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([2, 4, 6, 8]);
        }));
        it('should pass error if given error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = utility_transforms_1.objectUtilityTransforms.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const passThrough = utility_transforms_1.objectUtilityTransforms.passThrough();
            const filterOutOdds = (n) => {
                if ((n % 2) === 1) {
                    throw Error('asdf');
                }
                return true;
            };
            const b = utility_transforms_1.objectUtilityTransforms.filter(filterOutOdds, { errorStream });
            pipe_helper_1.pipeHelper.pipe({ errorStream }, a, b, passThrough);
            passThrough.on('data', () => undefined);
            const result = [];
            const errors = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([helpers_for_tests_1.streamEnd(b), helpers_for_tests_1.streamEnd(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errors).toEqual([1, 3, 5, 7]);
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
        it('passes errors to error stream instead of closing if given an error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = utility_transforms_1.objectUtilityTransforms.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const add1WithError = (n) => {
                if (n % 2 === 0) {
                    throw Error('asdf');
                }
                return n + 1;
            };
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromFunction(add1WithError, { errorStream }));
            pipe_helper_1.pipeHelper.pipeOneToOne(a, add1Transform);
            const passThrough = utility_transforms_1.objectUtilityTransforms.passThrough();
            pipe_helper_1.pipeHelper.pipeOneToOne(add1Transform, passThrough, { errorStream });
            passThrough.on('data', () => undefined);
            const result = [];
            const errorResulst = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([helpers_for_tests_1.streamEnd(add1Transform), helpers_for_tests_1.streamEnd(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errorResulst).toEqual([2, 4, 6, 8]);
        }));
        it('doesnt pass errors to error stream if given an error stream witohut errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = utility_transforms_1.objectUtilityTransforms.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const add1 = (n) => n + 1;
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromFunction(add1, { errorStream }));
            pipe_helper_1.pipeHelper.pipeOneToOne(a, add1Transform, { errorStream });
            pipe_helper_1.pipeHelper.pipeOneToOne(add1Transform, utility_transforms_1.objectUtilityTransforms.void(), { errorStream });
            const result = [];
            const errorResulst = [];
            add1Transform.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([helpers_for_tests_1.streamEnd(add1Transform), helpers_for_tests_1.streamEnd(errorStream)]);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
            expect(errorResulst).toEqual([]);
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
                yield new Promise(res => setTimeout(res, 20));
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
        it('passes errors to error stream instead of closing if given an error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = utility_transforms_1.objectUtilityTransforms.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const add1WithError = (n) => __awaiter(void 0, void 0, void 0, function* () {
                if (n % 2 === 0) {
                    throw Error('asdf');
                }
                return n + 1;
            });
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(add1WithError, { errorStream }));
            pipe_helper_1.pipeHelper.pipeOneToOne(a, add1Transform);
            const passThrough = utility_transforms_1.objectUtilityTransforms.passThrough();
            pipe_helper_1.pipeHelper.pipeOneToOne(add1Transform, passThrough, { errorStream });
            passThrough.on('data', () => undefined);
            const result = [];
            const errorResulst = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([helpers_for_tests_1.streamEnd(add1Transform), helpers_for_tests_1.streamEnd(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errorResulst).toEqual([2, 4, 6, 8]);
        }));
        it('doesnt pass errors to error stream if given an error stream witohut errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = utility_transforms_1.objectUtilityTransforms.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const add1Transform = (utility_transforms_1.objectUtilityTransforms.fromAsyncFunction(add1, { errorStream }));
            pipe_helper_1.pipeHelper.pipeOneToOne(a, add1Transform, { errorStream });
            pipe_helper_1.pipeHelper.pipeOneToOne(add1Transform, utility_transforms_1.objectUtilityTransforms.void(), { errorStream });
            const result = [];
            const errorResulst = [];
            add1Transform.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([helpers_for_tests_1.streamEnd(add1Transform), helpers_for_tests_1.streamEnd(errorStream)]);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
            expect(errorResulst).toEqual([]);
        }));
    });
    describe('void', () => {
        it('should ignore deleted data without blocking the stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.void({ objectMode: true }));
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([]);
        }));
    });
    describe('pickElementFromArray', () => {
        it('should pick the correct element', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([[1, 2, 3], [4, 5, 6], [7, 8]]);
            const b = a.pipe(utility_transforms_1.objectUtilityTransforms.pickElementFromArray(0));
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual([1, 4, 7]);
        }));
    });
    describe('fromFunctionConcurrent', () => {
        it('should return correct but unordered output', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const arr = [...Array(inputLength).keys()];
            const expectedOutput = arr.map(n => n * 2);
            const outArr = [];
            const action = (n) => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise(res => setTimeout(res, delay));
                return n * 2;
            });
            const concurrency = 5;
            const { input, output } = utility_transforms_1.objectUtilityTransforms.fromFunctionConcurrent(action, concurrency);
            stream_1.Readable.from(arr).pipe(input);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield output.promisifyEvents(['end'], ['error']);
            outArr.sort((a, b) => a - b);
            expect(outArr).toEqual(expectedOutput);
        }));
        it('should take less time then running sequentially', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const estimatedRunTimeSequential = delay * inputLength;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const startTime = Date.now();
            const action = (n) => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise(res => setTimeout(res, delay));
                return n * 2;
            });
            const concurrency = 5;
            const { input, output } = utility_transforms_1.objectUtilityTransforms.fromFunctionConcurrent(action, concurrency);
            stream_1.Readable.from(arr).pipe(input);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield output.promisifyEvents(['end'], ['error']);
            expect(estimatedRunTimeSequential).toBeGreaterThan(Date.now() - startTime);
        }));
        it('should fail send error to output if one of the concurrent actions fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const errorOnIndex = 20;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const action = (n) => __awaiter(void 0, void 0, void 0, function* () {
                if (n === errorOnIndex) {
                    throw new Error('asdf');
                }
                yield new Promise(res => setTimeout(res, delay));
                return n * 2;
            });
            const concurrency = 5;
            const { input, output } = utility_transforms_1.objectUtilityTransforms.fromFunctionConcurrent(action, concurrency);
            stream_1.Readable.from(arr).pipe(input);
            output.on('data', (data) => {
                outArr.push(data);
            });
            try {
                yield output.promisifyEvents(['end'], ['error']);
            }
            catch (error) {
                expect(error).toEqual(new Error('asdf'));
                expect(outArr.length).toBeLessThan(errorOnIndex);
            }
            finally {
                expect.assertions(2);
            }
        }));
        it('doesnt break backpressure', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            let chunksPassedInInput = 0;
            const action = (n) => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise(res => setTimeout(res, delay));
                return n * 2;
            });
            const concurrency = 2;
            const { input, output } = utility_transforms_1.objectUtilityTransforms.fromFunctionConcurrent(action, concurrency);
            stream_1.Readable.from(arr).pipe(input);
            input.on('data', () => chunksPassedInInput++);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield input.promisifyEvents(['end'], ['error']);
            expect(chunksPassedInInput).toEqual(inputLength);
            expect(outArr.length).toBe(0);
            yield output.promisifyEvents(['end'], ['error']);
            expect(outArr.length).toBe(inputLength);
        }));
    });
    describe('fromIterable', () => {
        it('output all data from iterable', () => __awaiter(void 0, void 0, void 0, function* () {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8];
            const b = utility_transforms_1.objectUtilityTransforms.fromIterable(arr);
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield helpers_for_tests_1.streamEnd(b);
            expect(result).toEqual(arr);
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