"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const on_transform_error_1 = require("../../utility/on-transform-error");
const base_transform_1 = require("./base-transform");
class SimpleTransform extends base_transform_1.BaseTransform {
    constructor(transformer, options) {
        super(options);
        this.transformer = transformer;
        this.options = options;
    }
    _transform(chunk, encoding, callback) {
        const chunkClone = (0, lodash_clonedeep_1.default)(chunk);
        try {
            const result = this.transformer(chunk);
            callback(null, result);
        }
        catch (error) {
            return (0, on_transform_error_1.onTransformError)(this, error, chunkClone, callback, this.options);
        }
    }
}
exports.SimpleTransform = SimpleTransform;
//# sourceMappingURL=simple-transform.js.map