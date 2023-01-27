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
exports.DEFAULT_ERROR_TEXT = exports.filterOutOddsAsync = exports.filterOutOddsSync = exports.failOnEvensAsync = exports.failOnOddsAsync = exports.failOnEvensSync = exports.failOnOddsSync = exports.delayerMult2 = exports.delayer = exports.getFailOnNumberAsyncFunctionMult2 = exports.getFailOnNumberAsyncFunction = exports.getFailOnNumberFunction = exports.streamEnd = exports.sleep = void 0;
describe('asdf', () => {
    it('should run', () => {
        expect(1).toBeTruthy();
    });
});
function sleep(n) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => setTimeout(res, n));
    });
}
exports.sleep = sleep;
function streamEnd(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            stream.on('close', res);
            stream.on('error', rej);
        });
    });
}
exports.streamEnd = streamEnd;
function getFailOnNumberFunction(input, errorText = exports.DEFAULT_ERROR_TEXT) {
    return (num) => {
        if (num === input) {
            throw Error(errorText);
        }
        return num;
    };
}
exports.getFailOnNumberFunction = getFailOnNumberFunction;
function getFailOnNumberAsyncFunction(input, delay, errorText = exports.DEFAULT_ERROR_TEXT) {
    const syncVersion = getFailOnNumberFunction(input, errorText);
    return (num) => __awaiter(this, void 0, void 0, function* () {
        const newNum = syncVersion(num);
        if (delay) {
            yield sleep(delay);
        }
        return newNum;
    });
}
exports.getFailOnNumberAsyncFunction = getFailOnNumberAsyncFunction;
function getFailOnNumberAsyncFunctionMult2(input, delay, errorText = exports.DEFAULT_ERROR_TEXT) {
    const regularAsyncVersion = getFailOnNumberAsyncFunction(input, delay, errorText);
    return (num) => __awaiter(this, void 0, void 0, function* () { return (yield regularAsyncVersion(num)) * 2; });
}
exports.getFailOnNumberAsyncFunctionMult2 = getFailOnNumberAsyncFunctionMult2;
function delayer(delay) {
    return (num) => __awaiter(this, void 0, void 0, function* () {
        yield sleep(delay);
        return num;
    });
}
exports.delayer = delayer;
function delayerMult2(delay) {
    return (num) => __awaiter(this, void 0, void 0, function* () {
        yield sleep(delay);
        return num * 2;
    });
}
exports.delayerMult2 = delayerMult2;
function failOnOddsSync(n) {
    if (n % 2 === 0) {
        throw Error(exports.DEFAULT_ERROR_TEXT);
    }
    return n;
}
exports.failOnOddsSync = failOnOddsSync;
function failOnEvensSync(n) {
    if (n % 2 === 1) {
        throw Error(exports.DEFAULT_ERROR_TEXT);
    }
    return n;
}
exports.failOnEvensSync = failOnEvensSync;
function failOnOddsAsync(n) {
    return __awaiter(this, void 0, void 0, function* () {
        return failOnOddsSync(n);
    });
}
exports.failOnOddsAsync = failOnOddsAsync;
function failOnEvensAsync(n) {
    return __awaiter(this, void 0, void 0, function* () {
        return !failOnOddsSync(n);
    });
}
exports.failOnEvensAsync = failOnEvensAsync;
function filterOutOddsSync(n) {
    return !(n % 2);
}
exports.filterOutOddsSync = filterOutOddsSync;
function filterOutOddsAsync(delay) {
    return (n) => __awaiter(this, void 0, void 0, function* () {
        if (delay) {
            yield sleep(delay);
        }
        return !(n % 2);
    });
}
exports.filterOutOddsAsync = filterOutOddsAsync;
exports.DEFAULT_ERROR_TEXT = 'asdf';
//# sourceMappingURL=helpers-for-tests.js.map