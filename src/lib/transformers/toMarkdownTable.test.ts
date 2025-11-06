import { describe, it, expect } from 'vitest';
import { toMarkdownTable, detectHeader } from './toMarkdownTable';

describe('toMarkdownTable', () => {
  it('should convert data to markdown table with header', () => {
    const data = [
      ['Name', 'Age', 'City'],
      ['Alice', '25', 'NYC'],
      ['Bob', '30', 'LA'],
    ];

    const result = toMarkdownTable(data, true);

    expect(result).toBe(
      '| Name | Age | City |\n' +
      '|---|---|---|\n' +
      '| Alice | 25 | NYC |\n' +
      '| Bob | 30 | LA |\n'
    );
  });

  it('should handle data without header', () => {
    const data = [
      ['Alice', '25', 'NYC'],
      ['Bob', '30', 'LA'],
    ];

    const result = toMarkdownTable(data, false);

    expect(result).toContain('Column 1');
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
  });

  it('should handle empty data', () => {
    expect(toMarkdownTable([], true)).toBe('');
  });

  it('should handle inconsistent column counts', () => {
    const data = [
      ['Name', 'Age', 'City'],
      ['Alice', '25'], // Missing column
      ['Bob', '30', 'LA', 'Extra'], // Extra column
    ];

    const result = toMarkdownTable(data, true);

    // Should pad missing columns and trim extra columns
    expect(result).toContain('Alice | 25 |');
    expect(result).not.toContain('Extra');
  });
});

describe('detectHeader', () => {
  it('should detect header when first row is text and second has numbers', () => {
    const data = [
      ['Name', 'Age', 'Score'],
      ['Alice', '25', '95'],
      ['Bob', '30', '87'],
    ];

    expect(detectHeader(data)).toBe(true);
  });

  it('should default to true for single row', () => {
    const data = [['Name', 'Age', 'City']];
    expect(detectHeader(data)).toBe(true);
  });
});
