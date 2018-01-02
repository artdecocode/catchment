'use strict';

var _require = require('zoroaster/assert'),
    equal = _require.equal,
    throws = _require.throws,
    deepEqual = _require.deepEqual;

var _require2 = require('stream'),
    Readable = _require2.Readable;

var _require3 = require('noddy/es5'),
    nodeGte = _require3.nodeGte;

var Catchment = require('../..');

function createReadable(data) {
    var rs = new Readable({
        read() {
            for (var i = 0; i < data.length; i++) {
                var c = data.charAt(i);
                this.push(c);
            }
            this.push(null);
        }
    });
    return rs;
}

module.exports = {
    'should collect string stream data'() {
        return new Promise(function ($return, $error) {
            var data, catchment, rs, res;

            data = 'test-data';
            catchment = new Catchment();
            rs = createReadable(data);
            rs.pipe(catchment);
            return Promise.resolve(catchment.promise).then(function ($await_1) {
                try {
                    res = $await_1;
                    equal(res, data);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should collect string stream data from passed rs'() {
        return new Promise(function ($return, $error) {
            var data, rs, catchment, res;

            data = 'test-data';
            rs = createReadable(data);
            catchment = new Catchment({ rs });
            return Promise.resolve(catchment.promise).then(function ($await_2) {
                try {
                    res = $await_2;
                    equal(res, data);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should read binary data'() {
        return new Promise(function ($return, $error) {
            var data, expected, catchment, rs, res;

            data = 'test-data';
            expected = nodeGte('v5.10.0') ? Buffer.from(data) : new Buffer(data);
            catchment = new Catchment({
                binary: true
            });
            rs = createReadable(data);
            rs.pipe(catchment);
            return Promise.resolve(catchment.promise).then(function ($await_3) {
                try {
                    res = $await_3;
                    deepEqual(res, expected);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should return a rejected promise on error'() {
        return new Promise(function ($return, $error) {
            var error;

            error = new Error('test-error');
            return Promise.resolve(throws({
                fn() {
                    return new Promise(function ($return, $error) {
                        var catchment;

                        catchment = new Catchment();
                        catchment.emit('error', error);
                        return Promise.resolve(catchment.promise).then(function ($await_4) {
                            try {
                                return $return();
                            } catch ($boundEx) {
                                return $error($boundEx);
                            }
                        }.bind(this), $error);
                    }.bind(this));
                },
                error
            })).then(function ($await_5) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};