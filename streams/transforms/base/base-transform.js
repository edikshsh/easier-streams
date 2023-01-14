"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTransform = void 0;
const stream_1 = require("stream");
const eventPromisifier_1 = require("../../../emitters/eventPromisifier");
class BaseTransform extends stream_1.Transform {
    constructor(options) {
        super(options);
    }
    isKeyArray(keys) {
        return Array.isArray(keys);
    }
    keysToStringArray(keys) {
        if (this.isKeyArray(keys)) {
            return (keys === null || keys === void 0 ? void 0 : keys.map((event) => event.toString())) || [];
        }
        return keys ? [keys.toString()] : [];
    }
    promisifyEvents(resolveEvents, rejectEvents) {
        return eventPromisifier_1.eventPromisifier._promisifyEvents(this, this.keysToStringArray(resolveEvents), this.keysToStringArray(rejectEvents));
    }
    on(eventName, listener) {
        return super.on(eventName.toString(), listener);
    }
    addListener(eventName, listener) {
        return super.addListener(eventName, listener);
    }
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    off(eventName, listener) {
        return super.off(eventName, listener);
    }
    removeListener(eventName, listener) {
        return super.removeListener(eventName, listener);
    }
    once(eventName, listener) {
        return super.once(eventName, listener);
    }
}
exports.BaseTransform = BaseTransform;
//# sourceMappingURL=base-transform.js.map