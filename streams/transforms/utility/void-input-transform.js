"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voidInputTransform = void 0;
const simple_transform_1 = require("../base/simple-transform");
function voidInputTransform(options) {
    return new simple_transform_1.SimpleTransform(() => undefined, options);
}
exports.voidInputTransform = voidInputTransform;
//# sourceMappingURL=void-input-transform.js.map