"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const base_transform_1 = require("./base-transform");
class SimpleTransform extends base_transform_1.BaseTransform {
    constructor(transformer, options) {
        super(options);
        this.transformer = transformer;
        this.options = options;
    }
    _transform(chunk, encoding, callback) {
        var _a, _b;
        const chunkClone = lodash_clonedeep_1.default(chunk);
        try {
            const result = this.transformer(chunk);
            callback(null, result);
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
            // if(finalError.message === 'a123'){
            //     debugger;
            // }
            return callback(finalError);
        }
    }
}
exports.SimpleTransform = SimpleTransform;
//# sourceMappingURL=simple-transform.js.map