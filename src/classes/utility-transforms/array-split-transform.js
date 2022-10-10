"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySplitTransform = void 0;
const base_transform_1 = require("../base-transform");
class ArraySplitTransform extends base_transform_1.BaseTransform {
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