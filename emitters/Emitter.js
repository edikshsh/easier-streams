"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = void 0;
const stream_1 = require("stream");
const eventPromisifier_1 = require("./eventPromisifier");
class TypedEventEmitter extends stream_1.EventEmitter {
    isSingleKey(keys) {
        return typeof keys === 'string' || typeof keys === 'symbol';
    }
    keysToStringArray(keys) {
        if (this.isSingleKey(keys)) {
            return [keys.toString()];
        }
        else {
            return (keys === null || keys === void 0 ? void 0 : keys.map(event => event.toString())) || [];
        }
    }
    promisifyEvents(resolveEvents, rejectEvents) {
        const stringResolveEvents = this.keysToStringArray(resolveEvents);
        const stringRejectEvents = this.keysToStringArray(rejectEvents);
        return eventPromisifier_1.eventPromisifier._promisifyEvents(this, stringResolveEvents, stringRejectEvents);
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
exports.TypedEventEmitter = TypedEventEmitter;
//# sourceMappingURL=Emitter.js.map