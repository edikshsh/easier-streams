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
exports.ConcurrentTransform = void 0;
const lodash_1 = require("lodash");
const stream_1 = require("stream");
const stream_error_1 = require("../../errors/stream-error");
const get_formatted_chunk_1 = require("../../utility/get-formatted-chunk");
const base_transform_1 = require("../base/base-transform");
function isTruthy(item) {
    return item !== undefined && item !== null;
}
class ConcurrentTransform extends base_transform_1.BaseTransform {
    constructor(transformer, concurrency, options) {
        super(options);
        this.transformer = transformer;
        this.concurrency = concurrency;
        this.options = options;
        this.itemQueue = [];
        this.liveWorkers = 0;
        this.ee = new stream_1.EventEmitter();
        this.itemsDone = 0;
        this.ee.setMaxListeners(concurrency + 5);
    }
    inputQueueIsEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            this.itemQueue.length === 0
                ? yield Promise.resolve()
                : yield new Promise((res) => this.ee.once('itemQueueEmpty', res));
        });
    }
    allWorkersFinished() {
        return __awaiter(this, void 0, void 0, function* () {
            this.liveWorkers === 0
                ? yield Promise.resolve()
                : yield new Promise((res) => this.ee.once('promiseQueueEmpty', res));
        });
    }
    startWorker() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.liveWorkers >= this.concurrency) {
                return;
            }
            this.liveWorkers++;
            while ((yield this.worker()) === true)
                undefined;
            this.liveWorkers--;
            if (this.liveWorkers === 0) {
                this.ee.emit('promiseQueueEmpty');
            }
        });
    }
    getItemFromQueue() {
        const item = this.itemQueue.shift();
        if (this.itemQueue.length === 0) {
            this.ee.emit('itemQueueEmpty');
        }
        return item;
    }
    worker() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getItemFromQueue();
            if (!isTruthy(item)) {
                return false;
            }
            const chunkClone = (0, lodash_1.cloneDeep)(item);
            try {
                this.push(yield this.transformer(item));
                return true;
            }
            catch (error) {
                const finalError = error instanceof Error ? error : new Error(`${error}`);
                const formattedChunk = (0, get_formatted_chunk_1.getFormattedChunk)(chunkClone, this.options);
                if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.errorStream) {
                    const streamError = new stream_error_1.StreamError(finalError, chunkClone);
                    this.push(streamError);
                }
                else {
                    this.destroy(finalError);
                }
            }
            finally {
                this.itemsDone++;
            }
            return true;
        });
    }
    enqueueItems(items) {
        return __awaiter(this, void 0, void 0, function* () {
            items.forEach((item) => {
                this.itemQueue.push(item);
                void this.startWorker();
            });
            const a = yield this.inputQueueIsEmpty();
            return a;
        });
    }
    _transform(item, encoding, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enqueueItems([item]);
            callback();
        });
    }
    _destroy(error, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.itemQueue = [];
            yield this.onStreamEnd();
            callback(error);
        });
    }
    _flush(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onStreamEnd();
            callback();
        });
    }
    _final(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onStreamEnd();
            callback();
        });
    }
    onStreamEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.allWorkersFinished();
        });
    }
}
exports.ConcurrentTransform = ConcurrentTransform;
//# sourceMappingURL=concurrent-transform.js.map