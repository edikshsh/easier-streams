"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTransform = exports.filterOutStreamError = exports.passStreamError = void 0;
const uuid_1 = require("uuid");
const base_transform_1 = require("./base-transform");
function passStreamError(id) {
    return (streamError) => {
        return (!!streamError.id) && (streamError.id === id);
    };
}
exports.passStreamError = passStreamError;
function filterOutStreamError(id) {
    return (streamError) => {
        // debugger;
        return !(passStreamError(id))(streamError);
    };
}
exports.filterOutStreamError = filterOutStreamError;
// export class ErrorTransform<TSource> extends BaseTransform<StreamError<TSource>, unknown>{
// }
// export type ErrorTransform<TSource> = TypedTransform<StreamError<TSource>, unknown> & {id: string}
class ErrorTransform extends base_transform_1.BaseTransform {
    constructor(options) {
        super(options);
        this.id = uuid_1.v4();
    }
    _transform(chunk, encoding, callback) {
        callback(null, chunk);
    }
}
exports.ErrorTransform = ErrorTransform;
//# sourceMappingURL=error-stream.js.map