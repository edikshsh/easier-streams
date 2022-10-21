"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTransform = void 0;
const base_transform_1 = require("../transforms/base/base-transform");
const is_stream_error_1 = require("./is-stream-error");
class ErrorTransform extends base_transform_1.BaseTransform {
    constructor(options) {
        super(options);
        this.streamGroupControllerEventCounter = {
            close: 0,
            end: 0,
            finish: 0
        };
        this.totalInputs = 0;
    }
    _transform(chunk, encoding, callback) {
        if (is_stream_error_1.isStreamError(chunk)) {
            return callback(null, chunk);
        }
        return callback();
    }
    pipeErrorSource(transforms) {
        this.streamsManyToOneController(transforms, this);
    }
    streamsManyToOneController(inputLayer, output) {
        this.totalInputs += inputLayer.length;
        for (const event in this.streamGroupControllerEventCounter) {
            inputLayer.forEach((input) => {
                input.once(event, () => {
                    const inputsCalledCurrentEvent = (++this.streamGroupControllerEventCounter[event]);
                    if (inputsCalledCurrentEvent === this.totalInputs) {
                        output.emit(event);
                    }
                });
            });
        }
    }
}
exports.ErrorTransform = ErrorTransform;
//# sourceMappingURL=error-transform.js.map