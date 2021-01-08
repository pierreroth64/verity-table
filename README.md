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

// you can pass a callback as a result:
const tableWithCb = createTable({
  lines: [
    [false, false, { data: 1 }],
    [false, true, { data: 2 }],
    [true, false, { data: 3 }],
    [true, true, () => ({ data: 4 })],
  ],
});

const result2 = table.run([true, true]);

expect(result).toEqual({ data: 4 });
```

You can also display the table to visually check your verity table:

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

table.display();
```

![table](./images/table.png?raw=true 'Table')

## Tests

Standard unit test can be run with:

```
npm test
```
