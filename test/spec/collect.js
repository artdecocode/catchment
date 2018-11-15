import * as assert from 'zoroaster/assert'
import * as API from '../../src'
import Context, * as c from '../context'

const api = { ...API, ...assert, ...c }

/** @type {Object.<string, (a: api, c: Context)>} */
const T = {
  context: [api, Context],
  async 'collects string stream data'(
    { collect, equal }, { createReadable, data },
  ) /* check if we can normally collect data */ {
    const rs = createReadable(data)
    const res = await collect(rs)
    equal(res, data)
  },
  async 'reads binary data'(
    { collect, deepEqual }, { createReadable, getBuffer, data },
  ) /* pass the binary:true option */ {
    const expected = getBuffer(data)
    const rs = createReadable(data)
    const res = await collect(rs, { binary: true })
    deepEqual(res, expected)
  },
  async 'throws on error in piped rs'(
    { collect, throws }, { createErrorReadable }
  )/* the catchment will listen for an error in the rs */ {
    await throws({
      fn: collect,
      args: createErrorReadable('test-data'),
      stack: /test\/context\/index\.js/,
    })
  },
  async 'adds error stack to errors without stack'(
    { collect, throws, createReadStream }
  ) /* fs.readStream does not have error stack */{
    await throws({
      fn: collect,
      args: createReadStream('test'),
      stack: /adds error stack to errors without stack/,
    })
  },
  async 'maintains call stack with proxyError'(
    { collect, throws }, { createErrorReadable }
  ) /* proxying on the line of the call */ {
    const rs = createErrorReadable('test', 'error')
    await throws({
      fn: async function testFunction() {
        await collect(rs, { proxyError: true })
      },
      stack: /at testFunction[\s\S]+maintains call stack with proxyError/,
    })
  },
  async 'no proxyError'({ collect, throws }, { createErrorReadable }) {
    const rs = createErrorReadable('test', 'error')
    await throws({
      fn: collect,
      args: rs,
      stack: /Error: error\s+at Readable.read \[as _read\].+$/,
    })
  },
}

export default T
