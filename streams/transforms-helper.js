"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectTransformsHelper = exports.transformsHelper = exports.AsyncTransformsHelper = exports.TransformsHelper = exports.TransformsHelperBase = void 0;
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
class TransformsHelperBase {
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
exports.TransformsHelperBase = TransformsHelperBase;
class TransformsHelper extends TransformsHelperBase {
    constructor(defaultTrasformOptions) {
        super(defaultTrasformOptions);
        this.async = new AsyncTransformsHelper(defaultTrasformOptions);
    }
    arrayJoin(length, options) {
        const finalOptions = super.mergeOptions(options);
        return new array_join_transform_1.ArrayJoinTransform(length, finalOptions);
    }
    arraySplit(options) {
        const finalOptions = this.mergeOptions(options);
        return new array_split_transform_1.ArraySplitTransform(finalOptions);
    }
    callOnDataSync(functionToCallOnData, options) {
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
exports.TransformsHelper = TransformsHelper;
class AsyncTransformsHelper extends TransformsHelperBase {
    callOnData(functionToCallOnData, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, call_on_data_transforms_1.callOnDataAsyncTransform)(functionToCallOnData, finalOptions);
    }
    filter(filterFunction, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, filter_transforms_1.asyncFilterTransform)(filterFunction, finalOptions);
    }
    fromFunction(transformer, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_function_transforms_1.fromAsyncFunctionTransform)(transformer, finalOptions);
    }
    fromFunctionConcurrent(transformer, concurrency, options) {
        const finalOptions = this.mergeOptions(options);
        return (0, from_function_concurrent_transform_1.fromFunctionConcurrentTransform)(transformer, concurrency, finalOptions);
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
exports.AsyncTransformsHelper = AsyncTransformsHelper;
exports.transformsHelper = new TransformsHelper();
exports.objectTransformsHelper = new TransformsHelper({ objectMode: true });
//# sourceMappingURL=transforms-helper.js.map