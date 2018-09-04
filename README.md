# catchment

[![npm version](https://badge.fury.io/js/catchment.svg)](https://npmjs.org/package/catchment)

A Node.js package to collect stream data into a catchment and return it either as a buffer or a string.

```
yarn add -E catchment
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [API](#api)
- [`Catchment` Class](#catchment-class)
  * [`constructor(options?: Options): Catchment`](#constructoroptions-options-catchment)
  * [`Options`](#options)
    * [Collect Buffer](#collect-buffer)
    * [Pipe Readable](#pipe-readable)
- [`async collect(readable: Readable, options?: Options): string|Buffer`](#async-collectreadable-readableoptions-options-stringbuffer)
  * [`CollectOptions`](#collectoptions)
- [Errors Handling](#errors-handling)
- [Copyright](#copyright)

## API

The package exports the default [_Catchment_ class](#catchment-class), and the [`collect` method](#collect).

```js
import Catchment, { collect } from 'catchment'
```

## `Catchment` Class

_Catchment_ extends `Writable`, and pushes incoming data into an internal array. When the stream finishes, a promise referenced in the `promise` property is fulfilled with concatenated data. If an error occurred, the promise is rejected.

A new _Catchment_ can be created with a constructor, which accepts [optional options](#options).

```javascript
/* yarn example/catchment.js */
import { Readable } from 'stream'
import Catchment from 'catchment'

const DATA = 'test-data'

// creating a readable stream to use in the example
const rs = new Readable({
  read() {
    for (let i = 0; i < DATA.length; i++) {
      const c = DATA.charAt(i)
      this.push(c)
    }
    this.push(null)
  },
})

;(async () => {
  try {
    const catchment = new Catchment()
    rs.pipe(catchment)
    const res = await catchment.promise
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})()
```

```
test-data
```

### `constructor(`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Catchment`

### `Options`

An optional options object can be passed to the constructor.

`import('stream').Readable` __<a name="readable">`Readable`</a>__

__`Options`__: Options to pass to the `Writable` super constructor, and others shown below.

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| rs | [_Readable_](#readable) | A readable stream to automatically pipe into the catchment. If an error occurs during reading of this stream, the catchment promise will be rejected with it. | - |
| binary | _boolean_ | Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with `.join('')` method. | `false` |

#### Collect Buffer

To receive a buffer, the `binary` option should be set to `true`:

```javascript
/* yarn example/binary.js */
import Catchment from 'catchment'
import { createReadable } from './lib'

(async () => {
  try {
    const rs = createReadable('test-data')
    const catchment = new Catchment({ binary: true })
    rs.pipe(catchment)

    const res = await catchment.promise
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})()
```

```
<Buffer 74 65 73 74 2d 64 61 74 61>
```

#### Pipe Readable

To automatically pipe a _Readable_, and reject the promise if an error occurs there, the `rs` option can be passed:

```js
/* yarn example/rs.js */
import Catchment from 'catchment'
import { createReadStream } from 'fs'

(async () => {
  try {
    const rs = createReadStream('missing-file.txt')
    const { promise } = new Catchment({ rs })

    const res = await promise
    console.log(res)
  } catch ({ message }) {
    console.log(message)
  }
})()
```

```
ENOENT: no such file or directory, open 'missing-file.txt'
```



## `async collect(`<br/>&nbsp;&nbsp;`readable: Readable,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): string|Buffer`

The collect method is a shorthand for creating a new catchment, and piping a readable stream into it. It will accumulate all data from the read stream, and asynchronously return when the stream finishes. If an error occurs in the stream, the promise will be rejected.

Some options can be passed to the `collect` method.

`import('stream').Readable` __<a name="readable">`Readable`</a>__

__<a name="collectoptions">`CollectOptions`</a>__: Options when collecting data into a catchment. They can extend `Writable` options which will be passed to the `Catchment` constructor.

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| binary | _boolean_ | Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with `.join('')` method. | `false` |

## Errors Handling

Whenever an error is encountered during reading a readable stream, either piped into the _Catchment_ via the `rs` option, or passed as an argument to the `collect` method, it will result in a rejected promise.

In the error has a stack, it will be modified to clean it from internal Node.js lines, such as `_module`.

```js
import { Readable } from 'stream'
import Catchment from 'catchment'

const rs = new Readable({
  read() {
    const er = new Error('example-error')
    this.emit('error', er) // emit an error to reject catchment
    this.push(null)
  },
})

;(async () => {
  try {
    const catchment = new Catchment({
      rs,
    })
    rs.pipe(catchment)
    await catchment.promise
  } catch ({ stack }) {
    console.log(stack)
  }
})()
```

```
Error: example-error
    at Readable.read [as _read] (/Users/zavr/adc/catchment/example/error-catchment.js:6:16)
```

If the error does not have a stack (which can happen when using `createReadStream` from the `fs` module), it will appear as thrown at the point of either creating an instance of _Catchment_, or calling the `collect` method.

```js
import { createReadStream } from 'fs'
import { collect } from 'catchment'

(async () => {
  try {
    const rs = createReadStream('missing-file.txt')
    await collect(rs)
  } catch ({ stack }) {
    console.log(stack)
  }
})()
```

```
Error: ENOENT: no such file or directory, open 'missing-file.txt'
    at /Users/zavr/adc/catchment/example/error-collect.js:7:11
    at Object.<anonymous> (/Users/zavr/adc/catchment/example/error-collect.js:11:3)
```

## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz
