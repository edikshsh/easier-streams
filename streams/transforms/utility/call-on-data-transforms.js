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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callOnDataAsyncTransform = exports.callOnDataSyncTransform = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const simple_async_transform_1 = require("../base/simple-async-transform");
const simple_transform_1 = require("../base/simple-transform");
function callOnDataSyncTransform(functionToCallOnData, options) {
    const callOnData = (data) => {
        const dataCopy = (0, lodash_clonedeep_1.default)(data);
        functionToCallOnData(dataCopy);
        return data;
    };
    return new simple_transform_1.SimpleTransform(callOnData, options);
}
exports.callOnDataSyncTransform = callOnDataSyncTransform;
function callOnDataAsyncTransform(functionToCallOnData, options) {
    const callOnData = (data) => __awaiter(this, void 0, void 0, function* () {
        const dataCopy = (0, lodash_clonedeep_1.default)(data);
        yield functionToCallOnData(dataCopy);
        return data;
    });
    return new simple_async_transform_1.SimpleAsyncTransform(callOnData, options);
}
exports.callOnDataAsyncTransform = callOnDataAsyncTransform;
//# sourceMappingURL=call-on-data-transforms.js.map