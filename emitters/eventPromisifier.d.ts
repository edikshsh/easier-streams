/// <reference types="node" />
import { EventEmitter } from 'stream';
declare class EventPromisifier {
    _promisifyEvents(emitter: EventEmitter, resolveEvents?: string[] | string, rejectEvents?: string[] | string): Promise<unknown>;
}
export declare const eventPromisifier: EventPromisifier;
export {};
