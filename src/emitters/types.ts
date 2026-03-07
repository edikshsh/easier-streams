export type EventFunction = (arg: any) => void;

export type IEvents = Record<string | symbol, EventFunction>;
