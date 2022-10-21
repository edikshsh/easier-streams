"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStreamError = void 0;
const stream_error_1 = require("./stream-error");
function isStreamError(streamError) {
    return streamError instanceof stream_error_1.StreamError;
}
exports.isStreamError = isStreamError;
//# sourceMappingURL=is-stream-error.js.map