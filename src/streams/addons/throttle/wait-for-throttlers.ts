import { sleep } from '../../../helpers/helper-functions';
import { Throttler } from './throttler';

export async function waitForThrottlers(throttlers: Throttler[]): Promise<void> {
    const now = Date.now();
    const timeToWait = Math.max(...throttlers.map((throttler) => throttler.msToWaitForNextChunk(now)));
    await sleep(timeToWait);
    throttlers.map((throttler) => throttler.letChunkPass(now));
}
