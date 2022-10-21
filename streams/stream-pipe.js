"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamPipe = void 0;
const Emitter_1 = require("../emitters/Emitter");
/**
 * Deprecated
 * Use pipeHelper
 */
class StreamPipe extends Emitter_1.TypedEventEmitter {
    constructor(_source, _pipeline, _destination) {
        super();
        this._source = _source;
        this._pipeline = _pipeline;
        this._destination = _destination;
        this.pipePipelineEventsToSelf();
        this.build();
    }
    pipePipelineEventsToSelf() {
        this._destination.on('close', () => this.emit('close'));
        this._destination.on('end', () => this.emit('end'));
        this._destination.on('finish', () => this.emit('finish'));
        this._destination.on('data', (data) => this.emit('data', data));
        this._source.on('error', (error) => this.emit('error', error));
        this._pipeline.forEach(transform => transform.on('error', (error) => this.emit('error', error)));
        this._destination.on('error', (error) => this.emit('error', error));
    }
    get source() { return this._source; }
    get pipeline() { return [this._source, ...this._pipeline, this._destination]; }
    get destination() { return this._destination; }
    build() {
        [...this._pipeline, this.destination].reduce((lastTranform, newTransform) => {
            return lastTranform.pipe(newTransform);
        }, this.source);
    }
    pipe(destination, options) {
        this.destination.pipe(destination.destination, options);
        return destination;
    }
    unpipe(destination) {
        this.destination.unpipe(destination === null || destination === void 0 ? void 0 : destination.destination);
        return this;
    }
}
function getStreamPipe(...transforms) {
    return new StreamPipe(transforms[0], transforms.slice(1, transforms.length - 1), transforms[transforms.length - 1]);
}
exports.getStreamPipe = getStreamPipe;
//# sourceMappingURL=stream-pipe.js.map