"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickElementFromArrayTransform = void 0;
const from_function_transforms_1 = require("./from-function-transforms");
function pickElementFromArrayTransform(index, options) {
    return from_function_transforms_1.fromFunctionTransform((arr) => arr[index], options);
}
exports.pickElementFromArrayTransform = pickElementFromArrayTransform;
//# sourceMappingURL=pick-element-from-array-transform.js.map