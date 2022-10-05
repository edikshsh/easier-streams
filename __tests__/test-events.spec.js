"use strict";
// on(event: "data", listener: (chunk: any) => void): this;
// on(event: "end", listener: () => void): this;
// on(event: "error", listener: (err: Error) => void): this;
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
const Emitter_1 = require("../emitters/Emitter");
describe('TypedEventEmitter', () => {
    it('Should resolve correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const ee = new Emitter_1.TypedEventEmitter();
        const promise = ee.promisifyEvents(['data'], []);
        ee.emit('data', 12);
        yield expect(promise).resolves.toBe(12);
    }));
    it('Should reject correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const ee = new Emitter_1.TypedEventEmitter();
        const promise = ee.promisifyEvents([], ['error']);
        setTimeout(() => ee.emit('error', Error('asdf')), 10);
        yield expect(promise).rejects.toThrow(Error('asdf'));
    }));
    it('Should not throw if rejected after resolving', () => __awaiter(void 0, void 0, void 0, function* () {
        const ee = new Emitter_1.TypedEventEmitter();
        const promise = ee.promisifyEvents(['data'], ['error']);
        //Adding a dummy error handler because node passes all "error" events to process unless there is a listener.
        ee.on('error', () => undefined);
        debugger;
        setTimeout(() => ee.emit('data', 12), 10);
        setTimeout(() => ee.emit('error', Error('asdf12123')), 20);
        yield expect(promise).resolves.toBe(12);
        debugger;
    }));
});
// async function testTypedEventEmitterPromisify(){
//     const ee = new TypedEventEmitter<StreamPipeEvents<number>>();
//     const promise = ee.promisifyEvents(['data'], ['end']);
//     const promise2 = ee.promisifyEvents(['end'], ['error']);
//     promise.then((data) => {
//         console.log(data);
//     }).catch((error) => {
//         console.log(error);
//     })
//     promise2.catch((error: Error) => {
//         console.log(`caught error ${error.name}`);
//         console.log(error);
//     });
//     ee.emit('data', 12);
//     ee.emit('error', Error('asdf'));
//     await Promise.all([promise, promise2]).catch((e) => undefined);
//     ee.emit('end');
//     console.log('done');
// }
// testTypedEventEmitterPromisify();
//# sourceMappingURL=test-events.spec.js.map