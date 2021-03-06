## `Catchment` Class

_Catchment_ extends `Writable`, and pushes incoming data into an internal array. When the stream finishes, a promise referenced in the `promise` property is fulfilled with concatenated data. If an error occurred, the promise is rejected.

A new _Catchment_ can be created with a constructor, which accepts [optional options](#options).

%EXAMPLE: example/catchment, ../src => catchment%

%FORK example/catchment%

```### constructor => Catchment
[
  ["options?", "Options"]
]
```

### `Options`

An optional options object can be passed to the constructor.

%TYPEDEF types/index.xml%

#### Collect Buffer

To receive a buffer, the `binary` option should be set to `true`:

%EXAMPLE: example/binary, ../src => catchment%

%FORK example/binary%

#### Pipe Readable

To automatically pipe a _Readable_, and reject the promise if an error occurs there, the `rs` option can be passed:

%EXAMPLE: example/rs, ../src => catchment%

%FORK example/rs%

%~%