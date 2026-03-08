import { EventEmitter } from 'stream';

class EventPromisifier {
    async _promisifyEvents(
        emitter: EventEmitter,
        resolveEvents: string[] | string = [],
        rejectEvents: string[] | string = [],
    ): Promise<unknown> {
        const resolveEventsArr = (typeof resolveEvents === 'string' ? [resolveEvents] : resolveEvents).filter(Boolean);
        const rejectEventsArr = (typeof rejectEvents === 'string' ? [rejectEvents] : rejectEvents).filter(Boolean);
        if (!(resolveEventsArr.length || rejectEventsArr.length)) {
            return undefined;
        }

        return new Promise<unknown>((resolve, reject) => {
            const allEvents = [...resolveEventsArr, ...rejectEventsArr];
            const functionsToTurnOff: { func: (...args: unknown[]) => unknown; event: string }[] = [];
            const wrapper = (eventString: string) => {
                const eventListenerFunction = (data: unknown) => {
                    functionsToTurnOff.forEach((item) => emitter.off(item.event, item.func));
                    if (resolveEventsArr.includes(eventString)) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                };
                functionsToTurnOff.push({ event: eventString, func: eventListenerFunction });
                return eventListenerFunction;
            };

            allEvents.forEach((event) => emitter.on(event, wrapper(event)));
        });
    }
}

export const eventPromisifier = new EventPromisifier();
