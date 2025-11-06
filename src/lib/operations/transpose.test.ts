import { describe, it, expect } from 'vitest';
import { transpose } from './transpose';

describe('transpose', () => {
  it('should transpose a simple 2x2 matrix', () => {
    const input = [
      ['A', 'B'],
      ['C', 'D'],
    ];

    const expected = [
      ['A', 'C'],
      ['B', 'D'],
    ];

    expect(transpose(input)).toEqual(expected);
  });

  it('should transpose a 3x2 matrix', () => {
    const input = [
      ['A', 'B'],
      ['C', 'D'],
      ['E', 'F'],
    ];

    const expected = [
      ['A', 'C', 'E'],
      ['B', 'D', 'F'],
    ];

    expect(transpose(input)).toEqual(expected);
  });

  it('should transpose a 2x3 matrix', () => {
    const input = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
    ];

    const expected = [
      ['A', 'D'],
      ['B', 'E'],
      ['C', 'F'],
    ];

    expect(transpose(input)).toEqual(expected);
  });

  it('should handle ragged arrays with shorter first row', () => {
    const input = [
      ['A', 'B'],
      ['C', 'D', 'E'],
      ['F', 'G', 'H'],
    ];

    const expected = [
      ['A', 'C', 'F'],
      ['B', 'D', 'G'],
      ['', 'E', 'H'], // First row was short, so empty string
    ];

    expect(transpose(input)).toEqual(expected);
  });

  it('should handle ragged arrays with shorter last row', () => {
    const input = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
      ['G', 'H'],
    ];

    const expected = [
      ['A', 'D', 'G'],
      ['B', 'E', 'H'],
      ['C', 'F', ''], // Last row was short, so empty string
    ];

    expect(transpose(input)).toEqual(expected);
  });

  it('should handle ragged arrays with multiple short rows (sticky note board)', () => {
    const input = [
      ['Ideas', 'Idea 1', 'Idea 2', 'Idea 3', 'Idea 4'],
      ['Features', 'Feature A', 'Feature B'],
      ['Bugs', 'Bug X', 'Bug Y', 'Bug Z'],
    ];

    const expected = [
      ['Ideas', 'Features', 'Bugs'],
      ['Idea 1', 'Feature A', 'Bug X'],
      ['Idea 2', 'Feature B', 'Bug Y'],
      ['Idea 3', '', 'Bug Z'],
      ['Idea 4', '', ''],
    ];

    expect(transpose(input)).toEqual(expected);
  });

  it('should handle empty array', () => {
    expect(transpose([])).toEqual([]);
  });

  it('should handle single row', () => {
    const input = [['A', 'B', 'C']];

    const expected = [['A'], ['B'], ['C']];

    expect(transpose(input)).toEqual(expected);
  });

  it('should handle single column', () => {
    const input = [['A'], ['B'], ['C']];

    const expected = [['A', 'B', 'C']];

    expect(transpose(input)).toEqual(expected);
  });

  it('should handle a row with all empty strings', () => {
    const input = [
      ['A', 'B'],
      ['', ''],
      ['C', 'D'],
    ];

    const expected = [
      ['A', '', 'C'],
      ['B', '', 'D'],
    ];

    expect(transpose(input)).toEqual(expected);
  });
});
