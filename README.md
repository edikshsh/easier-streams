
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

const myEventEmitter = new TypedEventEmitter<MyEventEmitterEvents<number>>();
myEventEmitter.on('end',(someVar)=>undefined) //❌
myEventEmitter.on('end',()=>undefined)// ✅
myEventEmitter.on('data',(someVar)=>undefined)// ✅
myEventEmitter.on('muchData',(someVar)=>undefined)// ✅
myEventEmitter.on('muchData',(someVar:  number)=>undefined)// ❌
myEventEmitter.on('maybeData',(someVar)=>undefined)// ❌
myEventEmitter.emit('maybeData',12)// ❌
myEventEmitter.emit('end')// ✅
myEventEmitter.emit('end', 123)// ❌
myEventEmitter.emit('error', 123)// ❌
myEventEmitter.emit('error', new  Error())// ✅

```

### Promisify events

An easy way to create a promise from events, with type checking

```

myEventEmitter.promisifyEvents('data');// resolve on data event, dont reject
myEventEmitter.promisifyEvents('data', ['end', 'error']);// resolve on data event, reject on end or error events
myEventEmitter.promisifyEvents(['data', 'muchData'], ['end', 'error']);// resolve on data and muchData events, reject on end or error events
myEventEmitter.promisifyEvents([], ['error']);// do not resolve, reject on error event
myEventEmitter.promisifyEvents(['maybeData'], ['end']);// ❌

```

## Streams

All transforms from this package implement typed event emitter

  

### Transformer

Pass to it some default transform options, and it will create transforms using this options as default
Some of the transforms also have an async version, you can access then through the async property
-  **arrayJoin** - takes a certain amount of chunks, then emits them as an array.

-  **arraySplit** - takes an array, then emit each element.

- **passThrough** - just a typed passThrough, will pass data as is, and helps with simplifying connections between complex streams

-  **callOnData (Async)** - initialized with a synchronous function, runs this function on deepclone of every chunk.

-  **void** - consumes data passed to it without emitting anything.

-  **filter (Async)** - initialized with a takes a chunk and returns boolean, then filters chunks using said function, emitting only those who returned true.

-  **fromFunction (Async)** - initialized with a function, then creates a transform using this function.

-  **passThrough (Async)** - just a typed passThrough transform, passes chunks as is.

-  **pickElementFromArray** - take an array and emit a single element by index

- **fromIterable (Async)** - Takes an iterable and creates a typed transform from it


  Some of the transforms also have an async version, you can access then through the async property:
-  **fromFunctionConcurrent** - A special async only transform. Takes an async function and runs it concurrently on the input


You can initialize a new Transformer or use the premade: 

- **transformer** - with objectMode set to true

  

### Streams pipe **(Deprecated)**

Pipe those typed transforms in a type safe(ish) way


### Plumber
Make complex pipes easier, and handle passing errors to error streams.
Pipe transforms one -> one (like regular piping), one -> many, many -> one and many -> many.
If an error stream is passed, pipe all transforms while passing errors to the error stream, and data to the next stream.

**many -> many pipe** - pipes arrays of equal size only, each transform of the source group is piped to a transform of the destination group with the same index. Basically it creates **several  one -> one pipes**.

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

And now, a demonstration:
```

const source = transformer.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]);
const errorStream = transformer.errorTransform<number>();
const add1  =  async (n:  number) => n +  1;
const create3ElementsFrom1  = (n:  number) => [n +  1, n +  2, n +  3];
const errorOnNumber4  = (n:  number) => {
	if (n ===  4) {
		throw  Error('Number is 4');
	}
	return n;
}
const  filterOutOdds  = (n:  number) =>  !(n %  2);
const  numberToString  = (n:  number) => n.toString();

const add1Transform = (transformer.async.fromFunction(add1));
const create3ElementsFrom1Transform = transformer.fromFunction(create3ElementsFrom1);
const takeOnlyFirstElementOfArrayTransform = transformer.pickElementFromArray(0);
const errorOnNumber4Transform = transformer.fromFunction(errorOnNumber4, { errorStream });
const filterOutOddsTranform = transformer.filter(filterOutOdds);
const numberToStringTrasnform =  new  SimpleTransform(numberToString, { objectMode: true });

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

const result:  string[] = [];
const errorResults:  StreamError<number>[] = [];

numberToStringTrasnform.on('data', (data:  string) => result.push(data));
errorStream.on('data', (error) => errorResults.push(error))

await numberToStringTrasnform.promisifyEvents('end');

console.log(result);// ['6','8','10']
console.log(errorResults);// StreamError {error: Error('Number is 4'), data: 4}
console.log('done');

```