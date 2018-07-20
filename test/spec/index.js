import { equal, throws, deepEqual } from 'zoroaster/assert'
import Catchment from '../../src'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'collects string stream data'({ createReadable, data }) {
    const catchment = new Catchment()
    const rs = createReadable(data)
    rs.pipe(catchment)
    const res = await catchment.promise
    equal(res, data)
  },
  async 'collects string stream data from passed rs'({ createReadable, data }) {
    const rs = createReadable(data)
    const catchment = new Catchment({ rs })
    const res = await catchment.promise
    equal(res, data)
  },
  async 'reads binary data'({ createReadable, nodeGte, data }) {
    const expected = nodeGte('v5.10.0') ? Buffer.from(data) : new Buffer(data)
    const catchment = new Catchment({
      binary: true,
    })
    const rs = createReadable(data)
    rs.pipe(catchment)
    const res = await catchment.promise
    deepEqual(res, expected)
  },
  async 'returns a rejected promise on error'() {
    const error = new Error('test-error')
    await throws({
      async fn() {
        const catchment = new Catchment()
        catchment.emit('error', error)
        await catchment.promise
      },
      error,
    })
  },
  async 'returns a rejected promise on error in piped rs'({ createReadable }) {
    const error = new Error('test-error')
    await throws({
      async fn() {
        const rs = createReadable('test')
        const { promise } = new Catchment({
          rs,
        })
        rs.emit('error', error)
        await promise
      },
      error,
    })
  },
}

export default T
