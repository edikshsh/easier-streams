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
exports.transformer = exports.AsyncTransformer = exports.Transformer = exports.TransformerBase = void 0;
const error_transform_1 = require("./errors/error-transform");
const array_split_transform_1 = require("./transforms/utility/array-split-transform");
const call_on_data_transforms_1 = require("./transforms/utility/call-on-data-transforms");
const void_input_transform_1 = require("./transforms/utility/void-input-transform");
const filter_transforms_1 = require("./transforms/utility/filter-transforms");
const from_function_transforms_1 = require("./transforms/utility/from-function-transforms");
const from_function_concurrent_transform_1 = require("./transforms/utility/from-function-concurrent-transform");
const from_iterable_transform_1 = require("./transforms/utility/from-iterable-transform");
const typed_pass_through_1 = require("./transforms/utility/typed-pass-through");
const pick_element_from_array_transform_1 = require("./transforms/utility/pick-element-from-array-transform");
const array_join_transform_1 = require("./transforms/utility/array-join-transform");
const type_filter_transforms_1 = require("./transforms/utility/type-filter-transforms");
class TransformerBase {
    constructor(defaultTrasformOptions) {
        this.defaultTrasformOptions = defaultTrasformOptions;
    }
    mergeOptions(options) {
        return Object.assign({}, this.defaultTrasformOptions, options);
    }
    errorTransform(options) {
        const finalOptions = this.mergeOptions(options);
        return new error_transform_1.ErrorTransform(finalOptions);
    }
}
exports.TransformerBase = TransformerBase;
class Transformer extends TransformerBase {
    constructor(defaultTrasformOptions) {
        super(defaultTrasformOptions);
        this.async = new AsyncTransformer(defaultTrasformOptions);
    }
    arrayJoin(length, options) {
        const finalOptions = super.mergeOptions(options);
        return new array_join_transform_1.ArrayJoinTransform(length, finalOptions);
    }
    arraySplit(options) {
        const finalOptions = this.mergeOptions(options);
        return new array_split_transform_1.ArraySplitTransform(finalOptions);
    }
    callOnData(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, call_on_data_transforms_1.callOnDataSyncTransform)(functionToCallOnData, finalOptions);
    }
    void(options) {
        const finalOptions = this.mergeOptions(options);
        return (0, void_input_transform_1.voidInputTransform)(finalOptions);
    }
    passThrough(options) {
        const finalOptions = this.mergeOptions(options);
        return new typed_pass_through_1.TypedPassThrough(finalOptions);
    }
    filter(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, filter_transforms_1.filterTransform)(filterFunction, finalOptions);
    }
    fork(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        const filterTrueTransform = (0, filter_transforms_1.filterTransform)(filterFunction, finalOptions);
        const filterFalseTransform = (0, filter_transforms_1.filterTransform)((chunk) => !filterFunction(chunk), finalOptions);
        return {
            filterTrueTransform,
            filterFalseTransform,
        };
    }
    typeFilter(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, type_filter_transforms_1.typeFilterTransform)(filterFunction, finalOptions);
    }
    fromFunction(transformer, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_function_transforms_1.fromFunctionTransform)(transformer, finalOptions);
    }
    pickElementFromArray(index, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, pick_element_from_array_transform_1.pickElementFromArrayTransform)(index, finalOptions);
    }
    fromIterable(iterable, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_iterable_transform_1.fromIterable)(iterable, finalOptions);
    }
}
exports.Transformer = Transformer;
class AsyncTransformer extends TransformerBase {
    callOnData(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, call_on_data_transforms_1.callOnDataAsyncTransform)(functionToCallOnData, finalOptions);
    }
    filter(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, filter_transforms_1.asyncFilterTransform)(filterFunction, finalOptions);
    }
    fork(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        const filterTrueTransform = (0, filter_transforms_1.asyncFilterTransform)(filterFunction, finalOptions);
        const filterFalseTransform = (0, filter_transforms_1.asyncFilterTransform)((chunk) => __awaiter(this, void 0, void 0, function* () { return !(yield filterFunction(chunk)); }), finalOptions);
        return {
            filterTrueTransform,
            filterFalseTransform,
        };
    }
    fromFunction(transformer, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_function_transforms_1.fromAsyncFunctionTransform)(transformer, finalOptions);
    }
    fromFunctionConcurrent(transformer, concurrency, options, plumberOptions) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_function_concurrent_transform_1.fromFunctionConcurrentTransform)(transformer, concurrency, finalOptions, plumberOptions);
    }
    fromFunctionConcurrent2(transformer, concurrency, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_function_concurrent_transform_1.fromFunctionConcurrentTransform2)(transformer, concurrency, finalOptions);
    }
    fromIterable(iterable, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_iterable_transform_1.fromIterable)(iterable, finalOptions);
    }
}
exports.AsyncTransformer = AsyncTransformer;
exports.transformer = new Transformer({ objectMode: true });
//# sourceMappingURL=transformer.js.map