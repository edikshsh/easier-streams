export type CustomCounterFunction<Chunk, Counter extends Record<string, number>> = (
    chunk: Chunk,
    counter: Counter,
) => void;
