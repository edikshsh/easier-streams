export type CustomCounterErrorFunction<Chunk, Counter extends Record<string, number>> = (
    chunk: Chunk,
    error: unknown,
    counter: Counter,
) => void;
