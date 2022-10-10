"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTransform = void 0;
const base_transform_1 = require("./base-transform");
class SimpleTransform extends base_transform_1.BaseTransform {
    constructor(transformer, options) {
        super(options);
        this.transformer = transformer;
    }
    _transform(chunk, encoding, callback) {
        try {
            const result = this.transformer(chunk);
            callback(null, result);
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
exports.SimpleTransform = SimpleTransform;
//# sourceMappingURL=simple-transform.js.map