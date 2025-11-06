import type { ParsedData } from '@/lib/types';

/**
 * Parses tab-separated values (TSV) - the format Excel uses when copying cells
 * Handles multi-line cells (cells with line breaks) which are wrapped in quotes
 *
 * @param input - Raw string from clipboard
 * @returns 2D array of cell values
 */
export function parseTSV(input: string): ParsedData {
  if (!input || !input.trim()) {
    return [];
  }

  const result: ParsedData = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote: "" becomes "
        currentCell += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
        i++;
        continue;
      }
    }

    if (!insideQuotes && char === '\t') {
      // Tab outside quotes = new cell
      currentRow.push(currentCell);
      currentCell = '';
      i++;
      continue;
    }

    if (!insideQuotes && (char === '\n' || char === '\r')) {
      // Newline outside quotes = new row
      currentRow.push(currentCell);

      // Only add row if it has content
      if (currentRow.some(cell => cell.trim())) {
        result.push(currentRow);
      }

      currentRow = [];
      currentCell = '';

      // Skip \r\n combinations
      if (char === '\r' && nextChar === '\n') {
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    // Regular character or newline/tab inside quotes
    currentCell += char;
    i++;
  }

  // Don't forget the last cell and row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(cell => cell.trim())) {
      result.push(currentRow);
    }
  }

  return result;
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
