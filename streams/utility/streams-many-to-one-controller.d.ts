/// <reference types="node" />
import EventEmitter from 'events';
import { StreamGroupControllerEventCounter } from './stream-group-output-controller-event-counter.type';
export declare function streamsManyToOneController(inputLayer: EventEmitter[], output: EventEmitter, eventCounter?: Partial<StreamGroupControllerEventCounter>): void;
export declare function getDefaultEventCounter(): Partial<StreamGroupControllerEventCounter>;
