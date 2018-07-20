const { Readable } = require('stream')
const Catchment = require('..')

const data = 'test-data'
const catchment = new Catchment()

const rs = new Readable({
    read() {
        for (let i = 0; i < data.length; i++) {
            const c = data.charAt(i)
            this.push(c)
        }
        this.push(null)
    },
})
rs.pipe(catchment);

(async () => {
    const res = await catchment.promise
    console.log(res)
})()
