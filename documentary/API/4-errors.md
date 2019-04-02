## Errors Handling

Whenever an error is encountered during reading a readable stream, either piped into a _Catchment_ via the `rs` option, or passed as an argument to the `collect` method, it will result in a rejected promise.

If the error has a stack, it will be modified to clean it from internal Node.js lines, such as `_module`.

%EXAMPLE: example/error-catchment, ../src => catchment%

%FORK example/error-catchment%

If the error does not have the stack (which can happen when using `createReadStream` from the `fs` module), it will appear as thrown at the point of either creating an instance of _Catchment_, or calling the `collect` method.

%EXAMPLE: example/error-collect, ../src => catchment%

%FORK example/error-collect%

%~%