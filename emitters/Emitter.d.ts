/// <reference types="node" />
import { EventEmitter } from "stream";
import { IPromisifiableEvents } from "./promisifiableEvents";
import { IEvents } from "./types";
export declare type TupleToUnion<T extends unknown[]> = T[number];
export declare type PromisifyEventReturnType<Events extends IEvents, Key extends keyof Events> = TupleToUnion<Parameters<Events[Key]>> extends never ? Promise<void> : Promise<TupleToUnion<Parameters<Events[Key]>>>;
export declare class TypedEventEmitter<Events extends IEvents> extends EventEmitter implements IPromisifiableEvents {
    private isSingleKey;
    private keysToStringArray;
    promisifyEvents<Key extends keyof Events, Key2 extends keyof Events>(resolveEvents: Key | Key[], rejectEvents?: Key2 | Key2[]): PromisifyEventReturnType<Events, Key>;
    on<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    addListener<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    emit<Key extends keyof Events>(...args: [event: Key, ...params: Parameters<Events[Key]>]): boolean;
    off<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    removeListener<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    once<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
}
