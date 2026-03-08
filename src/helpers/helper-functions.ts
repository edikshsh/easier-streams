import { Stream } from 'stream';

export function sleep(n: number) {
    return new Promise((res) => setTimeout(res, n));
}

export function streamEnd(stream: Stream) {
    return new Promise((res, rej) => {
        stream.on('close', res);
        stream.on('error', rej);
    });
}

export function noop(...args: any[]) {
    return undefined;
}

export function range(len: number, start = 0) {
    return Array.from({ length: len }, (_, i) => start + i);
}
