import { sleep } from '../../../helpers/helper-functions';
import { ThrottleWindow } from './throttle-window';

export async function waitForThrottlers(throttlers: ThrottleWindow[]): Promise<void> {
    const now = Date.now();
    const timeToWait = Math.max(...throttlers.map((throttler) => throttler.msToWaitForNextChunk(now)));
    await sleep(timeToWait);
    throttlers.map((throttler) => throttler.letChunkPass(now));
}
