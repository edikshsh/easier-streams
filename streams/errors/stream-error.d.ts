export declare class StreamError<T> {
    error: Error;
    data: T;
    constructor(error: Error, data: T);
}
