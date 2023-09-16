import { MAX_TIME_FRAMES } from '../max-time-frames';
import { GroupTimeFrame } from './group-time-frame';
import { splitSumArray } from './split-sum-array';

export class Throttler {
    readonly groupTimeFrames: GroupTimeFrame[];
    constructor(private timeFrameMs: number, messagesInTimeFrame: number) {
        const timeFramesToCreate = Math.min(messagesInTimeFrame, MAX_TIME_FRAMES);
        const timeFramesCapacity = splitSumArray(messagesInTimeFrame, timeFramesToCreate);
        this.groupTimeFrames = timeFramesCapacity.map((timeFrameCapacity) => new GroupTimeFrame(timeFrameCapacity));
    }

    shouldThrottle(chunkTimestamp: number): boolean {
        return !!this.msToWaitForNextChunk(chunkTimestamp);
    }

    msToWaitForNextChunk(chunkTimestamp: number): number {
        return Math.max(this.groupTimeFrames[0].activeTimestamp - chunkTimestamp, 0);
    }

    letChunkPass(chunkTimestamp: number): void {
        const currGroupTimeFrame = this.groupTimeFrames[0];
        currGroupTimeFrame.decItem();
        if (currGroupTimeFrame.shouldRefresh()) {
            currGroupTimeFrame.refresh(chunkTimestamp + this.timeFrameMs);
            this.groupTimeFrames.push(this.groupTimeFrames.shift()!);
        }
    }
}
