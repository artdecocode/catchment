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
})

const catchment = new Catchment({ rs });

(async () => {
  const res = await catchment.promise
  console.log(res)
})()
