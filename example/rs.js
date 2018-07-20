/* yarn example/rs.js */
import Catchment from '../src'
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
