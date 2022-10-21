"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedPassThrough = void 0;
const base_transform_1 = require("../base/base-transform");
class TypedPassThrough extends base_transform_1.BaseTransform {
    constructor(options) {
        super(options);
    }
    _transform(chunk, encoding, callback) {
        callback(null, chunk);
    }
}
exports.TypedPassThrough = TypedPassThrough;
//# sourceMappingURL=typed-pass-through.js.map