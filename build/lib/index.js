/**
 * Listens for the `error` event once so that when an error in _streamB_ is emitted, is is also emitted in the _streamA_.
 * @param {stream.Stream} streamA The stream that will emit an error once it's caught in the `streamB`.
 * @param {stream.Stream} streamB The stream from which the error originates.
 * @returns The stream the error is listened on, i.e., transparent to calling the `.once` method on that stream.
 */
       const pipeError = (streamA, streamB) => {
  streamB
    .once('error', e => {
      streamA.emit('error', e)
    })
  return streamB
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Stream} stream.Stream
 */

module.exports.pipeError = pipeError