/// <reference types="node" />
import { Transform, TransformOptions } from "stream";
import { PromisifyEventReturnType } from "../emitters/Emitter";
import { EventEmitterTypes, TransformEvents, TypedTransform } from "../types/typed-transform";
export declare class BaseTransform<TSource, TDestination> extends Transform implements TypedTransform<TSource, TDestination>, EventEmitterTypes<TransformEvents<TDestination>> {
    constructor(options?: TransformOptions);
    promisifyEvents<Key extends keyof TransformEvents<TDestination>, Key2 extends keyof TransformEvents<TDestination>>(resolveEvents: Key[], rejectEvents?: Key2[]): PromisifyEventReturnType<TransformEvents<TDestination>, Key>;
    on<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    addListener<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    emit<Key extends keyof TransformEvents<TDestination>>(...args: [event: Key, ...params: Parameters<TransformEvents<TDestination>[Key]>]): boolean;
    off<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    removeListener<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
    once<Key extends keyof TransformEvents<TDestination>>(eventName: Key, listener: TransformEvents<TDestination>[Key]): this;
}
