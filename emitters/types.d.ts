export declare type EventFunction = (...args: any[]) => void;
export declare type GenericEventItem = [event: string, func: EventFunction];
export declare type EventItem<Str extends string, Func extends EventFunction> = [event: Str, func: Func];
export declare type EventItemEvent<EE extends GenericEventItem> = EE extends [infer R, any] ? R : any;
export declare type EventItemFunc<EE extends GenericEventItem> = EE extends [any, infer R] ? R : EventFunction;
export declare type AllEvents<Items extends GenericEventItem[]> = Items extends [infer R, any][] ? R : any;
export declare type FirstArg<Func extends (...args: any[]) => any> = Func extends (arg1: infer R, ...args: any[]) => any ? R : never;
export declare type IEvents = Record<string | symbol, EventFunction>;
