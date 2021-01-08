import * as _ from 'lodash';
import debugLib from 'debug';
import { table } from 'table';

const debug = debugLib('');
debug.enabled = true;

type RunArg = boolean | (() => boolean);

export interface Table<R> {
  run: (args: RunArg[]) => R;
  display: () => void;
}

type Line<T extends unknown[], R> = [...T, R];

export interface TableDescription<R> {
  lines: Line<boolean[], R>[];
  columnTitles?: string[];
}

export function createTable<R>(desc: TableDescription<R>): Table<R> {
  const tableDescription: TableDescription<R> = check(_.cloneDeep(desc));

  return {
    run,
    display,
  };

  function check(description: TableDescription<R>) {
    const { lines } = description;
    if (lines.length === 0) {
      throw new Error('Table description error: empty lines');
    }

    const lineLengths = _.uniq(lines.map((l) => l.length));
    if (
      lineLengths === undefined ||
      lineLengths === null ||
      lineLengths.length !== 1
    ) {
      throw new Error(
        'Table description error: lines must have the same number of elements'
      );
    }

    const lineStrings = lines.map((l) =>
      buildString(_.dropRight(l) as RunArg[])
    );

    if (lineStrings.length !== _.uniq(lineStrings).length) {
      throw new Error(
        'Table description error: some lines contain the same combination'
      );
    }
    return description;
  }

  function run(args: RunArg[]): any {
    const { lines } = tableDescription;
    const argStr = buildString(args);

    for (const line of lines) {
      const values = _.dropRight(line);
      const lineStr = buildString(values as RunArg[]);

      if (lineStr === argStr) {
        const result = _.last(line);
        return typeof result === 'function' ? result() : result;
      }
    }
  }

  function display(): void {
    const { lines, columnTitles } = tableDescription;
    const tableLines = [];

    if (columnTitles) {
      tableLines.push([...columnTitles, '']);
    }
    for (const line of lines) {
      const values = _.dropRight(line);
      const result = _.last(line);
      const resultStr =
        typeof result === 'function'
          ? result.toString()
          : JSON.stringify(result, null, 4);
      tableLines.push([...values, resultStr]);
    }
    console.log(table(tableLines));
  }
}

function buildString(args: RunArg[]): string {
  let str = '';
  for (const arg of args) {
    if (typeof arg === 'function') {
      str += `${arg()}`;
    } else {
      str += `${arg}`;
    }
  }
  return str;
}
