import { Readable } from 'stream'

export const createReadable = (data) => {
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