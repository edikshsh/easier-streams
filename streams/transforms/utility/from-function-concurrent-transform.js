"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFunctionConcurrentTransform2 = exports.fromFunctionConcurrentTransform = void 0;
const plumber_1 = require("../../plumber");
const array_join_transform_1 = require("./array-join-transform");
const concurrent_transform_1 = require("./concurrent-transform");
const from_function_transforms_1 = require("./from-function-transforms");
const pick_element_from_array_transform_1 = require("./pick-element-from-array-transform");
const typed_pass_through_1 = require("./typed-pass-through");
function fromFunctionConcurrentTransform(transformFunction, concurrency, transformOptions = {}, plumberOptions = {}) {
    const input = new typed_pass_through_1.TypedPassThrough(transformOptions);
    const toArray = new array_join_transform_1.ArrayJoinTransform(concurrency, transformOptions);
    const pickFromArrayLayer = [...Array(concurrency).keys()].map((a) => (0, pick_element_from_array_transform_1.pickElementFromArrayTransform)(a, transformOptions));
    const actionLayer = [...Array(concurrency).keys()].map(() => (0, from_function_transforms_1.fromAsyncFunctionTransform)(transformFunction, transformOptions));
    const output = new typed_pass_through_1.TypedPassThrough(transformOptions);
    plumber_1.plumber.pipe(Object.assign({}, plumberOptions), input, toArray, pickFromArrayLayer, actionLayer, output);
    return { input, output };
}
exports.fromFunctionConcurrentTransform = fromFunctionConcurrentTransform;
function fromFunctionConcurrentTransform2(transformer, concurrency, options = {}) {
    return new concurrent_transform_1.ConcurrentTransform(transformer, concurrency, options);
}
exports.fromFunctionConcurrentTransform2 = fromFunctionConcurrentTransform2;
//# sourceMappingURL=from-function-concurrent-transform.js.map