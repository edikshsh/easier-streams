"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFunctionConcurrentTransform = void 0;
const pipe_helper_1 = require("../../pipe-helper");
const array_join_transform_1 = require("./array-join-transform");
const from_function_transforms_1 = require("./from-function-transforms");
const pick_element_from_array_transform_1 = require("./pick-element-from-array-transform");
const typed_pass_through_1 = require("./typed-pass-through");
function fromFunctionConcurrentTransform(transformer, concurrency, options = {}) {
    const input = new typed_pass_through_1.TypedPassThrough(options);
    const toArray = new array_join_transform_1.ArrayJoinTransform(concurrency, options);
    const pickFromArrayLayer = [...Array(concurrency).keys()].map((a) => pick_element_from_array_transform_1.pickElementFromArrayTransform(a, options));
    const actionLayer = [...Array(concurrency).keys()].map(() => from_function_transforms_1.fromAsyncFunctionTransform(transformer, options));
    const output = new typed_pass_through_1.TypedPassThrough(options);
    actionLayer.forEach(action => action.on('error', (error) => output.emit('error', error)));
    pipe_helper_1.pipeHelper.pipe(options, input, toArray, pickFromArrayLayer, actionLayer, output);
    return { input, output };
}
exports.fromFunctionConcurrentTransform = fromFunctionConcurrentTransform;
//# sourceMappingURL=from-function-concurrent-transform.js.map