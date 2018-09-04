import { createReadStream } from 'fs'
import { collect } from '../src'

(async () => {
  try {
    const rs = createReadStream('missing-file.txt')
    await collect(rs)
  } catch ({ stack }) {
    console.log(stack)
  }
})()
