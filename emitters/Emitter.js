"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = void 0;
const stream_1 = require("stream");
const eventPromisifier_1 = require("./eventPromisifier");
class TypedEventEmitter extends stream_1.EventEmitter {
    // promisifyEvents<Key extends keyof Events, Key2 extends keyof Events>(resolveEvents: Key[], rejectEvents?: Key2[]): Promise<TupleToUnion<Parameters<Events[Key]>>> {
    promisifyEvents(resolveEvents, rejectEvents) {
        const stringResolveEvents = resolveEvents.map(event => event.toString());
        const stringRejectEvents = rejectEvents === null || rejectEvents === void 0 ? void 0 : rejectEvents.map(event => event.toString());
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