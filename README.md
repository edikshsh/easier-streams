
# Easier streams

  

## Events

### Typed event emitter

Define a type for your event emitter:

  

```

type MyEventEmitterEvents<Data> = {
data: (data: Data) => void,
muchData: (data :Data[]) => void,
end: () => void,
error: (error: Error) => void
}

```

Then have it enforced on the event emitter functions:

```
const emitter = new TypedEventEmitter<MyEventEmitterEvents<number>>();
emitter.on('end',(someVar)=>undefined) //❌
emitter.on('end',()=>undefined)// ✅
emitter.on('data',(someVar)=>undefined)// ✅
emitter.on('muchData',(someVar)=>undefined)// ✅
emitter.on('muchData',(someVar: number)=>undefined)// ❌
emitter.on('maybeData',12)// ❌
emitter.emit('end')// ✅
emitter.emit('end', 123)// ❌
emitter.emit('error', 123)// ❌
emitter.emit('error', new Error())// ✅
```

### Promisify events

An easy way to create a promise from events, with type checking
Accepts:
	- event or events to resolve
	- event or events to reject
```
ee.promisifyEvents(['data'], ['error']);// ✅
ee.promisifyEvents('data', ['error']);// ✅
ee.promisifyEvents(['data', 'muchData'], 'error');// ✅
ee.promisifyEvents('data', ['error', 'end']);// ✅
ee.promisifyEvents('error', 'data');// Doesn't make sense but ✅

ee.promisifyEvents(['unknownEvent'], ['end']);// ❌
ee.promisifyEvents('data', 'unknownEvent');// ❌

```

## Streams

All transforms from this package implement typed event emitter
```
myTransform.promisifyEvents('close', 'error');// ✅
```
### Transformer
Makes it easy to create a bunch of useful transforms

-  **arrayJoin** - takes a certain amount of chunks, then emits them as an array.

-  **arraySplit** - takes an array, then emit each element.

-  **callOnData** - initialized with a synchronous function, runs this function on deepclone of every chunk.

-  **void** - consumes data passed to it without emitting anything.

-  **filter** - initialized with a takes a chunk and returns boolean, then filters chunks using said function, emitting only those who returned true.

-  **typeFilter** - just like filter but sets the output type. Useful if used together with plumber

- **fork** - pass it a filter function, get 2 transforms, one that keeps the truthy values, one that keeps the others

-  **fromFunction** - initialized with a function, then creates a transform using this function.

-  **pickElementFromArray** - takes a single index from an array typed chunk.

-  **passThrough** - just a typed passThrough transform, passes chunks as is.

-  **fromIterable** - Similar to Readable.from but created transform is typed

### Transformer Async
Want to use async functions?
NO PROBLEM!!!
Access the async counterparts via transformer.async.
Supported async functions: **callOnData, filter, fork, fromFunction, fromIterable**

Async only functions: **fromFunctionConcurrent, fromFunctionConcurrent2**
fromFunctionConcurrent2 is currently recommended
  
### Transformer Options

- **shouldPushErrorsForward** - On error, should it be pushed to the next streams or not. Works together with plumber and errorStream

- **chunkFormatter** - On error, format the chunk before attaching to the error object. 

- **ignoreErrors** - Should errors be entirely ignored or not

### Streams pipe (depracated)

Pipe those typed transforms in a type safe(ish) way



### Plumber

Make complex pipes easier, and handle passing errors to error streams.
Pipe transforms
one -> one (like regular piping),
one -> many,
many -> one,
many -> many.
If an error stream is passed, pipe all transforms while passing errors to the error stream, and data to the next stream.

  
**many -> many pipe** - pipes arrays of equal size only, each transform of the source group is piped to a transform of the destination group with the same index. Basically it creates **several one -> one pipes**.

**Warning** - the piping is complex, and in most cases simply calling unpipe will have undesired effects.

**Unpiping is currently not supported**.

If the stream should be unpiped in any point, try piping the source of the pipe connection to a passThrough without passing an error stream, then pipe that passThrough to the destination.
```

const source = transformer.fromIterable([1,2,3,4,5,6]);
const passThroughForUnpiping = transformer.passThrough<number>();
source.pipe(passThroughForUnpiping);

const manyPassThroughs = [1,2,3].map(() => transformer.passThrough<number>());
const destination = transformer.passThrough<number>();

plumber.pipe({}, passThroughForUnpiping, manyPassThroughs, destination); 

//sometime later
source.unpipe(passThroughForUnpiping);

```

### Plumber Options

- **errorStream** - the error streams to which push all the errors from all piped transforms. **Note that the transforms have to be created via transformer with shouldPushErrorsForward = true**
- **usePipeline** - switches the piping method from .pipe() to pipeline(). **pipeline is not supported in all piping scenarios, a warning will be printed to console when defaulting to .pipe()**

**Note** - when using plumber, the default piping method is a modified .pipe(). When an uncaught error occurs, it will close all the following transforms that were piped with plumber. 
This differs from the regular .pipe() - it will only close and emit error on the throwing stream
The throwing transform (if created through easier-streams) will emit a SOURCE_ERROR event, indicating that the error originated from that transform



  

And now, a demonstration:

```

const source = transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
const errorStream = transformer.errorTransform<number>();
const add1 = async (n: number) => n + 1;
const create3ElementsFrom1 = (n: number) => [n + 1, n + 2, n + 3];
const errorOnNumber4 = (n: number) => {
	if (n === 4) {
		throw Error('Number is 4');
	}
	return n;
}

const filterOutOdds = (n: number) => !(n % 2);
const numberToString = (n: number) => n.toString();

const add1Transform = transformer.async.fromFunction(add1);
const create3ElementsFrom1Transform = transformer.fromFunction(create3ElementsFrom1);
const takeOnlyFirstElementOfArrayTransform = transformer.pickElementFromArray(0);
const errorOnNumber4Transform = transformer.fromFunction(errorOnNumber4, { errorStream });
const filterOutOddsTranform = transformer.filter(filterOutOdds);
const numberToStringTrasnform = new SimpleTransform(numberToString, { objectMode: true });

plumber.pipe(
	{errorStream},
	source,
	add1Transform,
	create3ElementsFrom1Transform,
	takeOnlyFirstElementOfArrayTransform,
	errorOnNumber4Transform,
	filterOutOddsTranform,
	numberToStringTrasnform
);

const result: string[] = [];
const errorResults: StreamError<number>[] = [];

numberToStringTrasnform.on('data', (data: string) => result.push(data));
errorStream.on('data', (error) => errorResults.push(error))

await numberToStringTrasnform.promisifyEvents('end');

console.log(result);// ['6','8','10']
console.log(errorResults);// StreamError {error: Error('Number is 4'), data: 4}
console.log('done');

```