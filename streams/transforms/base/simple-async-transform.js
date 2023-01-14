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
const stream_error_1 = require("../../errors/stream-error");
const get_formatted_chunk_1 = require("../../utility/get-formatted-chunk");
class SimpleAsyncTransform extends base_transform_1.BaseTransform {
    constructor(transformer, options) {
        super(options);
        this.transformer = transformer;
        this.options = options;
    }
    _transform(chunk, encoding, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chunkClone = (0, lodash_clonedeep_1.default)(chunk);
            try {
                const result = yield this.transformer(chunk);
                return callback(null, result);
            }
            catch (error) {
                const finalError = error instanceof Error ? error : new Error(`${error}`);
                const formattedChunk = (0, get_formatted_chunk_1.getFormattedChunk)(chunkClone, this.options);
                if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.errorStream) {
                    const streamError = new stream_error_1.StreamError(finalError, formattedChunk);
                    return callback(null, streamError);
                }
                return callback(finalError);
            }
        });
    }
}
exports.SimpleAsyncTransform = SimpleAsyncTransform;
// function asdf<TDestination>(data: TDestination, error: Error, isPipedToErrorStream: boolean): {
//     error: StreamError<TDestination> | Error | null,
//     data: StreamError<TDestination> | null
// } {
//     const finalError = error instanceof Error ? error : new Error(`${error}`)
//     if (isPipedToErrorStream) {
//         const streamError = new StreamError(finalError, data);
//         return { error: null, data: streamError }
//     }
//     return { error: finalError, data: null }
// }
//# sourceMappingURL=simple-async-transform.js.map