/* yarn example/binary.js */
import Catchment from '../src'
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
