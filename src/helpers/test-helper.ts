import { sleep } from './helper-functions';

export function getFailOnNumberFunction(input: number, errorText = DEFAULT_ERROR_TEXT) {
    return (num: number) => {
        if (num === input) {
            throw Error(errorText);
        }
        return num;
    };
}

export function getFailOnNumberAsyncFunction(input: number, delay?: number, errorText = DEFAULT_ERROR_TEXT) {
    const syncVersion = getFailOnNumberFunction(input, errorText);
    return async (num: number) => {
        const newNum = syncVersion(num);
        if (delay) {
            await sleep(delay);
        }
        return newNum;
    };
}

export function getFailOnNumberAsyncFunctionMult2(input: number, delay: number, errorText = DEFAULT_ERROR_TEXT) {
    const regularAsyncVersion = getFailOnNumberAsyncFunction(input, delay, errorText);
    return async (num: number) => (await regularAsyncVersion(num)) * 2;
}

export function delayer(delay: number) {
    return async (num: number) => {
        await sleep(delay);
        return num;
    };
}

export function delayerMult2(delay: number) {
    return async (num: number) => {
        await sleep(delay);
        return num * 2;
    };
}

export function add(n: number) {
    return (chunk: number) => chunk + n;
}

export function addAsync(n: number) {
    return async (chunk: number) => chunk + n;
}

export function filterOutOddsSync(n: number) {
    return !(n % 2);
}

export function filterOutEvens(n: number): number | undefined {
    return n % 2 ? n : undefined;
}

export async function filterOutEvensAsync(n: number): Promise<number | undefined> {
    return n % 2 ? n : undefined;
}

export function filterOutOddsAsync(delay?: number) {
    return async (n: number) => {
        if (delay) {
            await sleep(delay);
        }
        return !(n % 2);
    };
}

export function numberToString(n: number) {
    return n.toString();
}

export async function numberToStringAsync(n: number) {
    return numberToString(n);
}

export const DEFAULT_ERROR_TEXT = 'asdf';
