const { Writable } = require('stream')

function joinBufferData(array) {
    return array.join('')
}

class Catchment extends Writable {
    /**
     * Create a new catchment to pipe a readable stream into and collect all
     * emitted data.
     * @param {object} options options are passed to Writable super constructor
     * @param {Readable} [options.rs] a readable stream to automatically pipe
     * into the catchment
     * @param {boolean} [options.binary] whether to return a buffer
     */
    constructor(options) {
        super(options)
        this._caughtData = []
        this._promise = new Promise((resolve, reject) => {
            this.on('finish', () => {
                if (options && options.binary) {
                    const data = Buffer.concat(this._caughtData)
                    resolve(data)
                } else {
                    const data = joinBufferData(this._caughtData)
                    resolve(data)
                }
                this._caughtData = []
            })
            this.on('error', reject)
        })
        if (options && options.rs) {
            options.rs.pipe(this)
        }
    }
    _write(chunk, encoding, callback) {
        this._caughtData.push(chunk)
        callback()
    }
    get promise() {
        return this._promise
    }
}

module.exports = Catchment
