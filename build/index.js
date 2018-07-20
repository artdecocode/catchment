"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stream = require("stream");

function joinBufferData(array) {
  return array.join('');
}

class Catchment extends _stream.Writable {
  /**
   * Create a new catchment to pipe a readable stream into and collect all
   * emitted data.
   * @constructor
   * @param {Object} options Options to pass to `Writable` the super constructor, and other shown below.
   * @param {Readable} [options.rs] A readable stream to automatically pipe into the catchment. If an error occurs in that stream, the catchment promise will be rejected.
   * @param {boolean} [options.binary=false] Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with `.join('')` method. Default `false`.
   * @example
   *
   * import { createReadStream } from 'fs'
   * import Catchment from 'catchment'
   *
   * const rs = createReadStream('file.txt')
   * const { promise } = new Catchment({ rs })
   * const res = await promise
   */
  constructor(options = {}) {
    super(options);
    const {
      binary,
      rs
    } = options;
    this._caughtData = [];
    this._promise = new Promise((r, j) => {
      this.on('finish', () => {
        let d;

        if (binary) {
          d = Buffer.concat(this._caughtData);
        } else {
          d = joinBufferData(this._caughtData);
        }

        r(d);
        this._caughtData = [];
      });
      this.on('error', j);

      if (rs) {
        rs.on('error', j);
        rs.pipe(this);
      }
    });
  }

  _write(chunk, encoding, callback) {
    this._caughtData.push(chunk);

    callback();
  }
  /** @type {Promise.<string|Buffer>} */


  get promise() {
    return this._promise;
  }

}
/**
 * @typedef {import('stream').Readable} Readable
 * @typedef {Object} Options Options to pass to `Writable` the super constructor, and other shown below.
 * @prop {Readable} rs A readable stream to automatically pipe into the catchment.
 * @prop {boolean} binary Whether to return a raw buffer instead of a string. The string is created by joining all incoming chunks together with `.join('')` method.
 */


var _default = Catchment;
exports.default = _default;
//# sourceMappingURL=index.js.map