# easier-streams

A TypeScript library that makes working with Node.js streams easier. Provides typed transforms, async support, and a typed event emitter with promise helpers.

## Installation

```bash
npm install easier-streams
```

## Events

### TypedEventEmitter

A typed wrapper around Node.js `EventEmitter` that enforces correct event names and handler signatures at compile time.

```typescript
import { TypedEventEmitter } from 'easier-streams';

type MyEvents = {
    data: (data: number) => void;
    end: () => void;
    error: (error: Error) => void;
};

const emitter = new TypedEventEmitter<MyEvents>();

emitter.on('end', () => undefined);          // ✅
emitter.on('data', (n) => undefined);        // ✅
emitter.on('end', (someVar) => undefined);   // ❌ too many args
emitter.on('unknownEvent', () => undefined); // ❌ unknown event

emitter.emit('end');                         // ✅
emitter.emit('error', new Error());          // ✅
emitter.emit('error', 123);                  // ❌ wrong type
emitter.emit('end', 123);                    // ❌ too many args
```

### promisifyEvents

Create a promise from events on any `TypedEventEmitter`. Accepts an event (or array of events) to resolve on, and optionally events to reject on.

```typescript
await emitter.promisifyEvents('end', 'error');
await emitter.promisifyEvents(['data', 'end'], 'error');
await emitter.promisifyEvents('data', ['error', 'end']);
```

All transforms created by this library also support `promisifyEvents`:

```typescript
const myTransform = transformer.passThrough<number>();
await myTransform.promisifyEvents('close', 'error');
```

---

## Streams

### transformer

The main entry point. A pre-configured `Transformer` instance with `objectMode: true`.

```typescript
import { transformer } from 'easier-streams';
```

All factory methods accept an optional `TransformOptions` object to override defaults.

---

### Sync transforms

#### `transformer.fromFunction`

Transforms each chunk using a synchronous function.

```typescript
const add1 = transformer.fromFunction((n: number) => n + 1);

Readable.from([1, 2, 3]).pipe(add1);
for await (const elem of add1) {
    console.log(elem); // 2, 3, 4
}
```

#### `transformer.filter`

Passes chunks through only if the filter function returns `true`.

```typescript
const odds = transformer.filter((n: number) => n % 2 === 1);

Readable.from([1, 2, 3]).pipe(odds);
for await (const elem of odds) {
    console.log(elem); // 1, 3
}
```

#### `transformer.typeFilter`

Like `filter`, but accepts a type guard and narrows the output type.

```typescript
const isString = (x: unknown): x is string => typeof x === 'string';
const stringsOnly = transformer.typeFilter(isString);

Readable.from(['a', 1, 'b', 2]).pipe(stringsOnly);
for await (const elem of stringsOnly) {
    console.log(elem); // 'a', 'b'
}
```

#### `transformer.fork`

Splits a stream into two based on a filter. Returns `{ filterTrueTransform, filterFalseTransform }`. Pipe the source into both outputs.

```typescript
const fork = transformer.fork((n: number) => n % 2 === 1);

Readable.from([1, 2, 3]).pipe(fork.filterTrueTransform);
Readable.from([1, 2, 3]).pipe(fork.filterFalseTransform);

fork.filterTrueTransform.on('data', (n) => console.log('odd:', n));  // 1, 3
fork.filterFalseTransform.on('data', (n) => console.log('even:', n)); // 2
```

#### `transformer.callOnData`

Runs a side-effect function on each chunk (on a deep clone) without modifying the stream output.

```typescript
const logger = transformer.callOnData((n: number) => console.log('seeing:', n));

Readable.from([1, 2, 3]).pipe(logger);
for await (const elem of logger) {
    console.log(elem); // 1, 2, 3 (unchanged)
}
```

#### `transformer.arrayJoin`

Collects chunks into arrays of a given length.

```typescript
const joiner = transformer.arrayJoin<number>(2);

Readable.from([1, 2, 3, 4, 5]).pipe(joiner);
for await (const elem of joiner) {
    console.log(elem); // [1, 2], [3, 4], [5]
}
```

#### `transformer.arraySplit`

Splits array chunks into individual elements.

```typescript
const splitter = transformer.arraySplit<number>();

Readable.from([[1, 2], [3, 4]]).pipe(splitter);
for await (const elem of splitter) {
    console.log(elem); // 1, 2, 3, 4
}
```

