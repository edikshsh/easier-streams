"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passStreamError = void 0;
const stream_error_1 = require("./stream-error");
function passStreamError() {
    return (streamError) => {
        return streamError instanceof stream_error_1.StreamError;
    };
}
exports.passStreamError = passStreamError;
//# sourceMappingURL=pass-stream-error.js.map