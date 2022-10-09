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
const simple_async_transform_1 = require("./simple-async-transform");
const simple_transform_1 = require("./simple-transform");
const array_join_transform_1 = require("./utility-transforms/array-join-transform");
const array_split_transform_1 = require("./utility-transforms/array-split-transform");
class UtilityTransforms {
    constructor(defaultTrasformOptions) {
        this.defaultTrasformOptions = defaultTrasformOptions;
    }
    mergeOptions(options) {
        return Object.assign({}, this.defaultTrasformOptions, options);
    }
    arrayJoin(length, options) {
        const finalOptions = this.mergeOptions(options);
        return new array_join_transform_1.ArrayJoinTransform(length, finalOptions);
    }
    arraySplit(options) {
        const finalOptions = this.mergeOptions(options);
        return new array_split_transform_1.ArraySplitTransform(finalOptions);
    }
    // When we pass an async function, we sometimes want to wait for it to finish, and sometimes to push to an array and wait with promise.all
    // Sometimes we can pass a regular function that returns a promise, so we dont know 100% when to wait
    // callOnData<TSource>(functionToCallOnData: (data: TSource) => (void | Promise<void>),
    //  options?: { transformOptions?: TransformOptions; functionOptions?: PassedFunctionOptions }) {
    //     const finalOptions = this.mergeOptions(options?.transformOptions);
    //     const shouldBeAwaited = options?.functionOptions?.shouldBeAwaited;
    //     if (shouldBeAwaited){
    //         const callOnData = async (data: TSource) => {
    //             const dataCopy = cloneDeep(data);
    //             await functionToCallOnData(dataCopy);
    //             return data;
    //         }
    //         return new SimpleAsyncTransform(callOnData,finalOptions);
    //     } else {
    //         const callOnData = (data: TSource) => {
    //             const dataCopy = cloneDeep(data);
    //             functionToCallOnData(dataCopy);
    //             return data;
    //         }
    //         return new SimpleTransform(callOnData,finalOptions);
    //     }
    // }
    callOnDataSync(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        const callOnData = (data) => {
            const dataCopy = (0, lodash_clonedeep_1.default)(data);
            functionToCallOnData(dataCopy);
            return data;
        };
        return new simple_transform_1.SimpleTransform(callOnData, finalOptions);
    }
    callOnDataAsync(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        const callOnData = (data) => __awaiter(this, void 0, void 0, function* () {
            const dataCopy = (0, lodash_clonedeep_1.default)(data);
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
            catch (_a) {
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
}
exports.UtilityTransforms = UtilityTransforms;
exports.utilityTransforms = new UtilityTransforms();
exports.objectUtilityTransforms = new UtilityTransforms({ objectMode: true });
//# sourceMappingURL=utility-transforms.js.map