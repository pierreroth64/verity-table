# verity-table

_verity-table_ is verity table utility lib for NodeJs.

## Installation

```
npm install verity-table
```

## Usage

```js
import { createTable } from 'verity-table';

const table = createTable({
  lines: [
    [false, false, { data: 1 }],
    [false, true, { data: 2 }],
    [true, false, { data: 3 }],
    [true, true, { data: 4 }],
  ],
});

const result = table.run([false, true]);

expect(result).toEqual({ data: 2 });
```

## Tests

Standard unit test can be run with:

```
npm test
```