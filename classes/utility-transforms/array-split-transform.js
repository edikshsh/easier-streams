"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySplitTransform = void 0;
const base_transform_1 = require("../base-transform");
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
class ArraySplitTransform extends base_transform_1.BaseTransform {
    constructor(options) {
        super(options);
        this.options = options;
    }
    _transform(chunks, encoding, callback) {
        var _a, _b;
        const chunkClone = lodash_clonedeep_1.default(chunks);
        try {
            chunks.forEach((chunk) => this.push(chunk));
            callback();
        }
        catch (error) {
            const finalError = error instanceof Error ? error : new Error(`${error}`);
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.errorStream) {
                const streamError = {
                    data: chunkClone,
                    error: finalError,
                    id: (_b = this.options) === null || _b === void 0 ? void 0 : _b.errorStream.id
                };
                return callback(null, streamError);
            }
            return callback(finalError);
        }
    }
}
exports.ArraySplitTransform = ArraySplitTransform;
//# sourceMappingURL=array-split-transform.js.map