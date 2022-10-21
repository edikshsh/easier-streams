"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const stream_error_1 = require("../../errors/stream-error");
const base_transform_1 = require("./base-transform");
class SimpleTransform extends base_transform_1.BaseTransform {
    constructor(transformer, options) {
        super(options);
        this.transformer = transformer;
        this.options = options;
    }
    _transform(chunk, encoding, callback) {
        var _a;
        const chunkClone = lodash_clonedeep_1.default(chunk);
        try {
            const result = this.transformer(chunk);
            callback(null, result);
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
exports.SimpleTransform = SimpleTransform;
//# sourceMappingURL=simple-transform.js.map