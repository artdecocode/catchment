const { equal, throws, deepEqual } = require('zoroaster/assert')
const { Readable } = require('stream')
const { nodeGte } = require('noddy')
const Catchment = require('../..')

function createReadable(data) {
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

module.exports = {
    async 'should collect string stream data'() {
        const data = 'test-data'
        const catchment = new Catchment()
        const rs = createReadable(data)
        rs.pipe(catchment)
        const res = await catchment.promise
        equal(res, data)
    },
    async 'should collect string stream data from passed rs'() {
        const data = 'test-data'
        const rs = createReadable(data)
        const catchment = new Catchment({ rs })
        const res = await catchment.promise
        equal(res, data)
    },
    async 'should read binary data'() {
        const data = 'test-data'
        const expected = nodeGte('v5.10.0') ? Buffer.from(data) : new Buffer(data)
        const catchment = new Catchment({
            binary: true,
        })
        const rs = createReadable(data)
        rs.pipe(catchment)
        const res = await catchment.promise
        deepEqual(res, expected)
    },
    async 'should return a rejected promise on error'() {
        const error = new Error('test-error')
        await throws({
            async fn() {
                const catchment = new Catchment()
                catchment.emit('error', error)
                await catchment.promise
            },
            error,
        })
    },
}
