import type { ParsedData } from '@/lib/types';

/**
 * Parses tab-separated values (TSV) - the format Excel uses when copying cells
 *
 * @param input - Raw string from clipboard
 * @returns 2D array of cell values
 */
export function parseTSV(input: string): ParsedData {
  if (!input || !input.trim()) {
    return [];
  }

  // Split by newlines to get rows
  const lines = input.split(/\r?\n/);

  // Parse each line into cells (split by tabs)
  const data: ParsedData = lines
    .filter(line => line.trim()) // Remove empty lines
    .map(line => line.split('\t'));

  return data;
}

/**
 * Checks if input appears to be TSV format
 */
export function isTSVFormat(input: string): boolean {
  if (!input || !input.trim()) {
    return false;
  }

  // Check if input contains tabs (primary indicator of TSV)
  return input.includes('\t');
}

/**
 * Gets basic statistics about parsed data
 */
export function getDataStats(data: ParsedData): {
  rowCount: number;
  columnCount: number;
  totalCells: number;
  nonEmptyCells: number;
} {
  const rowCount = data.length;
  const columnCount = rowCount > 0 ? Math.max(...data.map(row => row.length)) : 0;
  const totalCells = rowCount * columnCount;
  const nonEmptyCells = data.flat().filter(cell => cell && cell.trim()).length;

  return {
    rowCount,
    columnCount,
    totalCells,
    nonEmptyCells,
  };
}
