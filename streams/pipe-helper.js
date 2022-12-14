"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeHelper = void 0;
const stream_1 = require("stream");
const streams_many_to_one_controller_1 = require("./utility/streams-many-to-one-controller");
const transforms_helper_1 = require("./transforms-helper");
const filter_out_stream_error_1 = require("./errors/filter-out-stream-error");
class PipeHelper {
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
            srcTransform.pipe(destTransform);
        }
        return { source: srcTransform, destination: destTransform };
    }
    pipeOneToMany(srcTransform, destTransforms, options) {
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors([srcTransform], errorStream);
            destTransforms.forEach(destination => this.pipeData([srcTransform], destination));
        }
        else {
            destTransforms.forEach((destination) => srcTransform.pipe(destination));
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
            srcTransforms.forEach(srcTransform => srcTransform.pipe(destTransform, { end: false }));
            this.abortTransformArrayIfOneFails(srcTransforms);
        }
        streams_many_to_one_controller_1.streamsManyToOneController(srcTransforms, destTransform);
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
            srcTransforms.forEach((srcTransform, index) => srcTransform.pipe(destTransforms[index]));
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
            source.on('error', () => otherSources.forEach(otherSource => otherSource.destroy()));
        });
    }
    pipeErrors(sources, errorTransform) {
        if (sources.length > 1) {
            streams_many_to_one_controller_1.streamsManyToOneController(sources, errorTransform);
        }
        sources.forEach(source => source.pipe(errorTransform, { end: false }));
        errorTransform.pipeErrorSource(sources);
    }
    pipeData(sources, destination) {
        sources.forEach(source => source.pipe(transforms_helper_1.objectTransformsHelper.filter(filter_out_stream_error_1.filterOutStreamError())).pipe(destination));
    }
}
exports.pipeHelper = new PipeHelper();
//# sourceMappingURL=pipe-helper.js.map