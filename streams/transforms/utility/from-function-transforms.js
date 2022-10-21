"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAsyncFunctionTransform = exports.fromFunctionTransform = void 0;
const simple_async_transform_1 = require("../base/simple-async-transform");
const simple_transform_1 = require("../base/simple-transform");
function fromFunctionTransform(transformer, options) {
    return new simple_transform_1.SimpleTransform(transformer, options);
}
exports.fromFunctionTransform = fromFunctionTransform;
function fromAsyncFunctionTransform(transformer, options) {
    return new simple_async_transform_1.SimpleAsyncTransform(transformer, options);
}
exports.fromAsyncFunctionTransform = fromAsyncFunctionTransform;
//# sourceMappingURL=from-function-transforms.js.map