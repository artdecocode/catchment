import { Readable } from 'stream'
import Catchment from '../src'

const rs = new Readable({
  read() {
    const er = new Error('example-error')
    this.emit('error', er) // emit an error to reject catchment
    this.push(null)
  },
})

;(async () => {
  try {
    const catchment = new Catchment({
      rs,
    })
    rs.pipe(catchment)
    await catchment.promise
  } catch ({ stack }) {
    console.log(stack)
  }
})()
