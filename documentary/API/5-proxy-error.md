## Proxy Error

The `collect` method can throw an error with its stack updated to when it was called. This can be useful when using 3-rd party streams without the need to look into details of their internal stack. By setting the `proxyError` option, all internal lines of the stream will be hidden, and the error will appear to be thrown by the call to the `collect` method.

%EXAMPLE: example/error-collect2.js, ../src => catchment%

%FORK example example/error-collect2%

%~%