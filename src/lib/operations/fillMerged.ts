import type { ParsedData } from '@/lib/types';

/**
 * Detects and fills merged cells by duplicating values
 *
 * Excel merged cells appear as: "Value\t\t\t" (value followed by empty tabs)
 * We fill these empty cells with the merged value
 */

export interface MergedCellStats {
  horizontalMerges: number;
  verticalMerges: number;
  totalFilled: number;
}

/**
 * Fill horizontally merged cells (value followed by empty cells in same row)
 */
export function fillHorizontalMerges(data: ParsedData): {
  data: ParsedData;
  stats: { count: number; filled: number };
} {
  let mergeCount = 0;
  let filledCount = 0;

  const result = data.map((row) => {
    const newRow = [...row];

    for (let i = 0; i < newRow.length; i++) {
      const cell = newRow[i];

      // If cell has value, check if next cells are empty (potential horizontal merge)
      if (cell && cell.trim()) {
        let emptyCount = 0;

        // Count consecutive empty cells
        for (let j = i + 1; j < newRow.length; j++) {
          if (!newRow[j] || !newRow[j].trim()) {
            emptyCount++;
          } else {
            break;
          }
        }

        // If we found empty cells, fill them
        if (emptyCount > 0) {
          mergeCount++;
          for (let j = i + 1; j < i + 1 + emptyCount; j++) {
            newRow[j] = cell;
            filledCount++;
          }
          // Skip ahead past filled cells
          i += emptyCount;
        }
      }
    }

    return newRow;
  });

  return {
    data: result,
    stats: { count: mergeCount, filled: filledCount },
  };
}

/**
 * Fill vertically merged cells (empty cells below a value in same column)
 */
export function fillVerticalMerges(data: ParsedData): {
  data: ParsedData;
  stats: { count: number; filled: number };
} {
  if (data.length === 0) {
    return { data, stats: { count: 0, filled: 0 } };
  }

  let mergeCount = 0;
  let filledCount = 0;

  const result = data.map((row) => [...row]);
  const columnCount = Math.max(...data.map((row) => row.length));

  // Process each column
  for (let col = 0; col < columnCount; col++) {
    for (let row = 0; row < result.length; row++) {
      const cell = result[row][col];

      // If cell has value, check if cells below are empty
      if (cell && cell.trim()) {
        let emptyCount = 0;

        // Count consecutive empty cells below
        for (let r = row + 1; r < result.length; r++) {
          const belowCell = result[r][col];
          if (!belowCell || !belowCell.trim()) {
            emptyCount++;
          } else {
            break;
          }
        }

        // If we found empty cells below, fill them
        if (emptyCount > 0) {
          mergeCount++;
          for (let r = row + 1; r < row + 1 + emptyCount; r++) {
            if (!result[r][col]) {
              result[r][col] = '';
            }
            result[r][col] = cell;
            filledCount++;
          }
          // Skip ahead
          row += emptyCount;
        }
      }
    }
  }

  return {
    data: result,
    stats: { count: mergeCount, filled: filledCount },
  };
}

/**
 * Detect merged cells in data
 */
export function detectMergedCells(data: ParsedData): {
  hasHorizontalMerges: boolean;
  hasVerticalMerges: boolean;
  horizontalCount: number;
  verticalCount: number;
} {
  if (data.length === 0) {
    return {
      hasHorizontalMerges: false,
      hasVerticalMerges: false,
      horizontalCount: 0,
      verticalCount: 0,
    };
  }

  let horizontalCount = 0;
  let verticalCount = 0;

  // Check for horizontal merges
  data.forEach((row) => {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] && row[i].trim() && (!row[i + 1] || !row[i + 1].trim())) {
        // Found potential horizontal merge
        let consecutive = 0;
        for (let j = i + 1; j < row.length; j++) {
          if (!row[j] || !row[j].trim()) consecutive++;
          else break;
        }
        if (consecutive > 0) horizontalCount++;
      }
    }
  });

  // Check for vertical merges
  const columnCount = Math.max(...data.map((row) => row.length));
  for (let col = 0; col < columnCount; col++) {
    for (let row = 0; row < data.length - 1; row++) {
      const cell = data[row][col];
      const below = data[row + 1]?.[col];

      if (cell && cell.trim() && (!below || !below.trim())) {
        // Found potential vertical merge
        let consecutive = 0;
        for (let r = row + 1; r < data.length; r++) {
          const c = data[r][col];
          if (!c || !c.trim()) consecutive++;
          else break;
        }
        if (consecutive > 0) verticalCount++;
      }
    }
  }

  return {
    hasHorizontalMerges: horizontalCount > 0,
    hasVerticalMerges: verticalCount > 0,
    horizontalCount,
    verticalCount,
  };
}

/**
 * Auto-fill all merged cells (both horizontal and vertical)
 */
export function fillAllMergedCells(data: ParsedData): {
  data: ParsedData;
  stats: MergedCellStats;
} {
  // First fill horizontal merges
  const horizontalResult = fillHorizontalMerges(data);

  // Then fill vertical merges on the result
  const verticalResult = fillVerticalMerges(horizontalResult.data);

  return {
    data: verticalResult.data,
    stats: {
      horizontalMerges: horizontalResult.stats.count,
      verticalMerges: verticalResult.stats.count,
      totalFilled: horizontalResult.stats.filled + verticalResult.stats.filled,
    },
  };
}
