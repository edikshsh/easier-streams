"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySplitTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const base_transform_1 = require("../base/base-transform");
const stream_error_1 = require("../../errors/stream-error");
class ArraySplitTransform extends base_transform_1.BaseTransform {
    constructor(options) {
        super(options);
        this.options = options;
    }
    _transform(chunks, encoding, callback) {
        var _a;
        const chunkClone = lodash_clonedeep_1.default(chunks);
        try {
            chunks.forEach((chunk) => this.push(chunk));
            callback();
        }
        catch (error) {
            const finalError = error instanceof Error ? error : new Error(`${error}`);
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.errorStream) {
                const streamError = new stream_error_1.StreamError(finalError, chunkClone);
                return callback(null, streamError);
            }
            return callback(finalError);
        }
    }
}
exports.ArraySplitTransform = ArraySplitTransform;
//# sourceMappingURL=array-split-transform.js.map