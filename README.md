# catchment

[![npm version](https://badge.fury.io/js/catchment.svg)](https://badge.fury.io/js/catchment)

Collect stream data into a catchment.

```sh
npm i catchment
```

## ES5

The package uses some newer language features. For your convenience, it's been
transpiled to be compatible with Node 4. You can use the following snippet.

```js
const catchment = require('catchment/es5')
```

## API

`Catchment` extends `Writable`, and pushes incoming data into an array. When the
stream is finished, (e.g., `.end()` is called), a promise from `.promise`
property is fulfilled with joined data. If an error occurred, the promise is
rejected.

`options` are passed down to the extend Writable (`super(options)`).

## Catchment(options: object)

```js
const { Readable } = require('stream')
const Catchment = require('catchment')

const data = 'test-data'
const catchment = new Catchment()

const rs = new Readable({
    read() {
        for (let i = 0; i < data.length; i++) {
            const c = data.charAt(i)
            this.push(c)
        }
        this.push(null)
    },
})
rs.pipe(catchment);

(async () => {
    const res = await catchment.promise
    console.log(res) // test-data
})()
```

## options.rs: Readable

You can pass a `Readable` stream which will be automatically piped into the
`Catchment`.

```js
const { Readable } = require('stream')
const Catchment = require('catchment')

const data = 'test-data'

const rs = new Readable({
    read() {
        for (let i = 0; i < data.length; i++) {
            const c = data.charAt(i)
            this.push(c)
        }
        this.push(null)
    },
})

const catchment = new Catchment({ rs });

(async () => {
    const res = await catchment.promise
    console.log(res) // test-data
})()
```

## options.binary: boolean

If you would like the result as `Buffer`, pass the `binary` option.

```js
const { Readable } = require('stream')
const Catchment = require('catchment')

const data = 'test-data'

const rs = new Readable({
    read() {
        for (let i = 0; i < data.length; i++) {
            const c = data.charAt(i)
            this.push(c)
        }
        this.push(null)
    },
});

(async () => {
    const catchment = new Catchment({ binary: true })
    rs.pipe(catchment)

    const res = await catchment.promise
    console.log(res) // <Buffer 74 65 73 74 2d 64 61 74 61>
})()
```

---

(c) 2018 [Art Deco][1]

[1]: https://artdeco.bz
