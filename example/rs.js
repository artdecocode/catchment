/* yarn example/rs.js */
import Catchment from '../src'
import { createReadable } from './lib'

(async () => {
  try {
    const rs = createReadable('test-data')
    const { promise } = new Catchment({ rs })

    const res = await promise
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})()
