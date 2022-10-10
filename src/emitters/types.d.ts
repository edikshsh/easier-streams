export declare type EventFunction = (arg: any) => void;
export declare type GenericEventItem = [event: string, func: EventFunction];
export declare type EventItem<Str extends string, Func extends EventFunction> = [event: Str, func: Func];
export declare type EventItemEvent<EE extends GenericEventItem> = EE extends [infer R, unknown] ? R : unknown;
export declare type EventItemFunc<EE extends GenericEventItem> = EE extends [unknown, infer R] ? R : EventFunction;
export declare type AllEvents<Items extends GenericEventItem[]> = Items extends [infer R, unknown][] ? R : unknown;
export declare type FirstArg<Func extends (...args: unknown[]) => unknown> = Func extends (arg1: infer R, ...args: unknown[]) => unknown ? R : never;
export declare type IEvents = Record<string | symbol, EventFunction>;
