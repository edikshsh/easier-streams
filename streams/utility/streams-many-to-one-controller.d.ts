/// <reference types="node" />
import EventEmitter from "events";
export declare function streamsManyToOneController(inputLayer: EventEmitter[], output: EventEmitter, eventCounter?: Record<"end" | "finish" | "close", number>): void;
