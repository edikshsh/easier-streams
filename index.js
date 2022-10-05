"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamPipe = exports.Utility = exports.objectUtility = exports.utility = void 0;
const utility_transforms_1 = require("./classes/utility-transforms");
const stream_pipe_1 = require("./classes/stream-pipe");
// class _SimpleStreams {
//     // ArraySplitTransform = ArraySplitTransform
//     // ArrayJoinTransform = ArrayJoinTransform
//     // utility = {
//     //     Transform: UtilityTransforms,
//     //     objectTransforms: objectUtilityTransforms,
//     //     transforms: utilityTransforms
//     // }
//     // SimpleAsyncTransform = SimpleAsyncTransform
//     // SimpleTransform = SimpleTransform
//     // StreamPipe = getStreamPipe
//     utility = new UtilityTransforms({});
//     objectUtility = new UtilityTransforms({objectMode: true});
//     Utility = UtilityTransforms
//     StreamPipe = getStreamPipe
// }
// export const SimpleStreams = new _SimpleStreams();
exports.utility = new utility_transforms_1.UtilityTransforms();
exports.objectUtility = new utility_transforms_1.UtilityTransforms({ objectMode: true });
exports.Utility = utility_transforms_1.UtilityTransforms;
exports.StreamPipe = stream_pipe_1.getStreamPipe;
// function SimpleStreams() {
//     return new _SimpleStreams();
// }
// SimpleStreams.SimpleStreams = SimpleStreams;
// SimpleStreams.default = SimpleStreams;
// module.exports = SimpleStreams;
//# sourceMappingURL=index.js.map