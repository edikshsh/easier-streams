import { counterAsyncWrapper, counterSyncWrapper } from './addons/counter/counter-wrapper';
import { customCounterAsyncWrapper, customCounterSyncWrapper } from './addons/custom-counter/custom-counter-wrapper';
import { throttleWrapper } from './addons/throttle/throttle-wrapper';

class Addon {
    readonly async = new AsyncAddon();
    counter = counterSyncWrapper;
    customCounter = customCounterSyncWrapper;
}

class AsyncAddon {
    counter = counterAsyncWrapper;
    customCounter = customCounterAsyncWrapper;
    throttler = throttleWrapper;
}

export const addon = new Addon();
