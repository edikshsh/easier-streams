"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultEventCounter = exports.streamsManyToOneController = void 0;
// When piping transforms, there are some event that end all piped transforms (finish, end, close)
// When connecting many source transforms to one destination transform simultaneousely,
// we dont want to finish the destination when the source transform emits any of these events,
// but only when ALL of the source transforms finished emitting these events.
// So we have to pipe them with options: { end: false } and run this function to take care of them
function streamsManyToOneController(inputLayer, output, eventCounter = getDefaultEventCounter()) {
    const concurrency = inputLayer.length;
    // eventCounter.error = inputLayer.length - 1;
    for (const event in eventCounter) {
        inputLayer.forEach((input) => {
            input.once(event, (data) => {
                const inputsCalledCurrentEvent = ++eventCounter[event];
                if (inputsCalledCurrentEvent === concurrency) {
                    output.emit(event, data);
                }
            });
        });
    }
}
exports.streamsManyToOneController = streamsManyToOneController;
function getDefaultEventCounter() {
    return {
        close: 0,
        end: 0,
        finish: 0,
        error: 0
    };
}
exports.getDefaultEventCounter = getDefaultEventCounter;
//# sourceMappingURL=streams-many-to-one-controller.js.map