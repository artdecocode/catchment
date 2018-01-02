'use strict';

var _require = require('stream'),
    Writable = _require.Writable;

function joinBufferData(array) {
    return array.join('');
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
        var _this;

        _this = super(options);
        this._caughtData = [];
        this._promise = new Promise(function (resolve, reject) {
            _this.on('finish', function () {
                if (options && options.binary) {
                    var data = Buffer.concat(_this._caughtData);
                    resolve(data);
                } else {
                    var _data = joinBufferData(_this._caughtData);
                    resolve(_data);
                }
                _this._caughtData = [];
            });
            _this.on('error', reject);
        });
        if (options && options.rs) {
            options.rs.pipe(this);
        }
    }
    _write(chunk, encoding, callback) {
        this._caughtData.push(chunk);
        callback();
    }
    get promise() {
        return this._promise;
    }
}

module.exports = Catchment;