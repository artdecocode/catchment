import * as PrivateApi from '../../context/private-api'
import { Readable } from 'stream'
// import { pipeError } from '../../'

class Context {
  /**
   * The error for the tests.
   */
  get error() {
    return new Error('test')
  }
}

/** @type {Object.<string, (c: Context, a: PrivateApi)>}*/
export const PipeError = {
  context: [Context, PrivateApi],
  '!throws the same error as read source'({ error }, { pipeError }) {
    const a = new Readable({
      read() {
        this.push('test')
        this.emit('error', error)
      },
    })
    const b = new Readable({
      read() {
        this.push('test')
      },
    })
    pipeError(b, a)
  },
}
