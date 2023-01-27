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
const plumber_1 = require("../streams/plumber");
const transformer_1 = require("../streams/transformer");
const helpers_for_tests_1 = require("./helpers-for-tests");
describe('pipeHelper', () => {
    let sourceTransform;
    let sourceTransforms;
    let destinationTransform;
    let destinationTransforms;
    let sourceData;
    const errorOnEvenFunc = (n) => {
        if (n % 2 === 0) {
            throw Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
        }
        return n;
    };
    beforeEach(() => {
        sourceData = [1, 2, 3, 4, 5, 6, 7, 8];
        sourceTransform = transformer_1.transformer.fromIterable(sourceData);
        sourceTransforms = [0, 0].map((_, index) => transformer_1.transformer.fromIterable([0, 1, 2, 3].map((a) => a + index * 4 + 1)));
        destinationTransform = transformer_1.transformer.passThrough();
        destinationTransforms = [0, 0].map(() => transformer_1.transformer.passThrough());
    });
    describe('pipeOneToOne', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            plumber_1.plumber.pipeOneToOne(sourceTransform, destinationTransform);
            const result = [];
            destinationTransform.on('data', (data) => result.push(data));
            yield destinationTransform.promisifyEvents(['end']);
            expect(result).toEqual(sourceData);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = transformer_1.transformer.errorTransform();
            const source = sourceTransform.pipe(transformer_1.transformer.fromFunction(errorOnEvenFunc, { shouldPushErrorsForward: true }));
            plumber_1.plumber.pipeOneToOne(source, destinationTransform, { errorStream });
            const result = [];
            const errors = [];
            destinationTransform.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([destinationTransform.promisifyEvents(['end']), errorStream.promisifyEvents(['end'])]);
            expect(result).toEqual([1, 3, 5, 7]);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
        it('should error correctly when not piped to error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const source = sourceTransform.pipe(transformer_1.transformer.fromFunction(errorOnEvenFunc));
            plumber_1.plumber.pipeOneToOne(source, destinationTransform);
            const promise = Promise.all([
                destinationTransform.promisifyEvents(['end'], ['error']),
                source.promisifyEvents([], ['error']),
            ]);
            yield expect(promise).rejects.toThrow(new Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT));
        }));
    });
    describe('pipeOneToMany', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            plumber_1.plumber.pipeOneToMany(sourceTransform, destinationTransforms);
            const result = [];
            destinationTransforms.forEach((dest) => dest.on('data', (data) => result.push(data)));
            yield Promise.all(destinationTransforms.map((dest) => dest.promisifyEvents(['end'])));
            const expectedResults = [...sourceData, ...sourceData].sort((a, b) => a - b);
            expect(result).toEqual(expectedResults);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = transformer_1.transformer.errorTransform();
            const source = sourceTransform.pipe(transformer_1.transformer.fromFunction(errorOnEvenFunc, { shouldPushErrorsForward: true }));
            plumber_1.plumber.pipeOneToMany(source, destinationTransforms, { errorStream });
            const result = [];
            const errors = [];
            destinationTransforms.forEach((dest) => dest.on('data', (data) => result.push(data)));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([
                ...destinationTransforms.map((dest) => dest.promisifyEvents(['end'])),
                errorStream.promisifyEvents(['end']),
            ]);
            const expectedResult = [1, 1, 3, 3, 5, 5, 7, 7];
            expect(result).toEqual(expectedResult);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
    });
    describe('pipeManyToOne', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            plumber_1.plumber.pipeManyToOne(sourceTransforms, destinationTransform);
            const result = [];
            destinationTransform.on('data', (data) => result.push(data));
            yield destinationTransform.promisifyEvents(['end']);
            const sortedResult = result.sort((a, b) => a - b);
            expect(sortedResult).toEqual(sourceData);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = transformer_1.transformer.errorTransform();
            const sources = sourceTransforms.map((sourceTransform) => sourceTransform.pipe(transformer_1.transformer.fromFunction(errorOnEvenFunc, { shouldPushErrorsForward: true })));
            plumber_1.plumber.pipeManyToOne(sources, destinationTransform, { errorStream });
            const result = [];
            const errors = [];
            destinationTransform.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([
                sources.map((source) => source.promisifyEvents(['end'])),
                errorStream.promisifyEvents(['end']),
            ]);
            expect(result).toEqual([1, 3, 5, 7]);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
        it('should error correctly when not piped to error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const sources = sourceTransforms.map((sourceTransform) => sourceTransform.pipe(transformer_1.transformer.fromFunction(errorOnEvenFunc)));
            plumber_1.plumber.pipeManyToOne(sources, destinationTransform);
            destinationTransform.on('data', () => undefined);
            const promise = Promise.all([
                destinationTransform.promisifyEvents(['end'], 'error'),
                ...sources.map((source) => source.promisifyEvents([], ['error'])),
            ]);
            yield expect(promise).rejects.toThrow(new Error(helpers_for_tests_1.DEFAULT_ERROR_TEXT));
        }));
    });
    describe('pipeManyToMany', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            plumber_1.plumber.pipeManyToMany(sourceTransforms, destinationTransforms);
            const result = [];
            destinationTransforms.forEach((dest) => dest.on('data', (data) => result.push(data)));
            yield Promise.all(destinationTransforms.map((dest) => dest.promisifyEvents(['end'])));
            const sortedResult = result.sort((a, b) => a - b);
            expect(sortedResult).toEqual(sourceData);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = transformer_1.transformer.errorTransform();
            const sources = sourceTransforms.map((sourceTransform) => sourceTransform.pipe(transformer_1.transformer.fromFunction(errorOnEvenFunc, { shouldPushErrorsForward: true })));
            plumber_1.plumber.pipeManyToMany(sources, destinationTransforms, { errorStream });
            const result = [];
            const errors = [];
            destinationTransforms.forEach((destinationTransform) => destinationTransform.on('data', (data) => result.push(data)));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([
                sources.map((source) => source.promisifyEvents(['end'])),
                errorStream.promisifyEvents(['end']),
            ]);
            expect(result).toEqual([1, 3, 5, 7]);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
    });
    describe('pipe', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            const layer1 = transformer_1.transformer.passThrough();
            const layer2 = [0, 1].map(() => transformer_1.transformer.passThrough());
            const layer3 = [0, 1].map(() => transformer_1.transformer.passThrough());
            const layer4 = transformer_1.transformer.passThrough();
            plumber_1.plumber.pipe({}, sourceTransform, layer1, layer2, layer3, layer4);
            const result = [];
            layer4.on('data', (data) => result.push(data));
            yield layer4.promisifyEvents(['end']);
            const sortedResult = result.sort((a, b) => a - b);
            const expectedResult = [...sourceData, ...sourceData].sort((a, b) => a - b);
            expect(sortedResult).toEqual(expectedResult);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = transformer_1.transformer.errorTransform();
            const layer1 = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(1), { shouldPushErrorsForward: true });
            const layer2 = [0, 1].map(() => transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(2), { shouldPushErrorsForward: true }));
            const layer3 = [0, 1].map(() => transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(3), { shouldPushErrorsForward: true }));
            const layer4 = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(4), { shouldPushErrorsForward: true });
            const layer5 = transformer_1.transformer.passThrough();
            plumber_1.plumber.pipe({ errorStream }, sourceTransform, layer1, layer2, layer3, layer4, layer5);
            const result = [];
            const errors = [];
            layer5.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([layer5.promisifyEvents(['end']), errorStream.promisifyEvents(['end'])]);
            expect(result).toEqual([5, 5, 6, 6, 7, 7, 8, 8]);
            expect(errors).toEqual([1, 2, 2, 3, 3, 4, 4]);
        }));
    });
    describe('piping with pipeline', () => {
        it('should catch error thrown on one stream in the last piped stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const throwingTransform = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(4));
            plumber_1.plumber.pipe({ usePipeline: true }, sourceTransform, throwingTransform, destinationTransform);
            const result = [];
            destinationTransform.on('data', (data) => result.push(data));
            const promise = destinationTransform.promisifyEvents('end', 'error');
            yield expect(promise).rejects.toThrow(helpers_for_tests_1.DEFAULT_ERROR_TEXT);
            expect(result).toEqual([1, 2, 3]);
        }));
    });
    it('should be able to mix passing errors and failing', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorStream = transformer_1.transformer.errorTransform();
        const layer1 = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(1), { shouldPushErrorsForward: true });
        const layer2 = [0, 1].map(() => transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(2), { shouldPushErrorsForward: true }));
        const layer3_failing = [0, 1].map(() => transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(5, 'layer3')));
        const layer4 = transformer_1.transformer.fromFunction((0, helpers_for_tests_1.getFailOnNumberFunction)(3), { shouldPushErrorsForward: true });
        const layer5 = transformer_1.transformer.passThrough();
        const layer6 = transformer_1.transformer.passThrough();
        const silentPlumber = new plumber_1.Plumber(true);
        silentPlumber.pipe({ errorStream, usePipeline: true }, sourceTransform, layer1, layer2, layer3_failing);
        silentPlumber.pipe({ usePipeline: true }, layer3_failing, layer4);
        silentPlumber.pipe({ errorStream, usePipeline: true }, layer4, layer5, layer6);
        const result = [];
        const errors = [];
        layer5.on('data', (data) => result.push(data));
        errorStream.on('data', (error) => errors.push(error.data));
        const promise = Promise.all([
            layer6.promisifyEvents(['end'], 'error'),
            errorStream.promisifyEvents(['end'], 'error'),
        ]);
        yield expect(promise).rejects.toThrow(Error('layer3'));
        expect(result).toEqual([4, 4]);
        expect(errors).toEqual([1, 2, 2, 3, 3]);
    }));
});
//# sourceMappingURL=test-plumber.spec.js.map