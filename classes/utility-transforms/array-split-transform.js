"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySplitTransform = void 0;
const stream_1 = require("stream");
class ArraySplitTransform extends stream_1.Transform {
    constructor(options) {
        super(options);
    }
    _transform(chunks, encoding, callback) {
        try {
            chunks.forEach((chunk) => this.push(chunk));
            callback();
        }
        catch (error) {
            if (error instanceof Error) {
                callback(error);
            }
            else {
                callback(new Error(`${error}`));
            }
        }
    }
}
exports.ArraySplitTransform = ArraySplitTransform;
//# sourceMappingURL=array-split-transform.js.map