# catchment

[![npm version](https://badge.fury.io/js/catchment.svg)](https://npmjs.org/package/catchment)

A Node.js package to collect stream data into a catchment and return it either as a buffer or a string.

```
yarn add -E catchment
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [API](#api)
  * [`COptions` Type](#coptions-type)
    * [<code>binary</code>](#binary)
    * [<code>rs</code>](#rs)
  * [`Catchment` Class](#catchment-class)
    * [`constructor(options?: COptions): Catchment`](#constructoroptions-coptions-catchment)

## API

The package exports the default `Catchment` class.

```js
import Catchment from 'catchment'
```

### `COptions` Type

An optional options object can be passed to the constructor.

<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><a name="binary"><code>binary</code></a></td>
   <td><em>boolean</em></td>
   <td>Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with <code>.join('')</code> method. Default <code>false</code>.</td>
  </tr>
  <tr>
   <td><a name="rs"><code>rs</code></a></td>
   <td><em>Readable</em></td>
   <td>A readable stream to automatically pipe into the catchment. If an error occurs in this stream, the catchment promise will be rejected.</td>
  </tr>
 </tbody>
</table>


### `Catchment` Class

_Catchment_ extends `Writable`, and pushes incoming data into an internal array. When the stream finishes, a promise from `.promise` property is fulfilled with joined data. If an error occurred, the promise is rejected.


#### `constructor(`<br/>&nbsp;&nbsp;`options?: COptions,`<br/>`): Catchment`

A new _Catchment_ can be created with a constructor, which accepts optional options.

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

To automatically pipe a _Readable_, and reject the promise if an error occurs there, the `rs` option can be passed:

```javascript
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

---

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz
