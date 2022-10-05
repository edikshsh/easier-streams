/// <reference types="node" />
import { Transform } from "stream";
import { TypedEventEmitter } from "../emitters/Emitter";
import { TypedTransform } from "../types/typed-transform";
declare type StreamPipeEvents<T> = {
    data: (chunk: T) => void;
    end: () => void;
    close: () => void;
    error: (error: Error) => void;
};
declare class StreamPipe<Tsource, Tdestination> extends TypedEventEmitter<StreamPipeEvents<Tdestination>> {
    private _source;
    private _pipeline;
    private _destination;
    constructor(_source: TypedTransform<Tsource, unknown>, _pipeline: Transform[], _destination: TypedTransform<unknown, Tdestination>);
    private pipePipelineEventsToSelf;
    get source(): TypedTransform<Tsource, unknown>;
    get pipeline(): Transform[];
    get destination(): TypedTransform<unknown, Tdestination>;
    private build;
    pipe<T extends StreamPipe<unknown, unknown>>(destination: T, options?: {
        end?: boolean | undefined;
    } | undefined): T;
    unpipe(destination?: StreamPipe<unknown, unknown>): this;
}
export declare function getStreamPipe<T1, T2, T3>(...transforms: TypedTransformPipe_03<T1, T2, T3>): StreamPipe<T1, T3>;
export declare function getStreamPipe<T1, T2, T3, T4>(...transforms: TypedTransformPipe_04<T1, T2, T3, T4>): StreamPipe<T1, T4>;
export declare function getStreamPipe<T1, T2, T3, T4, T5>(...transforms: TypedTransformPipe_05<T1, T2, T3, T4, T5>): StreamPipe<T1, T5>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6>(...transforms: TypedTransformPipe_06<T1, T2, T3, T4, T5, T6>): StreamPipe<T1, T6>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6, T7>(...transforms: TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7>): StreamPipe<T1, T7>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6, T7, T8>(...transforms: TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8>): StreamPipe<T1, T8>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(...transforms: TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9>): StreamPipe<T1, T9>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(...transforms: TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>): StreamPipe<T1, T10>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(...transforms: TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>): StreamPipe<T1, T11>;
export declare function getStreamPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(...transforms: TypedTransformPipe_12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>): StreamPipe<T1, T12>;
declare type TypedTransformPipe_02<T1, T2> = [TypedTransform<T1, T2>];
declare type TypedTransformPipe_03<T1, T2, T3> = [...TypedTransformPipe_02<T1, T2>, TypedTransform<T2, T3>];
declare type TypedTransformPipe_04<T1, T2, T3, T4> = [...TypedTransformPipe_03<T1, T2, T3>, TypedTransform<T3, T4>];
declare type TypedTransformPipe_05<T1, T2, T3, T4, T5> = [...TypedTransformPipe_04<T1, T2, T3, T4>, TypedTransform<T4, T5>];
declare type TypedTransformPipe_06<T1, T2, T3, T4, T5, T6> = [...TypedTransformPipe_05<T1, T2, T3, T4, T5>, TypedTransform<T5, T6>];
declare type TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7> = [...TypedTransformPipe_06<T1, T2, T3, T4, T5, T6>, TypedTransform<T6, T7>];
declare type TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8> = [...TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7>, TypedTransform<T7, T8>];
declare type TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9> = [...TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8>, TypedTransform<T8, T9>];
declare type TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = [...TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9>, TypedTransform<T9, T10>];
declare type TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11> = [...TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>, TypedTransform<T10, T11>];
declare type TypedTransformPipe_12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12> = [...TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>, TypedTransform<T11, T12>];
export {};
