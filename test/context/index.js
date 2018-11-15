import { Readable } from 'stream'
import { nodeGte } from 'noddy'
export { createReadStream } from 'fs'

export default class Context {
  /**
   * Create a `Readable` stream from a string.
   * @param {string} data
   */
  createReadable(data) {
    const rs = new Readable({
      read() {
        for (let i = 0; i < data.length; i++) {
          const c = data.charAt(i)
          this.push(c)
        }
        this.push(null)
      },
    })
    return rs
  }
  /**
   * Create a `Readable` which will throw an error.
   * @param {string} data
   */
  createErrorReadable(data, err) {
    const rs = new Readable({
      read() {
        for (let i = 0; i < data.length; i++) {
          const c = data.charAt(i)
          this.push(c)
        }
        const error = new Error(err)
        this.emit('error', error)
        this.push(null)
      },
    })
    return rs
  }
  getBuffer(data) {
    return nodeGte('v5.10.0') ? Buffer.from(data) : new Buffer(data)
  }
  get nodeGte() {
    return nodeGte
  }
  /**
   * The test data to write: `test-data`.
   */
  get data() {
    return 'test-data'
  }
}
