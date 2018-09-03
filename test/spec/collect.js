import { equal, throws, deepEqual } from 'zoroaster/assert'
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
  async 'throws on error in piped rs'({ createReadable }) {
    const error = new Error('test-error')
    await throws({
      async fn() {
        const rs = createReadable('test')
        rs.emit('error', error)
        await collect(rs)
      },
      error,
    })
  },
}

export default T
