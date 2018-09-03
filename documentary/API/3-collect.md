
```## async collect => string|Buffer
[
  ["readable", "Readable"],
  ["options?", "Options"]
]
```

The collect method is a shorthand for creating a new catchment, and piping a readable stream into it. It will accumulate all data from the read stream, and asynchronously return when the stream finishes. If an error occurs in the stream, the promise will be rejected.

Some options can be passed to the `collect` method.

%TYPEDEF types/collect.xml%
