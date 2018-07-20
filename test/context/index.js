import { Readable } from 'stream'
import { nodeGte } from 'noddy'

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
  get nodeGte() {
    return nodeGte
  }
  get data() {
    return 'test-data'
  }
}