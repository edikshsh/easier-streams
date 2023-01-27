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
const promises_1 = require("stream/promises");
const plumber_1 = require("../streams/plumber");
const transformer_1 = require("../streams/transformer");
const helpers_for_tests_1 = require("./helpers-for-tests");
describe('Test Utility transforms', () => {
    describe('callOnData', () => {
        describe('sync', () => {
            it('should not modify the original chunk', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                    return { a: item };
                });
                const expectedModifiedArr = [11, 12, 13, 14, 15, 16, 17, 18].map((item) => {
                    return { a: item };
                });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => {
                    item.a += 10;
                    modified.push(item);
                };
                const sideEffectsTransform = transformer_1.transformer.callOnData(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                yield (0, helpers_for_tests_1.streamEnd)(b);
                expect(result).toEqual(arr);
                expect(modified).toEqual(expectedModifiedArr);
            }));
            it('handles errors from side effects', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                    return { a: item };
                });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => {
                    if (item.a === 3)
                        throw Error('aaaaa');
                    item.a += 10;
                    modified.push(item);
                };
                const sideEffectsTransform = transformer_1.transformer.callOnData(increaseBy10);
                const pt = transformer_1.transformer.passThrough();
                const b = a.pipe(sideEffectsTransform).pipe(pt);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                yield expect(sideEffectsTransform.promisifyEvents(['end', 'close'], ['error'])).rejects.toThrow(Error('aaaaa'));
            }));
        });
        describe('async', () => {
            it('should not modify the original chunk', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                    return { a: item };
                });
                const expectedModifiedArr = [11, 12, 13, 14, 15, 16, 17, 18].map((item) => {
                    return { a: item };
                });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => __awaiter(void 0, void 0, void 0, function* () {
                    item.a += 10;
                    modified.push(item);
                });
                const sideEffectsTransform = transformer_1.transformer.async.callOnData(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                yield (0, helpers_for_tests_1.streamEnd)(b);
                expect(result).toEqual(arr);
                expect(modified).toEqual(expectedModifiedArr);
            }));
            it('Should await call on data to finish before ending stream', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                    return { a: item };
                });
                const expectedModifiedArr = [11, 12, 13, 14, 15, 16, 17, 18].map((item) => {
                    return { a: item };
                });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => __awaiter(void 0, void 0, void 0, function* () {
                    yield new Promise((res) => setTimeout(res, 100));
                    item.a += 10;
                    modified.push(item);
                });
                const sideEffectsTransform = transformer_1.transformer.async.callOnData(increaseBy10);
                const b = a.pipe(sideEffectsTransform);
                const result = [];
                const modified = [];
                b.on('data', (data) => result.push(data));
                yield (0, helpers_for_tests_1.streamEnd)(b);
                expect(result).toEqual(arr);
                expect(modified).toEqual(expectedModifiedArr);
            }));
            it('handles errors from side effects', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                    return { a: item };
                });
                const a = stream_1.Readable.from(arr);
                const increaseBy10 = (item) => __awaiter(void 0, void 0, void 0, function* () {
                    if (item.a === 3)
                        throw Error('aaaaa');
                    item.a += 10;
                    modified.push(item);
                });
                const sideEffectsTransform = transformer_1.transformer.async.callOnData(increaseBy10);
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
            const filterOutOdds = (n) => n % 2 === 0;
            const b = a.pipe(transformer_1.transformer.filter(filterOutOdds));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([2, 4, 6, 8]);
        }));
        it('should filter out on crash when considerErrorAsFilterOut is true', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const b = a.pipe(transformer_1.transformer.filter(helpers_for_tests_1.filterOutOddsSync, { considerErrorAsFilterOut: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([2, 4, 6, 8]);
        }));
        it('should crash on error when considerErrorAsFilterOut is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const filterOutOdds = (n) => {
                if (n % 2 === 0) {
                    throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
                }
                return true;
            };
            const b = a.pipe(transformer_1.transformer.filter(filterOutOdds, { considerErrorAsFilterOut: false }));
            const result = [];
            b.on('data', (data) => result.push(data));
            const streamPromise = (0, helpers_for_tests_1.streamEnd)(b);
            yield expect(streamPromise).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(result).toEqual([1]);
        }));
        it('should pass error if given error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = transformer_1.transformer.errorTransform();
            const passThrough = transformer_1.transformer.passThrough();
            const filterOutOdds = (n) => {
                if (n % 2 === 1) {
                    throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
                }
                return true;
            };
            const b = transformer_1.transformer.filter(filterOutOdds, { shouldPushErrorsForward: true });
            plumber_1.plumber.pipe({}, a, b);
            plumber_1.plumber.pipe({ errorStream }, b, passThrough);
            passThrough.on('data', () => undefined);
            const result = [];
            const errors = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(b), (0, helpers_for_tests_1.streamEnd)(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errors).toEqual([1, 3, 5, 7]);
        }));
    });
    describe('fork', () => {
        it('should pass kept values to one stream, and discard values to another', () => __awaiter(void 0, void 0, void 0, function* () {
            const keptValues = [];
            const filteredValues = [];
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const { filterFalseTransform, filterTrueTransform } = transformer_1.transformer.fork(helpers_for_tests_1.filterOutOddsSync);
            plumber_1.plumber.pipe({}, a, [filterFalseTransform, filterTrueTransform]);
            filterTrueTransform.on('data', (evenNumber) => keptValues.push(evenNumber));
            filterFalseTransform.on('data', (oddNumber) => filteredValues.push(oddNumber));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(filterTrueTransform), (0, helpers_for_tests_1.streamEnd)(filterFalseTransform)]);
            expect(keptValues).toEqual([2, 4, 6, 8]);
            expect(filteredValues).toEqual([1, 3, 5, 7]);
        }));
    });
    describe('filterType', () => {
        it('should filter out by type correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, '2', 3, '4', 5, '6', 7, '8']);
            function isNumber(n) {
                return typeof n === 'number';
            }
            const b = a.pipe(transformer_1.transformer.typeFilter(isNumber));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([1, 3, 5, 7]);
        }));
    });
    describe('asyncFilter', () => {
        it('should filter out correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () { return n % 2 === 0; });
            const b = a.pipe(transformer_1.transformer.async.filter(filterOutOdds));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([2, 4, 6, 8]);
        }));
        it('should filter out on crash when considerErrorAsFilterOut is true', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const b = a.pipe(transformer_1.transformer.async.filter((0, helpers_for_tests_1.filterOutOddsAsync)(), { considerErrorAsFilterOut: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([2, 4, 6, 8]);
        }));
        it('should crash on error when considerErrorAsFilterOut is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () {
                if (n % 2 === 0) {
                    throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
                }
                return true;
            });
            const b = a.pipe(transformer_1.transformer.async.filter(filterOutOdds, { considerErrorAsFilterOut: false }));
            const result = [];
            b.on('data', (data) => result.push(data));
            const streamPromise = (0, helpers_for_tests_1.streamEnd)(b);
            yield expect(streamPromise).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(result).toEqual([1]);
        }));
        it('should pass error if given error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = transformer_1.transformer.errorTransform();
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const passThrough = transformer_1.transformer.passThrough();
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () {
                if (n % 2 === 1) {
                    throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
                }
                return true;
            });
            const b = transformer_1.transformer.async.filter(filterOutOdds, { shouldPushErrorsForward: true });
            const result = [];
            const errors = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => {
                errors.push(error.data);
            });
            plumber_1.plumber.pipe({ errorStream }, a, b, passThrough);
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(passThrough), (0, helpers_for_tests_1.streamEnd)(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errors).toEqual([1, 3, 5, 7]);
        }));
    });
    describe('asyncFork', () => {
        it('should pass kept values to one stream, and discard values to another', () => __awaiter(void 0, void 0, void 0, function* () {
            const keptValues = [];
            const filteredValues = [];
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () { return n % 2 === 0; });
            const { filterFalseTransform, filterTrueTransform } = transformer_1.transformer.async.fork(filterOutOdds);
            plumber_1.plumber.pipe({}, a, [filterFalseTransform, filterTrueTransform]);
            filterTrueTransform.on('data', (evenNumber) => keptValues.push(evenNumber));
            filterFalseTransform.on('data', (oddNumber) => filteredValues.push(oddNumber));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(filterTrueTransform), (0, helpers_for_tests_1.streamEnd)(filterFalseTransform)]);
            expect(keptValues).toEqual([2, 4, 6, 8]);
            expect(filteredValues).toEqual([1, 3, 5, 7]);
        }));
    });
    describe('void', () => {
        it('should throw away all data', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const b = a.pipe(transformer_1.transformer.void());
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([]);
        }));
    });
    describe('arrayJoin', () => {
        it('should join input into arrays of correct length', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6]);
            const b = a.pipe(transformer_1.transformer.arrayJoin(3, { objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([
                [1, 2, 3],
                [4, 5, 6],
            ]);
        }));
        it('should flush remaining data even if array is not full', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7]);
            const b = a.pipe(transformer_1.transformer.arrayJoin(3, { objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
        }));
    });
    describe('arraySplit', () => {
        it('should split array correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8],
            ]);
            const b = a.pipe(transformer_1.transformer.arraySplit({ objectMode: true }));
            const result = [];
            b.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        }));
    });
    describe('fromFunction', () => {
        it('creates a typed transform from function', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => n + 1;
            const add1Transform = transformer_1.transformer.fromFunction(add1, { objectMode: true });
            a.pipe(add1Transform);
            const result = [];
            add1Transform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(add1Transform);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        }));
        it('pipes created transforms correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => n + 1;
            const filterOutOdds = (n) => (n % 2 ? n : undefined);
            const numberToString = (n) => n.toString();
            const add1Transform = transformer_1.transformer.fromFunction(add1);
            const filterOutOddsTranform = transformer_1.transformer.fromFunction(filterOutOdds);
            const numberToStringTrasnform = transformer_1.transformer.fromFunction(numberToString);
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
            expect(result).toEqual(['3', '5', '7', '9']);
        }));
        it('passes errors to error stream instead of closing if given an error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = transformer_1.transformer.errorTransform();
            const add1WithError = (n) => {
                if (n % 2 === 0) {
                    throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
                }
                return n + 1;
            };
            const add1Transform = transformer_1.transformer.fromFunction(add1WithError, { shouldPushErrorsForward: true });
            plumber_1.plumber.pipeOneToOne(a, add1Transform);
            const passThrough = transformer_1.transformer.passThrough();
            plumber_1.plumber.pipeOneToOne(add1Transform, passThrough, { errorStream });
            passThrough.on('data', () => undefined);
            const result = [];
            const errorResulst = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(add1Transform), (0, helpers_for_tests_1.streamEnd)(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errorResulst).toEqual([2, 4, 6, 8]);
        }));
        it('doesnt pass errors to error stream if given an error stream witohut errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = transformer_1.transformer.errorTransform();
            const add1 = (n) => n + 1;
            const add1Transform = transformer_1.transformer.fromFunction(add1, { shouldPushErrorsForward: true });
            plumber_1.plumber.pipeOneToOne(a, add1Transform, { errorStream });
            plumber_1.plumber.pipeOneToOne(add1Transform, transformer_1.transformer.void(), { errorStream });
            const result = [];
            const errorResulst = [];
            add1Transform.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(add1Transform), (0, helpers_for_tests_1.streamEnd)(errorStream)]);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
            expect(errorResulst).toEqual([]);
        }));
        describe('typedPassThrough', () => {
            it('should pass items correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                const arr = [1, 2, 3, 4, 5, 6, 7, 8];
                const a = stream_1.Readable.from(arr);
                const b = a.pipe(transformer_1.transformer.passThrough());
                const result = [];
                b.on('data', (data) => result.push(data));
                yield (0, helpers_for_tests_1.streamEnd)(b);
                expect(result).toEqual(arr);
            }));
        });
    });
    describe('fromAsyncFunction', () => {
        it('creates a typed transform from async function', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const add1Transform = transformer_1.transformer.async.fromFunction(add1, { objectMode: true });
            a.pipe(add1Transform);
            const result = [];
            add1Transform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(add1Transform);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
        }));
        it('pipes created transforms correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () { return (n % 2 ? n : undefined); });
            const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
            const add1Transform = transformer_1.transformer.async.fromFunction(add1);
            const filterOutOddsTranform = transformer_1.transformer.async.fromFunction(filterOutOdds);
            const numberToStringTrasnform = transformer_1.transformer.async.fromFunction(numberToString);
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
                yield new Promise((res) => setTimeout(res, 20));
                return n % 2 ? n : undefined;
            });
            const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
            const add1Transform = transformer_1.transformer.async.fromFunction(add1);
            const filterOutOddsTranform = transformer_1.transformer.async.fromFunction(filterOutOdds);
            const numberToStringTrasnform = transformer_1.transformer.async.fromFunction(numberToString);
            a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
            const result = [];
            numberToStringTrasnform.on('data', (data) => result.push(data));
            yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
            expect(result).toEqual(['3', '5', '7', '9']);
        }));
        it('passes errors to error stream instead of closing if given an error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = transformer_1.transformer.errorTransform();
            const add1WithError = (n) => __awaiter(void 0, void 0, void 0, function* () {
                if (n % 2 === 0) {
                    throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
                }
                return n + 1;
            });
            const add1Transform = transformer_1.transformer.async.fromFunction(add1WithError, { shouldPushErrorsForward: true });
            plumber_1.plumber.pipeOneToOne(a, add1Transform);
            const passThrough = transformer_1.transformer.passThrough();
            plumber_1.plumber.pipeOneToOne(add1Transform, passThrough, { errorStream });
            passThrough.on('data', () => undefined);
            const result = [];
            const errorResulst = [];
            passThrough.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(add1Transform), (0, helpers_for_tests_1.streamEnd)(errorStream)]);
            expect(result).toEqual([2, 4, 6, 8]);
            expect(errorResulst).toEqual([2, 4, 6, 8]);
        }));
        it('doesnt pass errors to error stream if given an error stream witohut errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = transformer_1.transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
            const errorStream = transformer_1.transformer.errorTransform();
            const add1 = (n) => __awaiter(void 0, void 0, void 0, function* () { return n + 1; });
            const add1Transform = transformer_1.transformer.async.fromFunction(add1, { shouldPushErrorsForward: true });
            plumber_1.plumber.pipeOneToOne(a, add1Transform, { errorStream });
            plumber_1.plumber.pipeOneToOne(add1Transform, transformer_1.transformer.void(), { errorStream });
            const result = [];
            const errorResulst = [];
            add1Transform.on('data', (data) => result.push(data));
            errorStream.on('data', (data) => errorResulst.push(data.data));
            yield Promise.all([(0, helpers_for_tests_1.streamEnd)(add1Transform), (0, helpers_for_tests_1.streamEnd)(errorStream)]);
            expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
            expect(errorResulst).toEqual([]);
        }));
    });
    describe('void', () => {
        it('should ignore deleted data without blocking the stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
            const b = a.pipe(transformer_1.transformer.void({ objectMode: true }));
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([]);
        }));
    });
    describe('pickElementFromArray', () => {
        it('should pick the correct element', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = stream_1.Readable.from([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8],
            ]);
            const b = a.pipe(transformer_1.transformer.pickElementFromArray(0));
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([1, 4, 7]);
        }));
    });
    describe('fromFunctionConcurrent', () => {
        it('should return correct but unordered output', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 200;
            const arr = [...Array(inputLength).keys()].map((i) => i + 1);
            const expectedOutput = arr.map((n) => n * 2);
            const outArr = [];
            const action = (n) => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((res) => setTimeout(res, delay));
                return n * 2;
            });
            const concurrency = 5;
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent(action, concurrency);
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
            const concurrency = 5;
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.delayer)(delay), concurrency);
            stream_1.Readable.from(arr).pipe(input);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield output.promisifyEvents(['end'], ['error']);
            expect(estimatedRunTimeSequential).toBeGreaterThan(Date.now() - startTime);
        }));
        it('should send error to output if one of the concurrent actions fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const errorOnIndex = 20;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const concurrency = 5;
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.getFailOnNumberAsyncFunctionMult2)(errorOnIndex, delay), concurrency);
            stream_1.Readable.from(arr).pipe(input);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield expect(output.promisifyEvents(['end'], ['error'])).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(outArr.length).toBeLessThan(errorOnIndex);
        }));
        it('doesnt break backpressure', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            let chunksPassedInInput = 0;
            const concurrency = 2;
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.delayer)(delay), concurrency);
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
        it('should not break pipeline chain of error passing if error comes before concurrent', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const errorOnIndex = 10;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const concurrency = 5;
            const erroringTranform = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(4));
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.delayer)(delay), concurrency);
            const source = transformer_1.transformer.fromIterable(arr);
            (0, promises_1.pipeline)(source, erroringTranform, input).catch(() => undefined);
            (0, promises_1.pipeline)(output, transformer_1.transformer.void()).catch(() => undefined);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield expect(source.promisifyEvents('close', 'error')).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(outArr.length).toBeLessThan(errorOnIndex);
        }));
        it('should not break pipeline chain of error passing if error comes after concurrent', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const errorOnIndex = 10;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const concurrency = 5;
            const erroringTranform = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(4));
            const passThrough = transformer_1.transformer.passThrough();
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.delayer)(delay), concurrency, {});
            const source = stream_1.Readable.from(arr);
            (0, promises_1.pipeline)(source, input).catch(() => undefined);
            (0, promises_1.pipeline)(output, erroringTranform, passThrough).catch(() => undefined);
            passThrough.on('data', (data) => {
                outArr.push(data);
            });
            yield expect(passThrough.promisifyEvents('end', 'error')).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(outArr.length).toBeLessThan(errorOnIndex);
        }));
        it('should not break pipeline chain of error passing if concurrent errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const errorOnIndex = 10;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const concurrency = 5;
            const passThrough = transformer_1.transformer.passThrough();
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.getFailOnNumberAsyncFunctionMult2)(errorOnIndex, delay), concurrency, {});
            const source = stream_1.Readable.from(arr);
            (0, promises_1.pipeline)(source, input).catch(() => undefined);
            (0, promises_1.pipeline)(output, passThrough).catch(() => undefined);
            passThrough.on('data', (data) => {
                outArr.push(data);
            });
            yield expect(passThrough.promisifyEvents('end', 'error')).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(outArr.length).toBeLessThan(errorOnIndex);
        }));
        it('should return correct data when using pipeline', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const expectedOutput = arr.map((n) => n * 2);
            const concurrency = 5;
            const passThrough = transformer_1.transformer.passThrough();
            const { input, output } = transformer_1.transformer.async.fromFunctionConcurrent((0, helpers_for_tests_1.delayerMult2)(delay), concurrency, {});
            const source = stream_1.Readable.from(arr);
            (0, promises_1.pipeline)(source, input).catch(() => undefined);
            (0, promises_1.pipeline)(output, passThrough).catch(() => undefined);
            output.on('data', (data) => {
                outArr.push(data);
            });
            yield output.promisifyEvents('end', 'error');
            expect(outArr).toEqual(expectedOutput);
        }));
    });
    describe('fromFunctionConcurrent2', () => {
        const errorOn4 = (n) => {
            if (n === 4) {
                throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            }
            return n;
        };
        it('should return correct but unordered output', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 200;
            const arr = [...Array(inputLength).keys()].map((i) => i + 1);
            const expectedOutput = arr.map((n) => n * 2);
            const outArr = [];
            const concurrency = 5;
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.delayerMult2)(delay), concurrency);
            stream_1.Readable.from(arr).pipe(concurrentTransform);
            concurrentTransform.on('data', (data) => {
                outArr.push(data);
            });
            yield concurrentTransform.promisifyEvents(['end'], ['error']);
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
            const concurrency = 5;
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.delayerMult2)(delay), concurrency);
            stream_1.Readable.from(arr).pipe(concurrentTransform);
            concurrentTransform.on('data', (data) => {
                outArr.push(data);
            });
            yield concurrentTransform.promisifyEvents(['end'], ['error']);
            expect(estimatedRunTimeSequential).toBeGreaterThan(Date.now() - startTime);
        }));
        it('should send error to output if one of the concurrent actions fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 20;
            const inputLength = 100;
            const errorOnIndex = 20;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            const concurrency = 5;
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.getFailOnNumberAsyncFunctionMult2)(errorOnIndex, delay), concurrency);
            stream_1.Readable.from(arr).pipe(concurrentTransform);
            concurrentTransform.on('data', (data) => {
                outArr.push(data);
            });
            yield expect(concurrentTransform.promisifyEvents(['end'], ['error'])).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(outArr.length).toBeLessThan(errorOnIndex);
        }));
        it('should not break pipeline chain of error passing if error comes before concurrent', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const arr = [...Array(inputLength).keys()];
            const concurrency = 5;
            const erroringTranform = transformer_1.transformer.fromFunction(errorOn4);
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.delayer)(delay), concurrency);
            const source = transformer_1.transformer.fromIterable(arr);
            const p = concurrentTransform.promisifyEvents('close', 'error');
            (0, promises_1.pipeline)(source, erroringTranform, concurrentTransform).catch(() => undefined);
            yield expect(p).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
        }));
        it('should not break pipeline chain of error passing if error comes after concurrent', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const arr = [...Array(inputLength).keys()];
            const concurrency = 5;
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.delayer)(delay), concurrency);
            const erroringTranform = transformer_1.transformer.fromFunction(errorOn4);
            const passThrough = transformer_1.transformer.passThrough();
            const source = transformer_1.transformer.fromIterable(arr);
            const p = passThrough.promisifyEvents('close', 'error');
            (0, promises_1.pipeline)(source, concurrentTransform, erroringTranform, passThrough).catch(() => undefined);
            yield expect(p).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
        }));
        it('should not break pipeline chain of error passing if concurrent errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 30;
            const errorOnIndex = 10;
            const arr = [...Array(inputLength).keys()];
            const concurrency = 5;
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.getFailOnNumberAsyncFunctionMult2)(errorOnIndex, delay), concurrency);
            const passThrough = transformer_1.transformer.passThrough();
            const source = transformer_1.transformer.fromIterable(arr);
            const p = passThrough.promisifyEvents('close', 'error');
            (0, promises_1.pipeline)(source, concurrentTransform, passThrough).catch(() => undefined);
            yield expect(p).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
        }));
        it('doesnt break backpressure', () => __awaiter(void 0, void 0, void 0, function* () {
            const delay = 10;
            const inputLength = 300;
            const arr = [...Array(inputLength).keys()];
            const outArr = [];
            let chunksPassedInInput = 0;
            const concurrency = 2;
            const concurrentTransform = transformer_1.transformer.async.fromFunctionConcurrent2((0, helpers_for_tests_1.delayer)(delay), concurrency);
            const readable = stream_1.Readable.from(arr);
            readable.pipe(concurrentTransform);
            readable.on('data', () => chunksPassedInInput++);
            concurrentTransform.on('data', (data) => {
                outArr.push(data);
            });
            yield new Promise((resolve, reject) => readable.on('close', resolve));
            expect(outArr.length).toBeGreaterThan(inputLength - 50);
            yield concurrentTransform.promisifyEvents(['close'], ['error']);
            expect(outArr.length).toBe(300);
        }));
    });
    describe('fromIterable', () => {
        it('output all data from iterable', () => __awaiter(void 0, void 0, void 0, function* () {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8];
            const b = transformer_1.transformer.fromIterable(arr);
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual(arr);
        }));
        it('output all data from async generator', () => __awaiter(void 0, void 0, void 0, function* () {
            function* asyncGenerator() {
                let i = 1;
                while (true) {
                    yield i++;
                    if (i === 9)
                        break;
                }
            }
            const b = transformer_1.transformer.fromIterable(asyncGenerator());
            const result = [];
            b.on('data', (data) => {
                result.push(data);
            });
            yield (0, helpers_for_tests_1.streamEnd)(b);
            expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        }));
    });
    it('Able to mix different transforms in a single stream', () => __awaiter(void 0, void 0, void 0, function* () {
        const a = stream_1.Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);
        const add1 = (n) => n + 1;
        const filterOutOdds = (n) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((res) => setTimeout(res, 100));
            return n % 2 ? n : undefined;
        });
        const numberToString = (n) => __awaiter(void 0, void 0, void 0, function* () { return n.toString(); });
        const add1Transform = transformer_1.transformer.fromFunction(add1, { objectMode: true });
        const filterOutOddsTranform = transformer_1.transformer.async.fromFunction(filterOutOdds, { objectMode: true });
        const numberToStringTrasnform = transformer_1.transformer.async.fromFunction(numberToString, { objectMode: true });
        a.pipe(add1Transform).pipe(filterOutOddsTranform).pipe(numberToStringTrasnform);
        const result = [];
        numberToStringTrasnform.on('data', (data) => result.push(data));
        yield (0, helpers_for_tests_1.streamEnd)(numberToStringTrasnform);
        expect(result).toEqual(['3', '5', '7', '9']);
    }));
});
//# sourceMappingURL=test-transformer.spec.js.map