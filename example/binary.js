const { Readable } = require('stream')
const Catchment = require('..')

const data = 'test-data'

const rs = new Readable({
    read() {
        for (let i = 0; i < data.length; i++) {
            const c = data.charAt(i)
            this.push(c)
        }
        this.push(null)
    },
});

(async () => {
    const catchment = new Catchment({ binary: true })
    rs.pipe(catchment)

    const res = await catchment.promise
    console.log(res) // <Buffer 74 65 73 74 2d 64 61 74 61>
})()
