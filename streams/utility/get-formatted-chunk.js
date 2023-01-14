"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedChunk = void 0;
// try formatting the chunk, on fail return the original
function getFormattedChunk(chunk, options) {
    const chunkFormatter = options === null || options === void 0 ? void 0 : options.chunkFormatter;
    if (!chunkFormatter) {
        return chunk;
    }
    try {
        return chunkFormatter(chunk);
    }
    catch (_a) {
        return chunk;
    }
}
exports.getFormattedChunk = getFormattedChunk;
//# sourceMappingURL=get-formatted-chunk.js.map