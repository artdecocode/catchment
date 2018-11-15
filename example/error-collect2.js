
import { collect } from '../src'
import { createReadable } from './lib'
import frame from 'frame-of-mind'

/** 0. Prepare a read function in a stream that emits an error. */
function read() {
  const err = new Error('Whatever error happens')
  setTimeout(() => {
    this.emit('error', err)
    this.push(null)
  }, 10)
}

const Collect = async ({ proxyError } = {}) => {
  try {
    const rs = createReadable(read)
    await collect(rs, { proxyError })
  } catch ({ stack }) {
    console.log('COLLECT %s \n%s', proxyError ? 'WITH PROXY' : '', frame(stack))
  }
}

const Listeners = async () => {
  try {
    const rs = createReadable(read)
    const p = collect(rs).catch(() => {})
    await new Promise((r, j) => {
      rs.on('finish', r)
      rs.on('error', j)
    })
    await p
  } catch ({ stack }) {
    console.log('LISTENERS:\n%s', frame(stack))
  }
}

(async () => {
  await Collect()
  await Listeners()
  await Collect({ proxyError: true })
})()