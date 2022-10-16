"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeHelper = void 0;
const stream_1 = require("stream");
const concurrent_stream_output_ender_1 = require("./concurrent-stream-output-ender");
const error_stream_1 = require("./error-stream");
const utility_transforms_1 = require("./utility-transforms");
class PipeHelper {
    pipe(options, ...transformGroups) {
        const source = transformGroups.shift();
        if (!source) {
            throw Error('pipe helper cannot pipe');
        }
        let previousGroup = source;
        for (const currGroup of transformGroups) {
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
        return { source, destination: previousGroup };
    }
    pipeOneToOne(srcTransform, destTransform, options) {
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors([srcTransform], errorStream);
            srcTransform.pipe(utility_transforms_1.objectUtilityTransforms.filter(error_stream_1.filterOutStreamError(errorStream.id))).pipe(destTransform);
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
            destTransforms.forEach(destination => srcTransform.pipe(utility_transforms_1.objectUtilityTransforms.filter(error_stream_1.filterOutStreamError(errorStream.id))).pipe(destination));
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
            const filters = srcTransforms.map(transform => transform.pipe(utility_transforms_1.objectUtilityTransforms.filter(error_stream_1.filterOutStreamError(errorStream.id))));
            filters.forEach(filter => filter.pipe(destTransform));
        }
        else {
            srcTransforms.forEach(srcTransform => srcTransform.pipe(destTransform, { end: false }));
            this.abortTransformArrayIfOneFails(srcTransforms);
        }
        concurrent_stream_output_ender_1.streamsManyToOneController(srcTransforms, destTransform);
        return { source: srcTransforms, destination: destTransform };
    }
    pipeManyToMany(srcTransforms, destTransforms, options) {
        if (srcTransforms.length !== destTransforms.length) {
            throw new Error(`pipeManyToMany: can't make connection ${srcTransforms.length} to ${destTransforms.length}`);
        }
        const errorStream = options === null || options === void 0 ? void 0 : options.errorStream;
        if (errorStream) {
            this.pipeErrors(srcTransforms, errorStream);
            const filters = srcTransforms.map(transform => transform.pipe(utility_transforms_1.objectUtilityTransforms.filter(error_stream_1.filterOutStreamError(errorStream.id))));
            filters.forEach((filter, index) => filter.pipe(destTransforms[index]));
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
            source.on('error', (error) => otherSources.forEach(otherSource => otherSource.destroy()));
        });
    }
    pipeErrors(sources, errorTransform) {
        const id = errorTransform.id;
        const filters = sources.map(source => source.pipe(utility_transforms_1.objectUtilityTransforms.filter(error_stream_1.passStreamError(id))));
        if (sources.length > 1) {
            concurrent_stream_output_ender_1.streamsManyToOneController(filters, errorTransform);
        }
        filters.forEach(filter => filter.pipe(errorTransform));
    }
}
exports.pipeHelper = new PipeHelper();
//# sourceMappingURL=pipe-helper.js.map