
## `Catchment` Class

_Catchment_ extends `Writable`, and pushes incoming data into an internal array. When the stream finishes, a promise from `.promise` property is fulfilled with joined data. If an error occurred, the promise is rejected.

%EXAMPLE: example/catchment.js, ../src => catchment, javascript%

%FORK example example/catchment.js%