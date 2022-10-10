# Easier streams

## Events
### Typed event emitter
define a type for your event emitter:

```
type MyEventEmitterEvents<Data> = {
data: (data: Data) => void,
muchData: (data :Data[]) => void,
end: () => void,
error: (error: Error) => void
}
```
then have it enforced on the event emitter functions:
```
const ee =  new TypedEventEmitter<MyEventEmitterEvents<number>>();
ee.on('end',(someVar)=>undefined) //❌
ee.on('end',()=>undefined)// ✅
ee.on('data',(someVar)=>undefined)// ✅
ee.on('muchData',(someVar)=>undefined)// ✅
ee.on('muchData',(someVar:  number)=>undefined)// ❌
ee.on('maybeData',12)// ❌
ee.emit('end')// ✅
ee.emit('end', 123)// ❌
ee.emit('error', 123)// ❌
ee.emit('error', new  Error())// ✅
```
### Promisify events
An easy way to create a promise from events, with type checking
```
ee.promisifyEvents(['data'], ['end']);// ✅
ee.promisifyEvents(['maybeData'], ['end']);// ❌
```
## Streams
All transforms from this package implement typed event emitter

### Utility transforms
A bunch of helpful transforms:
- **arrayJoin** - takes a certain amount of chunks, then emits them as an array.
- **arraySplit** - takes an array, then emit each element.
- **callOnDataSync** - initialized with a synchronous function, runs this function on deepclone of every chunk.
- **callOnDataAsync** - initialized with a asynchronous function, runs this function on deepclone of every chunk.
- **void** - consumes data passed to it without emitting anything.
- **filter** - initialized with a takes a chunk and returns boolean, then filters chunks using said function, emitting only those who returned true.
- **fromFunction** - initialized with a function, then creates a transform using this function.
- **fromAsyncFunction** - initialized with an async function or a function that returns a promise, then creates a transform using this function.
- **passThrough** - just a typed passThrough transform, passes chunks as is.
- **pickElementFromArray** - take an array and emit a single element by index
- **fromFunctionConcurrent** - like fromAsyncFunction but runs the received function concurrently

You can initialize a new utility transform - it takes TrasnformOptions and uses them as a default for every transform it creates.
Or use **utilityTransforms**- utility transform without defaults
Or use **objectUtilityTransforms** - utility transform with objectMode set to true

### Streams pipe
Pipe those typed transforms in a type safe(ish) way
```
const source = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]).pipe(new  TypedPassThrough<number>({ objectMode: true }));
const  add1  =  async (n:  number) => n +  1;
const  create3ElementsFrom1  = (n:  number) => [n+1, n +  2, n +  3];
const  takeOnlyFirstElementOfArray  =  async (arr:  unknown[]) => arr[0];
const  filterOutOdds  = (n:  number) =>  !(n %  2);
const  numberToString  = (n:  number) => n.toString();

const add1Transform = (objectUtility.fromAsyncFunction(add1));
const create3ElementsFrom1Transform = (new  SimpleTransform(create3ElementsFrom1, { objectMode: true }));
const takeOnlyFirstElementOfArrayTransform = (new  SimpleAsyncTransform(takeOnlyFirstElementOfArray, { objectMode: true }));
const filterOutOddsTranform = objectUtility.filter(filterOutOdds);
const numberToStringTrasnform =  new  SimpleTransform(numberToString, { objectMode: true });

const streamPipe =  getStreamPipe(
source,
add1Transform,
create3ElementsFrom1Transform,
takeOnlyFirstElementOfArrayTransform,
filterOutOddsTranform,
numberToStringTrasnform
);

const result:  number[] = [];
streamPipe.destination.on('data', (data:  number) => result.push(data));
await  streamEnd(streamPipe.destination);
console.log(result);// ['4','6','8','10']
```
