"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterOutStreamError = void 0;
const pass_stream_error_1 = require("./pass-stream-error");
function filterOutStreamError() {
    const isStreamError = (0, pass_stream_error_1.passStreamError)();
    return (streamError) => {
        return !isStreamError(streamError);
    };
}
exports.filterOutStreamError = filterOutStreamError;
//# sourceMappingURL=filter-out-stream-error.js.map