"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plumber = exports.Plumber = void 0;
const stream_1 = require("stream");
const promises_1 = require("stream/promises");
const streams_many_to_one_controller_1 = require("./utility/streams-many-to-one-controller");
const filter_out_stream_error_1 = require("./errors/filter-out-stream-error");
const transformer_1 = require("./transformer");
function noop(...args) {
    return undefined;
}
class Plumber {
    constructor(muteWarnings) {
        this.muteWarnings = muteWarnings;
    }
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
    pipeOneToOne(srcTransform, destTransform, plumberOptions) {
        const errorStream = plumberOptions === null || plumberOptions === void 0 ? void 0 : plumberOptions.errorStream;
        if (errorStream) {
            this.pipeErrors([srcTransform], errorStream, plumberOptions);
            this.pipeData([srcTransform], destTransform, plumberOptions);
        }
        else {
            this.chosenPipingFunction(srcTransform, destTransform, plumberOptions, { chainErrors: true });
        }
        return { source: srcTransform, destination: destTransform };
    }
    pipeOneToMany(srcTransform, destTransforms, plumberOptions) {
        const errorStream = plumberOptions === null || plumberOptions === void 0 ? void 0 : plumberOptions.errorStream;
        if (errorStream) {
            this.pipeErrors([srcTransform], errorStream, plumberOptions);
            destTransforms.forEach((destination) => this.pipeData([srcTransform], destination, plumberOptions));
        }
        else {
            destTransforms.forEach((destination) => this.chosenPipingFunction(srcTransform, destination, plumberOptions, { chainErrors: true }));
        }
        return { source: srcTransform, destination: destTransforms };
    }
    pipeManyToOne(srcTransforms, destTransform, plumberOptions) {
        const errorStream = plumberOptions === null || plumberOptions === void 0 ? void 0 : plumberOptions.errorStream;
        const eventCounter = (0, streams_many_to_one_controller_1.getDefaultEventCounter)();
        if (errorStream) {
            this.pipeErrors(srcTransforms, errorStream, plumberOptions);
            this.pipeData(srcTransforms, destTransform, plumberOptions);
        }
        else {
            srcTransforms.forEach((srcTransform) => this.chosenPipingFunction(srcTransform, destTransform, plumberOptions, { end: false }));
            this.abortTransformArrayIfOneFails(srcTransforms);
            eventCounter.error = srcTransforms.length - 1;
        }
        (0, streams_many_to_one_controller_1.streamsManyToOneController)(srcTransforms, destTransform, eventCounter);
        return { source: srcTransforms, destination: destTransform };
    }
    pipeManyToMany(srcTransforms, destTransforms, plumberOptions) {
        if (srcTransforms.length !== destTransforms.length) {
            throw new Error(`pipeManyToMany: can't make connection ${srcTransforms.length} to ${destTransforms.length}`);
        }
        const errorStream = plumberOptions === null || plumberOptions === void 0 ? void 0 : plumberOptions.errorStream;
        if (errorStream) {
            this.pipeErrors(srcTransforms, errorStream, plumberOptions);
            srcTransforms.forEach((sourceTransform, index) => this.pipeData([sourceTransform], destTransforms[index], plumberOptions));
        }
        else {
            srcTransforms.forEach((srcTransform, index) => this.chosenPipingFunction(srcTransform, destTransforms[index], plumberOptions, { chainErrors: true }));
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
            source.on('error', (error) => otherSources.forEach((otherSource) => otherSource.destroy(error)));
        });
    }
    pipeErrors(sources, errorTransform, plumberOptions) {
        if (sources.length > 1) {
            (0, streams_many_to_one_controller_1.streamsManyToOneController)(sources, errorTransform);
        }
        sources.forEach((source) => this.chosenPipingFunction(source, errorTransform, plumberOptions, { end: false }));
        errorTransform.pipeErrorSource(sources);
    }
    pipeData(sources, destination, plumberOptions) {
        sources.forEach((source) => {
            const errorFilter = transformer_1.transformer.filter((0, filter_out_stream_error_1.filterOutStreamError)()); //TODO: fix type
            this.chosenPipingFunction(source, errorFilter, plumberOptions, { chainErrors: true });
            this.chosenPipingFunction(errorFilter, destination, plumberOptions, { chainErrors: true });
        });
    }
    chosenPipingFunction(source, destination, plumberOptions, options) {
        if (plumberOptions === null || plumberOptions === void 0 ? void 0 : plumberOptions.usePipeline) {
            return this.pipingFunctionPipeline(source, destination, options);
        }
        return this.pipingFunctionPipe(source, destination, options);
    }
    pipingFunctionPipe(source, destination, options) {
        source.pipe(destination, options);
        if (options === null || options === void 0 ? void 0 : options.chainErrors) {
            source.on('error', (error) => destination.destroy(error));
        }
        return destination;
    }
    // TODO: find an alternative to the missing "end" parameter
    // because new piping method lacks the "end" option, stream might end prematurely when connected to more than 1 stream.
    // Example: a => async b => c, where all of them are connected to an error stream e.
    // a ends, thus ending b and e.
    // e will end before b, so if b throws after that, e wont catch the error.
    pipingFunctionPipeline(source, destination, options) {
        if ((options === null || options === void 0 ? void 0 : options.end) === false) {
            if (!this.muteWarnings) {
                console.warn("pipeline doesn't support {end: false} option, using pipe instead");
            }
            return this.pipingFunctionPipe(source, destination, options);
        }
        (0, promises_1.pipeline)(source, destination).catch(noop);
        return destination;
    }
}
exports.Plumber = Plumber;
exports.plumber = new Plumber(false);
//# sourceMappingURL=plumber.js.map