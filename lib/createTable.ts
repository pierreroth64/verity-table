import * as _ from 'lodash';
import debugLib from 'debug';

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
    const defaultPadding = 10;
    let padding = defaultPadding;
    if (columnTitles) {
      const maxLength = (_.maxBy(columnTitles, (t) => t.length) || '').length;
      padding = maxLength + 1 < defaultPadding ? defaultPadding : maxLength + 1;
      const titlesStr = columnTitles
        .map((v) => _.padEnd(v, padding, ' '))
        .join(' | ');
      const underline = _.padStart('', titlesStr.length, '-');
      debug(titlesStr);
      debug(underline);
    }
    for (const line of lines) {
      const values = _.dropRight(line);
      const result = _.last(line);
      const valuesStr = values
        .map((v) => (typeof v === 'function' ? v() : v))
        .map((v) => _.padEnd(v, padding, ' '))
        .join(' | ');
      const resultStr =
        typeof result === 'function' ? result.toString() : result;
      debug('%s | %O', valuesStr, resultStr);
    }
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
