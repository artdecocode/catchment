import { equal, throws, deepEqual } from 'zoroaster/assert'
import { createReadStream } from 'fs'
import { collect } from '../../src'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'collects string stream data'({ createReadable, data }) {
    const rs = createReadable(data)
    const res = await collect(rs)
    equal(res, data)
  },
  async 'reads binary data'({ createReadable, getBuffer, data }) {
    const expected = getBuffer(data)
    const rs = createReadable(data)
    const res = await collect(rs, { binary: true })
    deepEqual(res, expected)
  },
  async 'throws on error in piped rs'({ createErrorReadable }) {
    await throws({
      fn: collect,
      args: [createErrorReadable('test-data')],
      stack: /test\/context\/index\.js/,
    })
  },
  async 'adds error stack to errors without stack'() {
    await throws({
      fn: collect,
      args: [createReadStream('test')],
      stack: /adds error stack to errors without stack/,
    })
  },
}

export default T
