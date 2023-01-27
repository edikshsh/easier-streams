"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAsyncTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const base_transform_1 = require("./base-transform");
const on_transform_error_1 = require("../../utility/on-transform-error");
class SimpleAsyncTransform extends base_transform_1.BaseTransform {
    constructor(transformer, options) {
        super(options);
        this.transformer = transformer;
        this.options = options;
    }
    _transform(chunk, encoding, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const chunkClone = (0, lodash_clonedeep_1.default)(chunk);
            try {
                const result = yield this.transformer(chunk);
                return callback(null, result);
            }
            catch (error) {
                return (0, on_transform_error_1.onTransformError)(this, error, chunkClone, callback, this.options);
            }
        });
    }
}
exports.SimpleAsyncTransform = SimpleAsyncTransform;
//# sourceMappingURL=simple-async-transform.js.map