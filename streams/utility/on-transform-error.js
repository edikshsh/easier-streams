"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onTransformError = void 0;
const stream_error_1 = require("../errors/stream-error");
const transform_events_type_1 = require("../transforms/typed-transform/transform-events.type");
const get_formatted_chunk_1 = require("./get-formatted-chunk");
function onTransformError(stream, error, chunk, callback, options) {
    if (options === null || options === void 0 ? void 0 : options.ignoreErrors) {
        return callback();
    }
    const finalError = error instanceof Error ? error : new Error(`${error}`);
    if (options === null || options === void 0 ? void 0 : options.shouldPushErrorsForward) {
        const formattedChunk = (0, get_formatted_chunk_1.getFormattedChunk)(chunk, options);
        const streamError = new stream_error_1.StreamError(finalError, formattedChunk);
        return callback(null, streamError);
    }
    stream.emit(transform_events_type_1.SOURCE_ERROR, finalError);
    return callback(finalError);
}
exports.onTransformError = onTransformError;
//# sourceMappingURL=on-transform-error.js.map