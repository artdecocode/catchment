# catchment

[![npm version](https://badge.fury.io/js/catchment.svg)](https://npmjs.org/package/catchment)

A Node.JS package to collect stream data into a catchment and return it either as a buffer or a string.

```
yarn add -E catchment
```

<table>
  <tr></tr>
  <tr>
    <td align="center">
      <a href="https://www.technation.sucks">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
      <br />
      Sponsored by 
      <a href="https://www.technation.sucks">Tech Nation Visa Sucks</a>
      .
    </td>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [API](#api)
- [`Catchment` Class](#catchment-class)
  * [`constructor(options?: Options): Catchment`](#constructoroptions-options-catchment)
  * [`Options`](#options)
    * [Collect Buffer](#collect-buffer)
    * [Pipe Readable](#pipe-readable)
- [`async collect(readable: Readable, options?: CollectOptions): string|Buffer`](#async-collectreadable-readableoptions-collectoptions-stringbuffer)
  * [`_catchment.CollectOptions`](#type-_catchmentcollectoptions)
- [Errors Handling](#errors-handling)
- [Proxy Error](#proxy-error)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## API

The package exports the default _Catchment_ class, and the `collect` method.

```js
import Catchment, { collect } from 'catchment'
```

The types and [externs](externs.js) for _Google Closure Compiler_ via [**_Depack_**](https://github.com/dpck/depack) are defined in the `_catchment` namespace.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `Catchment` Class

_Catchment_ extends `Writable`, and pushes incoming data into an internal array. When the stream finishes, a promise referenced in the `promise` property is fulfilled with concatenated data. If an error occurred, the promise is rejected.

A new _Catchment_ can be created with a constructor, which accepts [optional options](#options).

```js
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

[`import('stream').Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable) __<a name="type-streamreadable">`stream.Readable`</a>__

__<a name="type-_catchmentoptions">`_catchment.Options`</a>__: Options to pass to the `Writable` super constructor, and others shown below.

|  Name  |                    Type                    |                                                                          Description                                                                          | Default |
| ------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| rs     | _[!stream.Readable](#type-streamreadable)_ | A readable stream to automatically pipe into the catchment. If an error occurs during reading of this stream, the catchment promise will be rejected with it. | -       |
| binary | _boolean_                                  | Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with `.join('')` method.                    | `false` |

#### Collect Buffer

To receive a buffer, the `binary` option should be set to `true`:

```js
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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>





## `async collect(`<br/>&nbsp;&nbsp;`readable: Readable,`<br/>&nbsp;&nbsp;`options?: CollectOptions,`<br/>`): string|Buffer`

The collect method is a shorthand for creating a new catchment, and piping a readable stream into it. It will accumulate all data from the read stream, and asynchronously return when the stream finishes. If an error occurs in the stream, the promise will be rejected.

Some options can be passed to the `collect` method. The `proxyError` option is described in the [Proxy Error](#proxy-error) section.

__<a name="type-_catchmentcollectoptions">`_catchment.CollectOptions`</a>__: Options when collecting data into a catchment. They can extend `Writable` options which will be passed to the `Catchment` constructor.

|    Name    |   Type    |                                                                                                Description                                                                                                 | Default |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| binary     | _boolean_ | Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with `.join('')` method.                                                                 | `false` |
| proxyError | _boolean_ | Sets whether an error emitted by the stream with have its stack start at the line where the `collect` was called rather than inside of the stream. In other words, hides the implementation of the stream. | `false` |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Errors Handling

Whenever an error is encountered during reading a readable stream, either piped into a _Catchment_ via the `rs` option, or passed as an argument to the `collect` method, it will result in a rejected promise.

If the error has a stack, it will be modified to clean it from internal Node.js lines, such as `_module`.

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

If the error does not have the stack (which can happen when using `createReadStream` from the `fs` module), it will appear as thrown at the point of either creating an instance of _Catchment_, or calling the `collect` method.

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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## Proxy Error

The `collect` method can throw an error with its stack updated to when it was called. This can be useful when using 3-rd party streams without the need to look into details of their internal stack. By setting the `proxyError` option, all internal lines of the stream will be hidden, and the error will appear to be thrown by the call to the `collect` method.

```js
import { collect } from 'catchment'
import { createReadable } from './lib'
import frame from 'frame-of-mind'

/** 0. Prepare a read function in a stream that emits an error. */
function read() {
  const err = new Error('Whatever error happens')
  setTimeout(() => {
    this.emit('error', err)
    this.push(null)
  }, 10)
}

const Collect = async ({ proxyError } = {}) => {
  try {
    const rs = createReadable(read)
    await collect(rs, { proxyError })
  } catch ({ stack }) {
    console.log('COLLECT %s \n%s', proxyError ? 'WITH PROXY' : '', frame(stack))
  }
}

const Listeners = async () => {
  try {
    const rs = createReadable(read)
    const p = collect(rs).catch(() => {})
    await new Promise((r, j) => {
      rs.on('finish', r)
      rs.on('error', j)
    })
    await p
  } catch ({ stack }) {
    console.log('LISTENERS:\n%s', frame(stack))
  }
}

(async () => {
  await Collect()
  await Listeners()
  await Collect({ proxyError: true })
})()
```

```
COLLECT  
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Error: Whatever error happens                                                          │
│     at Readable.read (/Users/zavr/adc/catchment/example/error-collect2.js:8:15)        │
│     at Readable.read [as _read] (/Users/zavr/adc/catchment/example/lib/index.js:11:16) │
└────────────────────────────────────────────────────────────────────────────────────────┘
LISTENERS:
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Error: Whatever error happens                                                          │
│     at Readable.read (/Users/zavr/adc/catchment/example/error-collect2.js:8:15)        │
│     at Readable.read [as _read] (/Users/zavr/adc/catchment/example/lib/index.js:11:16) │
└────────────────────────────────────────────────────────────────────────────────────────┘
COLLECT WITH PROXY 
┌────────────────────────────────────────────────────────────────────────────┐
│ Error: Whatever error happens                                              │
│     at Collect (/Users/zavr/adc/catchment/example/error-collect2.js:18:11) │
│     at /Users/zavr/adc/catchment/example/error-collect2.js:41:9            │
│     at <anonymous>                                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>