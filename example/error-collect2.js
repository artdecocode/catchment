
import { collect } from '../src'
import { Readable } from 'stream'

const rs = new Readable({
  read() {
    setTimeout(() => {
      this.emit('error', new Error('error'))
    })
  },
})

;(async () => {
  try {
    await collect(rs)
  } catch ({ stack }) {
    console.log('Without listeners: ', stack)
  }
})()

;(async () => {
  try {
    await new Promise((r, j) => {
      rs.on('finish', r)
      rs.on('error', j)
    })
  } catch ({ stack }) {
    console.log('With listeners: ', stack)
  }
})()
