## 10 April 2019

### [3.3.0](https://github.com/artdecocode/catchment/compare/v3.2.3...v3.3.0)

- [types] Fix types for _Google Closure Compiler_ w/ _Depack_.
- [externs] Provide externs.
- [deps] Update and unlock dependencies.

## 2 April 2019

### [3.2.3](https://github.com/artdecocode/catchment/compare/v3.2.2...v3.2.3)

- [deps] Update `erotic`.

## 25 January 2019

### 3.2.2

- [package] Add sponsor.

## 14 January 2019

### 3.2.1

- [package] Add the "module" field.
- [package] Remove source maps.

## 16 November 2018

### 3.2.0

- [feature] The proxy error option to hide the error stack.
- [lib] Pipe error function.
- [deps] Update dependencies.
- [doc] Sections breaks.

## 13 September 2018

### 3.1.1

- [deps] Update dependencies, use `@artdeco/clean-stack`.

## 4 September 2018

### 3.1.0

- [feature] The `collect` method to quickly capture data from a stream.
- [feature] Update error stacks to either clean them from Node's internals, or add lines where _Catchment_ or `collect` were called.

## 1 September 2018

### 3.0.1

- [doc] Place `Options` type in `types.xml`; more JSDoc; structure docs better.
- [build] Build with [`alamode`](https://alamode.cc)

## 21 July 2018

### 3.0.0

- [package] Move to `Art Deco`, bring structure up-to-date.
- [ecma] Use `import` and `export` syntax.
- [feature] Reject the promise if piped `rs` emits an error.

## 2 January 2018

### 2.0.1

- [bugfix] publish `es5/src/index.js`

### 2.0.0

- [feature] pass `rs` property to pipe a `Readable` stream automatically.
- [feature] pass `binary` property to resolve with a `Buffer`.
- [feature] (breaking) update to `EcmaScript 8`, provide `es5`.

## 18 April 2017

### 1.0.0

- Initial release: collect string data and access it on `finish` event via the `promise` property.
