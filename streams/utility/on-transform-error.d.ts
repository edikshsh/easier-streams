/// <reference types="node" />
import { Stream } from 'stream';
import { FullTransformOptions } from '../transforms/types/full-transform-options.type';
import { TypedTransformCallback } from '../transforms/types/typed-transform-callback';
export declare function onTransformError<TSource, TDestination>(stream: Stream, error: unknown, chunk: TSource, callback: TypedTransformCallback<TDestination>, options?: FullTransformOptions<TSource>): void;
