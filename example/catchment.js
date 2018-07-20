/* yarn example/catchment.js */
import { Readable } from 'stream'
import Catchment from '../src'

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
