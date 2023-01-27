"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySplitTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const base_transform_1 = require("../base/base-transform");
const on_transform_error_1 = require("../../utility/on-transform-error");
class ArraySplitTransform extends base_transform_1.BaseTransform {
    constructor(options) {
        super(options);
        this.options = options;
    }
    _transform(chunks, encoding, callback) {
        const chunkClone = (0, lodash_clonedeep_1.default)(chunks);
        try {
            chunks.forEach((chunk) => this.push(chunk));
            callback();
        }
        catch (error) {
            return (0, on_transform_error_1.onTransformError)(this, error, chunkClone, callback, this.options);
        }
    }
}
exports.ArraySplitTransform = ArraySplitTransform;
//# sourceMappingURL=array-split-transform.js.map