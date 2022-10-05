"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayJoinTransform = void 0;
const stream_1 = require("stream");
class ArrayJoinTransform extends stream_1.Transform {
    constructor(length, options) {
        super(options);
        this.length = length;
        this.array = [];
    }
    _transform(chunk, encoding, callback) {
        this.array.push(chunk);
        if (this.array.length >= this.length) {
            callback(null, this.array);
            this.array = [];
        }
        else {
            callback();
        }
    }
    _flush(callback) {
        callback(null, this.array.length ? this.array : undefined);
    }
}
exports.ArrayJoinTransform = ArrayJoinTransform;
//# sourceMappingURL=array-join-transform.js.map