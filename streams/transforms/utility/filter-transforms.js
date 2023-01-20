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
exports.asyncFilterTransform = exports.filterTransform = void 0;
const simple_async_transform_1 = require("../base/simple-async-transform");
const simple_transform_1 = require("../base/simple-transform");
function filterTransform(filterFunction, options) {
    const filter = (chunk) => {
        try {
            return filterFunction(chunk) ? chunk : undefined;
        }
        catch (error) {
            onFilterError(error, options === null || options === void 0 ? void 0 : options.considerErrorAsFilterOut);
            // if(options?.considerErrorAsFilterOut){
            //     return undefined
            // }
            // if (options?.errorStream) {
            //     throw error;
            // }
            // return undefined;
            // throw error;
        }
    };
    return new simple_transform_1.SimpleTransform(filter, options);
}
exports.filterTransform = filterTransform;
function asyncFilterTransform(filterFunction, options) {
    const filter = (chunk) => __awaiter(this, void 0, void 0, function* () {
        try {
            return (yield filterFunction(chunk)) ? chunk : undefined;
        }
        catch (error) {
            onFilterError(error, options === null || options === void 0 ? void 0 : options.considerErrorAsFilterOut);
            // if (options?.errorStream) {
            //     throw error;
            // }
            // return undefined;
        }
    });
    return new simple_async_transform_1.SimpleAsyncTransform(filter, options);
}
exports.asyncFilterTransform = asyncFilterTransform;
function onFilterError(error, considerErrorAsFilterOut) {
    if (considerErrorAsFilterOut) {
        return undefined;
    }
    // if (options?.errorStream) {
    //     throw error;
    // }
    // return undefined;
    throw error;
}
//# sourceMappingURL=filter-transforms.js.map