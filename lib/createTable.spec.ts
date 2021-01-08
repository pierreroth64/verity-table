import { createTable } from './createTable';

describe('Table', () => {
  describe('creation', () => {
    it('should fire error when given empty lines', () => {
      expect(() => createTable({ lines: [] })).toThrow(
        /Table description error: empty lines/
      );
    });

    it('should fire error when lines does not have same number of elements', () => {
      expect(() =>
        createTable({
          lines: [
            [true, false, { data: 1 }],
            [true, false, true, { data: 2 }],
          ],
        })
      ).toThrow(
        /Table description error: lines must have the same number of elements/
      );
    });

    it('should fire error when lines has twice the same combination of elements', () => {
      expect(() =>
        createTable({
          lines: [
            [true, false, { data: 1 }],
            [true, false, { data: 2 }],
          ],
        })
      ).toThrow(
        /Table description error: some lines contain the same combination/
      );
    });
  });

  describe('run', () => {
    it('should return result according to boolean args', () => {
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
    });

    it('should return result according to mixed args (boolean and function)', () => {
      const table = createTable({
        lines: [
          [false, false, { data: 1 }],
          [false, true, { data: 2 }],
          [true, false, { data: 3 }],
          [true, true, { data: 4 }],
        ],
      });

      const result = table.run([true, () => true]);

      expect(result).toEqual({ data: 4 });
    });

    it('should run the callback if result is a callback', () => {
      const table = createTable<any>({
        lines: [
          [false, false, { data: 1 }],
          [false, true, { data: 2 }],
          [true, false, { data: 3 }],
          [true, true, () => ({ data: 4 })],
        ],
      });

      const result = table.run([true, true]);

      expect(result).toEqual({ data: 4 });
    });
  });

  describe('display', () => {
    it('should display without column titles', () => {
      const table = createTable({
        lines: [
          [false, false, { data: 1 }],
          [false, true, { data: 2 }],
          [true, false, { data: 3 }],
          [true, true, { data: 4 }],
        ],
      });

      table.display();
    });

    it('should display with column titles', () => {
      const table = createTable<any>({
        columnTitles: ['first col', 'second col'],
        lines: [
          [false, false, { data: 1 }],
          [false, true, { data: 2 }],
          [true, false, { data: 3 }],
          [
            true,
            true,
            () => {
              return { data: 4 };
            },
          ],
        ],
      });

      table.display();
    });
  });
});
