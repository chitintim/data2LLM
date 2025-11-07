import type { ParsedData } from '@/lib/types';

/**
 * Transposes a 2D array (swaps rows and columns).
 *
 * Handles ragged arrays properly - if columns have different lengths,
 * shorter columns are padded with empty strings to maintain proper alignment.
 *
 * Example:
 * Input:
 *   Ideas       Features     Bugs
 *   -------     --------     ----
 *   Idea 1      Feature A    Bug X
 *   Idea 2      Feature B    Bug Y
 *   Idea 3                   Bug Z
 *   Idea 4
 *
 * Output:
 *   Ideas      Idea 1    Idea 2    Idea 3    Idea 4
 *   Features   Feature A Feature B (empty)   (empty)
 *   Bugs       Bug X     Bug Y     Bug Z     (empty)
 *
 * @param data The 2D array to transpose
 * @returns The transposed 2D array
 */
export function transpose(data: ParsedData): ParsedData {
  if (!data || data.length === 0) {
    return [];
  }

  // Find the maximum row length (handles ragged arrays)
  const maxCols = Math.max(...data.map(row => row.length));

  // Create transposed array
  const transposed: ParsedData = [];

  // For each column index in the original data
  for (let colIndex = 0; colIndex < maxCols; colIndex++) {
    const newRow: string[] = [];

    // For each row in the original data, get the cell at colIndex
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const originalRow = data[rowIndex];

      // If this row has a value at colIndex, use it; otherwise use empty string
      const cellValue = colIndex < originalRow.length ? originalRow[colIndex] : '';
      newRow.push(cellValue);
    }

    transposed.push(newRow);
  }

  return transposed;
}
