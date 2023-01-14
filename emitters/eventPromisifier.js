"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventPromisifier = void 0;
class EventPromisifier {
    _promisifyEvents(emitter, resolveEvents = [], rejectEvents = []) {
        return __awaiter(this, void 0, void 0, function* () {
            resolveEvents = typeof resolveEvents === 'string' ? [resolveEvents] : resolveEvents;
            rejectEvents = typeof rejectEvents === 'string' ? [rejectEvents] : rejectEvents;
            resolveEvents = resolveEvents.filter((event) => event);
            rejectEvents = rejectEvents.filter((event) => event);
            if (!(resolveEvents.length || rejectEvents.length)) {
                return undefined;
            }
            return new Promise((resolve, reject) => {
                const allEvents = [...resolveEvents, ...rejectEvents];
                const functionsToTurnOff = [];
                const wrapper = (eventString) => {
                    const eventListenerFunction = (data) => {
                        functionsToTurnOff.forEach((item) => emitter.off(item.event, item.func));
                        if (resolveEvents.includes(eventString)) {
                            resolve(data);
                        }
                        else {
                            reject(data);
                        }
                    };
                    functionsToTurnOff.push({ event: eventString, func: eventListenerFunction });
                    return eventListenerFunction;
                };
                allEvents.forEach((event) => emitter.on(event, wrapper(event)));
            });
        });
    }
}
exports.eventPromisifier = new EventPromisifier();
//# sourceMappingURL=eventPromisifier.js.map