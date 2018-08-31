
### `Catchment` Class

_Catchment_ extends `Writable`, and pushes incoming data into an internal array. When the stream finishes, a promise from `.promise` property is fulfilled with joined data. If an error occurred, the promise is rejected.


```#### constructor => Catchment
[
  ["options?", "Options"]
]
```

A new _Catchment_ can be created with a constructor, which accepts optional options.

%EXAMPLE: example/catchment.js, ../src => catchment, javascript%

%FORK example example/catchment.js%

To receive a buffer, the `binary` option should be set to `true`:

%EXAMPLE: example/binary.js, ../src => catchment, javascript%

%FORK example example/binary.js%

To automatically pipe a _Readable_, and reject the promise if an error occurs there, the `rs` option can be passed:

%EXAMPLE: example/rs.js, ../src => catchment, javascript%

%FORK example example/rs.js%
