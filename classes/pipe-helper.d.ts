import { TypedTransform } from "../types/typed-transform";
import { ErrorTransform } from "./error-stream";
import { ErrorTransformOptions } from "../types/error-transform-options.type";
declare type PipableTransformGroup<TSource, TDestination> = TypedTransform<TSource, TDestination> | TypedTransform<TSource, TDestination>[];
declare type TypedTransformPipe_02<T1, T2> = [PipableTransformGroup<T1, T2>];
declare type TypedTransformPipe_03<T1, T2, T3> = [...TypedTransformPipe_02<T1, T2>, PipableTransformGroup<T2, T3>];
declare type TypedTransformPipe_04<T1, T2, T3, T4> = [...TypedTransformPipe_03<T1, T2, T3>, PipableTransformGroup<T3, T4>];
declare type TypedTransformPipe_05<T1, T2, T3, T4, T5> = [...TypedTransformPipe_04<T1, T2, T3, T4>, PipableTransformGroup<T4, T5>];
declare type TypedTransformPipe_06<T1, T2, T3, T4, T5, T6> = [...TypedTransformPipe_05<T1, T2, T3, T4, T5>, PipableTransformGroup<T5, T6>];
declare type TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7> = [...TypedTransformPipe_06<T1, T2, T3, T4, T5, T6>, PipableTransformGroup<T6, T7>];
declare type TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8> = [...TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7>, PipableTransformGroup<T7, T8>];
declare type TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9> = [...TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8>, PipableTransformGroup<T8, T9>];
declare type TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = [...TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9>, PipableTransformGroup<T9, T10>];
declare type TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11> = [...TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>, PipableTransformGroup<T10, T11>];
declare type TypedTransformPipe_12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12> = [...TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>, PipableTransformGroup<T11, T12>];
declare class PipeHelper {
    pipe<T1, T2, T3>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_03<T1, T2, T3>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T2, T3>;
    };
    pipe<T1, T2, T3, T4>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_04<T1, T2, T3, T4>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T3, T4>;
    };
    pipe<T1, T2, T3, T4, T5>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_05<T1, T2, T3, T4, T5>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T4, T5>;
    };
    pipe<T1, T2, T3, T4, T5, T6>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_06<T1, T2, T3, T4, T5, T6>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T5, T6>;
    };
    pipe<T1, T2, T3, T4, T5, T6, T7>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T6, T7>;
    };
    pipe<T1, T2, T3, T4, T5, T6, T7, T8>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T7, T8>;
    };
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T8, T9>;
    };
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T9, T10>;
    };
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T10, T11>;
    };
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(options: ErrorTransformOptions<T1>, ...transformGroups: TypedTransformPipe_12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>): {
        source: PipableTransformGroup<T1, T2>;
        destination: PipableTransformGroup<T11, T12>;
    };
    pipeOneToOne<A, B, C>(srcTransform: TypedTransform<A, B>, destTransform: TypedTransform<B, C>, options?: ErrorTransformOptions<A>): {
        source: TypedTransform<A, B>;
        destination: TypedTransform<B, C>;
    };
    pipeOneToMany<A, B, C>(srcTransform: TypedTransform<A, B>, destTransforms: TypedTransform<B, C>[], options?: ErrorTransformOptions<A>): {
        source: TypedTransform<A, B>;
        destination: TypedTransform<B, C>[];
    };
    pipeManyToOne<A, B, C>(srcTransforms: TypedTransform<A, B>[], destTransform: TypedTransform<B, C>, options?: ErrorTransformOptions<A>): {
        source: TypedTransform<A, B>[];
        destination: TypedTransform<B, C>;
    };
    pipeManyToMany<A, B, C>(srcTransforms: TypedTransform<A, B>[], destTransforms: TypedTransform<B, C>[], options?: ErrorTransformOptions<A>): {
        source: TypedTransform<A, B>[];
        destination: TypedTransform<B, C>[];
    };
    private abortTransformArrayIfOneFails;
    pipeErrors<TSource, TDestination>(sources: TypedTransform<TSource, TDestination>[], errorTransform: ErrorTransform<TSource>): void;
}
export declare const pipeHelper: PipeHelper;
export {};
