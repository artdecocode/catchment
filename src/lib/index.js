/**
 * When the error in streamB is emitted, is is manually also emitted in the streamA.
 * @param {Stream} streamA The stream that will emit an error once it's caught in `streamB`.
 * @param {Stream} streamB The stream from which the error originates.
 */
export const pipeError = (streamA, streamB) => {
  streamB
    .once('error', e => {
      streamA.emit('error', e)
    })
  return streamB
}

/**
 * @typedef {import('stream').Stream} Stream
 */