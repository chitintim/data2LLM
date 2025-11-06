import { describe, it, expect } from 'vitest';
import {
  fillHorizontalMerges,
  fillVerticalMerges,
  detectMergedCells,
  fillAllMergedCells,
} from './fillMerged';

describe('fillHorizontalMerges', () => {
  it('should fill horizontally merged cells', () => {
    const data = [
      ['Project A', '', '', 'Status'],
      ['Task', 'Owner', 'Date', 'Done'],
    ];

    const result = fillHorizontalMerges(data);

    expect(result.data).toEqual([
      ['Project A', 'Project A', 'Project A', 'Status'],
      ['Task', 'Owner', 'Date', 'Done'],
    ]);
    expect(result.stats.count).toBe(1);
    expect(result.stats.filled).toBe(2);
  });

  it('should handle multiple merges in same row', () => {
    const data = [['A', '', 'B', '', '', 'C']];

    const result = fillHorizontalMerges(data);

    expect(result.data).toEqual([['A', 'A', 'B', 'B', 'B', 'C']]);
  });

  it('should not modify rows without merges', () => {
    const data = [['A', 'B', 'C']];

    const result = fillHorizontalMerges(data);

    expect(result.data).toEqual([['A', 'B', 'C']]);
    expect(result.stats.count).toBe(0);
  });
});

describe('fillVerticalMerges', () => {
  it('should fill vertically merged cells', () => {
    const data = [
      ['Project A', 'Task 1'],
      ['', 'Task 2'],
      ['', 'Task 3'],
      ['Project B', 'Task 4'],
    ];

    const result = fillVerticalMerges(data);

    expect(result.data).toEqual([
      ['Project A', 'Task 1'],
      ['Project A', 'Task 2'],
      ['Project A', 'Task 3'],
      ['Project B', 'Task 4'],
    ]);
  });

  it('should handle multiple columns with vertical merges', () => {
    const data = [
      ['A', 'X'],
      ['', 'Y'],
      ['B', ''],
    ];

    const result = fillVerticalMerges(data);

    expect(result.data).toEqual([
      ['A', 'X'],
      ['A', 'Y'],
      ['B', 'Y'],
    ]);
  });
});

describe('detectMergedCells', () => {
  it('should detect horizontal merges', () => {
    const data = [['Project A', '', '', 'Status']];

    const result = detectMergedCells(data);

    expect(result.hasHorizontalMerges).toBe(true);
    expect(result.horizontalCount).toBeGreaterThan(0);
  });

  it('should detect vertical merges', () => {
    const data = [
      ['Project A', 'Task 1'],
      ['', 'Task 2'],
    ];

    const result = detectMergedCells(data);

    expect(result.hasVerticalMerges).toBe(true);
    expect(result.verticalCount).toBeGreaterThan(0);
  });

  it('should detect no merges in clean data', () => {
    const data = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
    ];

    const result = detectMergedCells(data);

    expect(result.hasHorizontalMerges).toBe(false);
    expect(result.hasVerticalMerges).toBe(false);
  });
});

describe('fillAllMergedCells', () => {
  it('should fill both horizontal and vertical merges', () => {
    const data = [
      ['Project A', '', ''],
      ['', 'Task 1', 'Done'],
      ['', 'Task 2', 'Pending'],
    ];

    const result = fillAllMergedCells(data);

    expect(result.data).toEqual([
      ['Project A', 'Project A', 'Project A'],
      ['Project A', 'Task 1', 'Done'],
      ['Project A', 'Task 2', 'Pending'],
    ]);
    expect(result.stats.totalFilled).toBeGreaterThan(0);
  });
});
