"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIterable = void 0;
const stream_1 = require("stream");
const typed_pass_through_1 = require("./typed-pass-through");
function fromIterable(iterable, options) {
    return stream_1.Readable.from(iterable).pipe(new typed_pass_through_1.TypedPassThrough(options));
}
exports.fromIterable = fromIterable;
//# sourceMappingURL=from-iterable-transform.js.map