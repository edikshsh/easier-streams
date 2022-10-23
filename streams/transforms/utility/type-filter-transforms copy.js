"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeFilterTransform = void 0;
const simple_transform_1 = require("../base/simple-transform");
function typeFilterTransform(typeFilterFunction, options) {
    const filter = (chunk) => {
        try {
            return typeFilterFunction(chunk) ? chunk : undefined;
        }
        catch (error) {
            if (options === null || options === void 0 ? void 0 : options.errorStream) {
                throw error;
            }
            return undefined;
        }
    };
    return new simple_transform_1.SimpleTransform(filter, options);
}
exports.typeFilterTransform = typeFilterTransform;
// export function asyncFilterTransform<TSource, TDestination extends TSource>(typeFilterFunction: (chunk: TSource) => Promise<boolean>, options?: FullTransformOptions<TSource>) {
//     const filter = async (chunk: TSource) => {
//         try {
//             return (await filterFunction(chunk)) ? chunk : undefined
//         } catch (error) {
//             if (options?.errorStream) {
//                 throw error
//             }
//             return undefined;
//         }
//     }
//     return new SimpleAsyncTransform<TSource, TSource>(filter, options);
// }
//# sourceMappingURL=type-filter-transforms%20copy.js.map