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
const pipe_helper_1 = require("../classes/pipe-helper");
const utility_transforms_1 = require("../classes/utility-transforms");
describe('pipeHelper', () => {
    let sourceTransform;
    let sourceTransforms;
    let destinationTransform;
    let destinationTransforms;
    let sourceData;
    const errorOnEvenFunc = (n) => {
        if (n % 2 === 0) {
            throw Error('asdf');
        }
        return n;
    };
    beforeEach(() => {
        sourceData = [1, 2, 3, 4, 5, 6, 7, 8];
        sourceTransform = utility_transforms_1.objectUtilityTransforms.fromIterable(sourceData);
        sourceTransforms = [0, 0].map((_, index) => utility_transforms_1.objectUtilityTransforms.fromIterable([0, 1, 2, 3].map(a => a + (index * 4) + 1)));
        destinationTransform = utility_transforms_1.objectUtilityTransforms.passThrough();
        destinationTransforms = [0, 0].map(() => utility_transforms_1.objectUtilityTransforms.passThrough());
    });
    describe('pipeOneToOne', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            pipe_helper_1.pipeHelper.pipeOneToOne(sourceTransform, destinationTransform);
            const result = [];
            destinationTransform.on('data', (data) => result.push(data));
            yield destinationTransform.promisifyEvents(['end']);
            expect(result).toEqual(sourceData);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const source = sourceTransform.pipe(utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnEvenFunc, { errorStream }));
            pipe_helper_1.pipeHelper.pipeOneToOne(source, destinationTransform, { errorStream });
            const result = [];
            const errors = [];
            destinationTransform.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([destinationTransform.promisifyEvents(['end']), errorStream.promisifyEvents(['end'])]);
            expect(result).toEqual([1, 3, 5, 7]);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
        it('should error correctly when not piped to error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const source = sourceTransform.pipe(utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnEvenFunc));
            pipe_helper_1.pipeHelper.pipeOneToOne(source, destinationTransform);
            const promise = Promise.all([destinationTransform.promisifyEvents(['end'], ['error']), source.promisifyEvents([], ['error'])]);
            yield expect(promise).rejects.toThrow(new Error('asdf'));
        }));
    });
    describe('pipeOneToMany', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            pipe_helper_1.pipeHelper.pipeOneToMany(sourceTransform, destinationTransforms);
            const result = [];
            destinationTransforms.forEach(dest => dest.on('data', (data) => result.push(data)));
            yield Promise.all(destinationTransforms.map(dest => dest.promisifyEvents(['end'])));
            const expectedResults = [...sourceData, ...sourceData].sort((a, b) => a - b);
            expect(result).toEqual(expectedResults);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const source = sourceTransform.pipe(utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnEvenFunc, { errorStream }));
            pipe_helper_1.pipeHelper.pipeOneToMany(source, destinationTransforms, { errorStream });
            const result = [];
            const errors = [];
            destinationTransforms.forEach(dest => dest.on('data', (data) => result.push(data)));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([...destinationTransforms.map(dest => dest.promisifyEvents(['end'])), errorStream.promisifyEvents(['end'])]);
            const expectedResult = [1, 1, 3, 3, 5, 5, 7, 7];
            expect(result).toEqual(expectedResult);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
    });
    describe('pipeManyToOne', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            pipe_helper_1.pipeHelper.pipeManyToOne(sourceTransforms, destinationTransform);
            const result = [];
            destinationTransform.on('data', (data) => result.push(data));
            yield destinationTransform.promisifyEvents(['end']);
            const sortedResult = result.sort((a, b) => a - b);
            expect(sortedResult).toEqual(sourceData);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const sources = sourceTransforms.map((sourceTransform) => sourceTransform.pipe(utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnEvenFunc, { errorStream })));
            pipe_helper_1.pipeHelper.pipeManyToOne(sources, destinationTransform, { errorStream });
            const result = [];
            const errors = [];
            destinationTransform.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([sources.map(source => source.promisifyEvents(['end'])), errorStream.promisifyEvents(['end'])]);
            expect(result).toEqual([1, 3, 5, 7]);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
        it('should error correctly when not piped to error stream', () => __awaiter(void 0, void 0, void 0, function* () {
            const sources = sourceTransforms.map((sourceTransform) => sourceTransform.pipe(utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnEvenFunc)));
            pipe_helper_1.pipeHelper.pipeManyToOne(sources, destinationTransform);
            destinationTransform.on('data', () => undefined);
            const promise = Promise.all([destinationTransform.promisifyEvents(['end']), ...sources.map(source => source.promisifyEvents([], ['error']))]);
            yield expect(promise).rejects.toThrow(new Error('asdf'));
        }));
    });
    describe('pipeManyToMany', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            pipe_helper_1.pipeHelper.pipeManyToMany(sourceTransforms, destinationTransforms);
            const result = [];
            destinationTransforms.forEach(dest => dest.on('data', (data) => result.push(data)));
            yield Promise.all(destinationTransforms.map(dest => dest.promisifyEvents(['end'])));
            const sortedResult = result.sort((a, b) => a - b);
            expect(sortedResult).toEqual(sourceData);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const sources = sourceTransforms.map((sourceTransform) => sourceTransform.pipe(utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnEvenFunc, { errorStream })));
            pipe_helper_1.pipeHelper.pipeManyToMany(sources, destinationTransforms, { errorStream });
            const result = [];
            const errors = [];
            destinationTransforms.forEach(destinationTransform => destinationTransform.on('data', (data) => result.push(data)));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([sources.map(source => source.promisifyEvents(['end'])), errorStream.promisifyEvents(['end'])]);
            expect(result).toEqual([1, 3, 5, 7]);
            expect(errors).toEqual([2, 4, 6, 8]);
        }));
    });
    describe('pipe ', () => {
        it('should pass data', () => __awaiter(void 0, void 0, void 0, function* () {
            const layer1 = utility_transforms_1.objectUtilityTransforms.passThrough();
            const layer2 = [0, 1].map(() => utility_transforms_1.objectUtilityTransforms.passThrough());
            const layer3 = [0, 1].map(() => utility_transforms_1.objectUtilityTransforms.passThrough());
            const layer4 = utility_transforms_1.objectUtilityTransforms.passThrough();
            pipe_helper_1.pipeHelper.pipe({}, sourceTransform, layer1, layer2, layer3, layer4);
            const result = [];
            layer4.on('data', (data) => result.push(data));
            yield layer4.promisifyEvents(['end']);
            const sortedResult = result.sort((a, b) => a - b);
            const expectedResult = [...sourceData, ...sourceData].sort((a, b) => a - b);
            expect(sortedResult).toEqual(expectedResult);
        }));
        it('should pass error data', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorOnInput = (input) => (n) => {
                if (input === n) {
                    throw new Error('asdf');
                }
                return n;
            };
            const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
            const layer1 = utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(1), { errorStream });
            const layer2 = [0, 1].map(() => utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(2), { errorStream }));
            const layer3 = [0, 1].map(() => utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(3), { errorStream }));
            const layer4 = utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(4), { errorStream });
            const layer5 = utility_transforms_1.objectUtilityTransforms.passThrough();
            pipe_helper_1.pipeHelper.pipe({ errorStream }, sourceTransform, layer1, layer2, layer3, layer4, layer5);
            const result = [];
            const errors = [];
            layer5.on('data', (data) => result.push(data));
            errorStream.on('data', (error) => errors.push(error.data));
            yield Promise.all([layer5.promisifyEvents(['end']), errorStream.promisifyEvents(['end'])]);
            expect(result).toEqual([5, 5, 6, 6, 7, 7, 8, 8]);
            expect(errors).toEqual([1, 2, 2, 3, 3, 4, 4]);
        }));
    });
    it('should be able to mix passing errors and failing', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorOnInput = (input, error = 'asdf') => (n) => {
            if (input === n) {
                throw new Error(error);
            }
            return n;
        };
        const errorStream = utility_transforms_1.objectUtilityTransforms.errorTransform();
        const layer1 = utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(1), { errorStream });
        const layer2 = [0, 1].map(() => utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(2), { errorStream }));
        const layer3_failing = [0, 1].map(() => utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(5, 'layer3')));
        const layer4 = utility_transforms_1.objectUtilityTransforms.fromFunction(errorOnInput(3), { errorStream });
        const layer5 = utility_transforms_1.objectUtilityTransforms.passThrough();
        pipe_helper_1.pipeHelper.pipe({ errorStream }, sourceTransform, layer1, layer2, layer3_failing);
        pipe_helper_1.pipeHelper.pipe({}, layer3_failing, layer4);
        pipe_helper_1.pipeHelper.pipe({ errorStream }, layer4, layer5);
        const result = [];
        const errors = [];
        layer5.on('data', (data) => result.push(data));
        errorStream.on('data', (error) => errors.push(error.data));
        const promise = Promise.all([layer5.promisifyEvents(['end']), errorStream.promisifyEvents(['end']), ...layer3_failing.map(transform => transform.promisifyEvents(['end'], ['error']))]);
        yield expect(promise).rejects.toThrow(Error('layer3'));
        expect(result).toEqual([4, 4]);
        expect(errors).toEqual([1, 2, 2, 3, 3]);
    }));
});
//# sourceMappingURL=test-pipe-helper.spec.js.map