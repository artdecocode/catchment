const stream = require('stream')
const assert = require('assert')

const Catchment = require('../src')
const Readable = stream.Readable

module.exports = {
    'should collect string stream data': () => {
        const data = 'test-data'
        const catchment = new Catchment()
        const rs = new Readable({
            read() {
                for (let i = 0; i < data.length; i++) {
                    const c = data.charAt(i)
                    this.push(c)
                }
                this.push(null)
            }
        })
        rs.pipe(catchment)
        return catchment.promise
            .then(res => assert(res === data))
    },
    'should return a rejected promise on error': () => {
        const data = 'test-data'
        const catchment = new Catchment()
        const error = new Error('Some error occured while writing')
        catchment.emit('error', error)
        return catchment.promise
            .then(() => {
                throw new Error('The promise should have been rejected')
            })
            .catch((err) => {
                assert(err === error)
            })
    },
}
