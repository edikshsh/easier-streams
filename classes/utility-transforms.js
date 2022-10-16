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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectUtilityTransforms = exports.utilityTransforms = exports.UtilityTransforms = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const stream_1 = require("stream");
const error_stream_1 = require("./error-stream");
const pipe_helper_1 = require("./pipe-helper");
const simple_async_transform_1 = require("./simple-async-transform");
const simple_transform_1 = require("./simple-transform");
const TypedPassThrough_1 = require("./TypedPassThrough");
const array_join_transform_1 = require("./utility-transforms/array-join-transform");
const array_split_transform_1 = require("./utility-transforms/array-split-transform");
// export type UtilityTransformsOptions<TSource> = {
//     errorStream?: TypedTransform<StreamError<TSource>, unknown>
// }
// type FilterOptions = {
//     filterOutOnError?: boolean;
// }
// function getDefaultFilterOptions():FilterOptions{
//     return {
//         filterOutOnError: true,
//     }
// }
class UtilityTransforms {
    constructor(defaultTrasformOptions) {
        this.defaultTrasformOptions = defaultTrasformOptions;
    }
    mergeOptions(options) {
        return Object.assign({}, this.defaultTrasformOptions, options);
    }
    // pipeErrorTransform<TSource, TDestination>(srcTransform: TypedTransform<TSource, TDestination>, errorTransform: TypedTransform<StreamError<TSource>, unknown>, options?: TransformOptions){
    //     const id = v4();
    //     srcTransform.pipe(this.filter(passStreamError(id))).pipe(errorTransform);
    //     return srcTransform.pipe(this.filter(filterOutStreamError(id))); 
    // }
    arrayJoin(length, options) {
        const finalOptions = this.mergeOptions(options);
        return new array_join_transform_1.ArrayJoinTransform(length, finalOptions);
    }
    arraySplit(options) {
        const finalOptions = this.mergeOptions(options);
        return new array_split_transform_1.ArraySplitTransform(finalOptions);
    }
    callOnDataSync(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        const callOnData = (data) => {
            const dataCopy = lodash_clonedeep_1.default(data);
            functionToCallOnData(dataCopy);
            return data;
        };
        return new simple_transform_1.SimpleTransform(callOnData, finalOptions);
    }
    callOnDataAsync(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        const callOnData = (data) => __awaiter(this, void 0, void 0, function* () {
            const dataCopy = lodash_clonedeep_1.default(data);
            yield functionToCallOnData(dataCopy);
            return data;
        });
        return new simple_async_transform_1.SimpleAsyncTransform(callOnData, finalOptions);
    }
    void(options) {
        const finalOptions = this.mergeOptions(options);
        return new simple_transform_1.SimpleTransform(() => undefined, finalOptions);
    }
    filter(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        const filter = (chunk) => {
            try {
                return filterFunction(chunk) ? chunk : undefined;
            }
            catch (error) {
                if (finalOptions.errorStream) {
                    throw error;
                }
                return undefined;
            }
        };
        return new simple_transform_1.SimpleTransform(filter, finalOptions);
    }
    fromFunction(transformer, options) {
        const finalOptions = this.mergeOptions(options);
        return new simple_transform_1.SimpleTransform(transformer, finalOptions);
    }
    fromAsyncFunction(transformer, options) {
        const finalOptions = this.mergeOptions(options);
        return new simple_async_transform_1.SimpleAsyncTransform(transformer, finalOptions);
    }
    passThrough(options) {
        const finalOptions = this.mergeOptions(options);
        return new TypedPassThrough_1.TypedPassThrough(finalOptions);
    }
    pickElementFromArray(index, options) {
        const finalOptions = this.mergeOptions(options);
        return this.fromFunction((arr) => arr[index], finalOptions);
    }
    fromFunctionConcurrent(transformer, concurrency, options) {
        const finalOptions = this.mergeOptions(options);
        const input = this.passThrough(finalOptions);
        const toArray = this.arrayJoin(concurrency, finalOptions);
        const pickFromArrayLayer = [...Array(concurrency).keys()].map((a) => this.pickElementFromArray(a, finalOptions));
        const actionLayer = [...Array(concurrency).keys()].map(() => this.fromAsyncFunction(transformer), finalOptions);
        const output = this.passThrough(finalOptions);
        actionLayer.forEach(action => action.on('error', (error) => output.emit('error', error)));
        pipe_helper_1.pipeHelper.pipe(finalOptions, input, toArray, pickFromArrayLayer, actionLayer, output);
        return { input, output };
    }
    fromIterable(iterable, options) {
        const finalOptions = this.mergeOptions(options);
        return stream_1.Readable.from(iterable).pipe(this.passThrough(finalOptions));
    }
    errorTransform(options) {
        const finalOptions = this.mergeOptions(options);
        return new error_stream_1.ErrorTransform(finalOptions);
    }
}
exports.UtilityTransforms = UtilityTransforms;
exports.utilityTransforms = new UtilityTransforms();
exports.objectUtilityTransforms = new UtilityTransforms({ objectMode: true });
//# sourceMappingURL=utility-transforms.js.map