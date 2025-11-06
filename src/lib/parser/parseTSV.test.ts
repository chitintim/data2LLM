import { describe, it, expect } from 'vitest';
import { parseTSV, isTSVFormat, getDataStats } from './parseTSV';

describe('parseTSV', () => {
  it('should parse simple TSV data', () => {
    const input = 'Name\tAge\tCity\nAlice\t25\tNYC\nBob\t30\tLA';
    const result = parseTSV(input);

    expect(result).toEqual([
      ['Name', 'Age', 'City'],
      ['Alice', '25', 'NYC'],
      ['Bob', '30', 'LA'],
    ]);
  });

  it('should handle empty input', () => {
    expect(parseTSV('')).toEqual([]);
    expect(parseTSV('   ')).toEqual([]);
  });

  it('should remove empty lines', () => {
    const input = 'A\tB\n\nC\tD\n\n';
    const result = parseTSV(input);

    expect(result).toEqual([
      ['A', 'B'],
      ['C', 'D'],
    ]);
  });
});

describe('isTSVFormat', () => {
  it('should detect TSV format', () => {
    expect(isTSVFormat('A\tB\tC')).toBe(true);
    expect(isTSVFormat('Name\tAge\nAlice\t25')).toBe(true);
  });

  it('should return false for non-TSV', () => {
    expect(isTSVFormat('A,B,C')).toBe(false);
    expect(isTSVFormat('just text')).toBe(false);
    expect(isTSVFormat('')).toBe(false);
  });
});

describe('getDataStats', () => {
  it('should calculate correct stats', () => {
    const data = [
      ['Name', 'Age', 'City'],
      ['Alice', '25', 'NYC'],
      ['Bob', '', 'LA'],
    ];

    const stats = getDataStats(data);

    expect(stats.rowCount).toBe(3);
    expect(stats.columnCount).toBe(3);
    expect(stats.totalCells).toBe(9);
    expect(stats.nonEmptyCells).toBe(8); // One empty cell
  });
});
