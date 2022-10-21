/// <reference types="node" />
import { Transform, TransformOptions } from "stream";
import { PromisifyEventReturnType } from "../../../emitters/Emitter";
import { EventEmitterTypes } from "../../../emitters/event-emitter-types.interface";
import { TransformEvents } from "../typed-transform/transform-events.type";
import { TypedTransform } from "../typed-transform/typed-transform.interface";
export declare class BaseTransform<TSource, TDestination> extends Transform implements TypedTransform<TSource, TDestination>, EventEmitterTypes<TransformEvents<TDestination>> {
    constructor(options?: TransformOptions);
    private isSingleKey;
    private keysToStringArray;
    promisifyEvents<Key extends keyof TransformEvents<TDestination>, Key2 extends keyof TransformEvents<TDestination>>(resolveEvents: Key | Key[], rejectEvents?: Key2 | Key2[]): PromisifyEventReturnType<TransformEvents<TDestination>, Key>;
    on<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    addListener<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    emit<Key extends keyof TransformEvents<TDestination>>(...args: [event: Key, ...params: Parameters<TransformEvents<TDestination>[Key]>]): boolean;
    off<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    removeListener<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    once<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
}