#### `transformer.pickElementFromArray`

Picks a single element by index from array chunks.

```typescript
const pickFirst = transformer.pickElementFromArray<number>(0);

Readable.from([[1, 2, 3], [4, 5, 6], [7]]).pipe(pickFirst);
for await (const elem of pickFirst) {
    console.log(elem); // 1, 4, 7
}
```

#### `transformer.counter`

Counts passing chunks. Accepts an optional filter to count only matching chunks.

```typescript
const { transform, getCounter } = transformer.counter((n: number) => n % 2 === 0);

Readable.from([1, 2, 3, 4]).pipe(transform);
for await (const _ of transform) {}
console.log(getCounter()); // 2
```

#### `transformer.passThrough`

A typed pass-through that forwards chunks unchanged.

```typescript
const pt = transformer.passThrough<number>();
```

#### `transformer.void`

Consumes all incoming chunks and emits nothing.

```typescript
const sink = transformer.void<number>();
```

#### `transformer.fromIterable`

Creates a readable transform from a synchronous iterable (like `Readable.from`, but typed).

```typescript
const source = transformer.fromIterable([1, 2, 3]);
for await (const elem of source) {
    console.log(elem); // 1, 2, 3
}
```

---

### Async transforms

Access async variants via `transformer.async`. These accept `async` functions.

#### `transformer.async.fromFunction`

```typescript
const double = transformer.async.fromFunction(async (n: number) => n * 2);
```

#### `transformer.async.fromFunctionConcurrent`

Runs the async transform function with a configurable concurrency limit.

```typescript
const concurrent = transformer.async.fromFunctionConcurrent(
    async (n: number) => fetchSomething(n),
    5, // max 5 concurrent
);
```

#### `transformer.async.filter`

```typescript
const filtered = transformer.async.filter(async (n: number) => isValid(n));
```

#### `transformer.async.fork`

```typescript
const fork = transformer.async.fork(async (n: number) => n % 2 === 1);
```

#### `transformer.async.callOnData`

```typescript
const logger = transformer.async.callOnData(async (n: number) => {
    await logToDb(n);
});
```

#### `transformer.async.counter`

```typescript
const { transform, getCounter } = transformer.async.counter(async (n: number) => isEven(n));
```

#### `transformer.async.fromIterable`

```typescript
const source = transformer.async.fromIterable(asyncGenerator());
```

---

### Base classes

For full control, extend or instantiate the base classes directly:

#### `SimpleTransform`

Wraps a synchronous transform function.

```typescript
import { SimpleTransform } from 'easier-streams';

const numberToString = new SimpleTransform((n: number) => n.toString(), { objectMode: true });
```

#### `SimpleAsyncTransform`

Wraps an async transform function.

```typescript
import { SimpleAsyncTransform } from 'easier-streams';

const asyncDouble = new SimpleAsyncTransform(async (n: number) => n * 2, { objectMode: true });
```

#### `BaseTransform`

Base class for custom transforms. Extends Node.js `Transform` and adds:
- `promisifyEvents(resolveEvents, rejectEvents)` — waits for stream events as a promise
- `pipeOne(transform)` — pipes using `stream.pipeline` and returns the destination
- `pipeBroadcast(transforms)` — broadcasts to multiple destinations (each receives every chunk)

```typescript
import { BaseTransform } from 'easier-streams';

class MyTransform extends BaseTransform<number, string> {
    _transform(chunk: number, _enc: BufferEncoding, callback: Function) {
        callback(null, String(chunk));
    }
}
```

---

### Chaining example

```typescript
import { Readable } from 'stream';
import { transformer, SimpleTransform } from 'easier-streams';

const source = transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);

const add1 = transformer.async.fromFunction(async (n: number) => n + 1);
const expand = transformer.fromFunction((n: number) => [n, n + 1, n + 2]);
const pickFirst = transformer.pickElementFromArray<number>(0);
const filterEvens = transformer.filter((n: number) => n % 2 === 0);
const toString = new SimpleTransform((n: number) => n.toString(), { objectMode: true });

source
    .pipeOne(add1)
    .pipeOne(expand)
    .pipeOne(pickFirst)
    .pipeOne(filterEvens)
    .pipeOne(toString);

const result: string[] = [];
toString.on('data', (s: string) => result.push(s));
await toString.promisifyEvents('end', 'error');

console.log(result); // ['2', '4', '6', '8', '10']
```
