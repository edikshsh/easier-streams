export declare type TypedTransformFunction<TSource, TDestination> = (item: TSource) => (TDestination | Promise<TDestination> | undefined);
