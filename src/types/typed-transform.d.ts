/// <reference types="node" />
import { Transform } from "stream";
import { PromisifyEventReturnType } from "../emitters/Emitter";
import { IEvents } from "../emitters/types";
import { TypedTransformCallback } from "./typed-transform-callback";
export declare type TransformEvents<T> = {
    data: (chunk: T) => void;
    end: () => void;
    close: () => void;
    error: (error: Error) => void;
    pause: () => void;
    readable: () => void;
    resume: () => void;
};
export interface TypedTransform<TSource, TDestination> extends Transform {
    _transform(chunk: TSource, encoding: BufferEncoding, callback: TypedTransformCallback<TDestination>): void | Promise<void>;
}
export interface EventEmitterTypes<Events extends IEvents> {
    promisifyEvents<Key extends keyof Events, Key2 extends keyof Events>(resolveEvents: Key[], rejectEvents?: Key2[]): PromisifyEventReturnType<Events, Key>;
    on<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    addListener<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    emit<Key extends keyof Events>(...args: [event: Key, ...params: Parameters<Events[Key]>]): boolean;
    off<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    removeListener<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
    once<Key extends keyof Events>(eventName: Key, listener: Events[Key]): this;
}