/// <reference types="node" />
import { Stream } from 'stream';
export declare function sleep(n: number): Promise<unknown>;
export declare function streamEnd(stream: Stream): Promise<unknown>;
export declare function getFailOnNumberFunction(input: number, errorText?: string): (num: number) => number;
export declare function getFailOnNumberAsyncFunction(input: number, delay?: number, errorText?: string): (num: number) => Promise<number>;
export declare function getFailOnNumberAsyncFunctionMult2(input: number, delay: number, errorText?: string): (num: number) => Promise<number>;
export declare function delayer(delay: number): (num: number) => Promise<number>;
export declare function delayerMult2(delay: number): (num: number) => Promise<number>;
export declare function failOnOddsSync(n: number): number;
export declare function failOnEvensSync(n: number): number;
export declare function failOnOddsAsync(n: number): Promise<number>;
export declare function failOnEvensAsync(n: number): Promise<boolean>;
export declare function filterOutOddsSync(n: number): boolean;
export declare function filterOutOddsAsync(delay?: number): (n: number) => Promise<boolean>;
export declare const DEFAULT_ERROR_TEXT = "asdf";
