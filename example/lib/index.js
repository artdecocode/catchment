import { Readable } from 'stream'

/**
 * Data that will be read or the read function to be bound to the stream.
 */
export const createReadable = (data) => {
  let rs
  if (typeof data == 'function') {
    rs = new Readable({
      read(...args) {
        return d(...args)
      },
    })
    const d = data.bind(rs)
  } else {
    rs = new Readable({
      read() {
        for (let i = 0; i < data.length; i++) {
          const c = data.charAt(i)
          this.push(c)
        }
        this.push(null)
      },
    })
  }
  return rs
}