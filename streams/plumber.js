"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plumber = void 0;
const stream_1 = require("stream");
const streams_many_to_one_controller_1 = require("./utility/streams-many-to-one-controller");
const filter_out_stream_error_1 = require("./errors/filter-out-stream-error");
const transformer_1 = require("./transformer");
function noop(...args) {
    return undefined;
}
class Plumber {
    // pipe<T1, T2, T3 extends T2, T4>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_v2_03<T1, T2, T3, T4>): void
    // pipe<T1, T2, T3 extends T2, T4, T5 extends T4, T6>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_v2_04<T1, T2, T3, T4, T5, T6>): void
    // pipe<T1, T2, T3 extends T2, T4, T5 extends T4, T6, T7 extends T6, T8>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_v2_05<T1, T2, T3, T4, T5, T6, T7, T8>): void
    pipe(options, ...transformGroups) {
        const source = transformGroups[0];
        if (!source) {
            throw Error('pipe helper cannot pipe');
        }
        let previousGroup = source;
        for (const currGroup of transformGroups.slice(1)) {
            if (!previousGroup)
                break;
            if (previousGroup instanceof stream_1.Transform) {
                if (currGroup instanceof stream_1.Transform) {
                    previousGroup = this.pipeOneToOne(previousGroup, currGroup, options).destination;
                }
                else {
                    previousGroup = this.pipeOneToMany(previousGroup, currGroup, options).destination;
                }
            }
            else {
                if (currGroup instanceof stream_1.Transform) {
                    previousGroup = this.pipeManyToOne(previousGroup, currGroup, options).destination;
                }
                else {
                    previousGroup = this.pipeManyToMany(previousGroup, currGroup, options).destination;
                }
            }
        }
    }
    pipeOneToOne(srcTransform, destTransform, options) {
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors([srcTransform], errorStream);
            this.pipeData([srcTransform], destTransform);
        }
        else {
            // srcTransform.pipe(destTransform)
            this.pipingFunctionLegacy(srcTransform, destTransform);
        }
        return { source: srcTransform, destination: destTransform };
    }
    pipeOneToMany(srcTransform, destTransforms, options) {
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors([srcTransform], errorStream);
            destTransforms.forEach((destination) => this.pipeData([srcTransform], destination));
        }
        else {
            // destTransforms.forEach((destination) => srcTransform.pipe(destination));
            destTransforms.forEach((destination) => this.pipingFunctionLegacy(srcTransform, destination));
        }
        return { source: srcTransform, destination: destTransforms };
    }
    pipeManyToOne(srcTransforms, destTransform, options) {
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors(srcTransforms, errorStream);
            this.pipeData(srcTransforms, destTransform);
        }
        else {
            // srcTransforms.forEach(srcTransform => srcTransform.pipe(destTransform, { end: false }));
            srcTransforms.forEach((srcTransform) => this.pipingFunctionLegacy(srcTransform, destTransform, { end: false }));
            this.abortTransformArrayIfOneFails(srcTransforms);
        }
        (0, streams_many_to_one_controller_1.streamsManyToOneController)(srcTransforms, destTransform);
        return { source: srcTransforms, destination: destTransform };
    }
    pipeManyToMany(srcTransforms, destTransforms, options) {
        if (srcTransforms.length !== destTransforms.length) {
            throw new Error(`pipeManyToMany: can't make connection ${srcTransforms.length} to ${destTransforms.length}`);
        }
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors(srcTransforms, errorStream);
            srcTransforms.forEach((sourceTransform, index) => this.pipeData([sourceTransform], destTransforms[index]));
        }
        else {
            // srcTransforms.forEach((srcTransform, index) => srcTransform.pipe(destTransforms[index]));
            srcTransforms.forEach((srcTransform, index) => this.pipingFunctionLegacy(srcTransform, destTransforms[index]));
            this.abortTransformArrayIfOneFails(srcTransforms);
        }
        return { source: srcTransforms, destination: destTransforms };
    }
    abortTransformArrayIfOneFails(transforms) {
        if (transforms.length === 1) {
            return;
        }
        transforms.forEach((source, index) => {
            const otherSources = [...transforms.slice(0, index), ...transforms.slice(index + 1, transforms.length)];
            source.on('error', () => otherSources.forEach((otherSource) => otherSource.destroy()));
        });
    }
    pipeErrors(sources, errorTransform) {
        if (sources.length > 1) {
            (0, streams_many_to_one_controller_1.streamsManyToOneController)(sources, errorTransform);
        }
        // sources.forEach(source => source.pipe(errorTransform, { end: false }));
        sources.forEach((source) => this.pipingFunctionLegacy(source, errorTransform, { end: false }));
        errorTransform.pipeErrorSource(sources);
    }
    pipeData(sources, destination) {
        // sources.forEach(source => source.pipe(objectTransformsHelper.filter(filterOutStreamError())).pipe(destination));
        sources.forEach((source) => {
            const errorFilter = transformer_1.transformer.filter((0, filter_out_stream_error_1.filterOutStreamError)()); //TODO: fix type
            this.pipingFunctionLegacy(source, errorFilter);
            this.pipingFunctionLegacy(errorFilter, destination);
        });
    }
    pipingFunctionLegacy(source, destination, options) {
        return source.pipe(destination, options);
    }
    // TODO: find an alternative to the missing "end" parameter
    // because new piping method lacks the "end" option, stream might end prematurely when connected to more than 1 stream.
    // Example: a => async b => c, where all of them are connected to an error stream e.
    // a ends, thus ending b and e.
    // e will end before b, so if b throws after that, e wont catch the error.
    pipingFunctionNew(source, destination, options) {
        return (0, stream_1.pipeline)(source, destination, noop);
    }
}
exports.plumber = new Plumber();
//# sourceMappingURL=plumber.js.map