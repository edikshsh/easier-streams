import { TypedTransform } from './transforms/typed-transform/typed-transform.interface';
import { PlumberOptions } from './utility/plumber-options.type';
type PipableTransformGroup<TSource, TDestination> = TypedTransform<TSource, TDestination> | TypedTransform<TSource, TDestination>[];
type TypedTransformPipe_02<T1, T2> = [PipableTransformGroup<T1, T2>];
type TypedTransformPipe_03<T1, T2, T3> = [...TypedTransformPipe_02<T1, T2>, PipableTransformGroup<T2, T3>];
type TypedTransformPipe_04<T1, T2, T3, T4> = [...TypedTransformPipe_03<T1, T2, T3>, PipableTransformGroup<T3, T4>];
type TypedTransformPipe_05<T1, T2, T3, T4, T5> = [
    ...TypedTransformPipe_04<T1, T2, T3, T4>,
    PipableTransformGroup<T4, T5>
];
type TypedTransformPipe_06<T1, T2, T3, T4, T5, T6> = [
    ...TypedTransformPipe_05<T1, T2, T3, T4, T5>,
    PipableTransformGroup<T5, T6>
];
type TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7> = [
    ...TypedTransformPipe_06<T1, T2, T3, T4, T5, T6>,
    PipableTransformGroup<T6, T7>
];
type TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8> = [
    ...TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7>,
    PipableTransformGroup<T7, T8>
];
type TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9> = [
    ...TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8>,
    PipableTransformGroup<T8, T9>
];
type TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = [
    ...TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9>,
    PipableTransformGroup<T9, T10>
];
type TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11> = [
    ...TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>,
    PipableTransformGroup<T10, T11>
];
type TypedTransformPipe_12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12> = [
    ...TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>,
    PipableTransformGroup<T11, T12>
];
export declare class Plumber {
    private muteWarnings;
    constructor(muteWarnings: boolean);
    pipe<T1, T2, T3>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_03<T1, T2, T3>): void;
    pipe<T1, T2, T3, T4>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_04<T1, T2, T3, T4>): void;
    pipe<T1, T2, T3, T4, T5>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_05<T1, T2, T3, T4, T5>): void;
    pipe<T1, T2, T3, T4, T5, T6>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_06<T1, T2, T3, T4, T5, T6>): void;
    pipe<T1, T2, T3, T4, T5, T6, T7>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_07<T1, T2, T3, T4, T5, T6, T7>): void;
    pipe<T1, T2, T3, T4, T5, T6, T7, T8>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_08<T1, T2, T3, T4, T5, T6, T7, T8>): void;
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_09<T1, T2, T3, T4, T5, T6, T7, T8, T9>): void;
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>): void;
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>): void;
    pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(options: PlumberOptions<T1>, ...transformGroups: TypedTransformPipe_12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>): void;
    pipeOneToOne<A, B, C>(srcTransform: TypedTransform<A, B>, destTransform: TypedTransform<B, C>, plumberOptions?: PlumberOptions<A>): {
        source: TypedTransform<A, B>;
        destination: TypedTransform<B, C>;
    };
    pipeOneToMany<A, B, C>(srcTransform: TypedTransform<A, B>, destTransforms: TypedTransform<B, C>[], plumberOptions?: PlumberOptions<A>): {
        source: TypedTransform<A, B>;
        destination: TypedTransform<B, C>[];
    };
    pipeManyToOne<A, B, C>(srcTransforms: TypedTransform<A, B>[], destTransform: TypedTransform<B, C>, plumberOptions?: PlumberOptions<A>): {
        source: TypedTransform<A, B>[];
        destination: TypedTransform<B, C>;
    };
    pipeManyToMany<A, B, C>(srcTransforms: TypedTransform<A, B>[], destTransforms: TypedTransform<B, C>[], plumberOptions?: PlumberOptions<A>): {
        source: TypedTransform<A, B>[];
        destination: TypedTransform<B, C>[];
    };
    private abortTransformArrayIfOneFails;
    private pipeErrors;
    private pipeData;
    private chosenPipingFunction;
    private pipingFunctionPipe;
    private pipingFunctionPipeline;
}
export declare const plumber: Plumber;
export {};
