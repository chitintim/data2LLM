import type { ParsedData } from '@/lib/types';

/**
 * Transforms parsed data into a Markdown table
 *
 * @param data - 2D array of cell values
 * @param hasHeader - Whether first row should be treated as header
 * @returns Formatted Markdown table string
 */
export function toMarkdownTable(
  data: ParsedData,
  hasHeader: boolean = true
): string {
  if (!data || data.length === 0) {
    return '';
  }

  // If only one row and treating as header, show empty table
  if (data.length === 1 && hasHeader) {
    const headers = data[0];
    let md = '| ' + headers.join(' | ') + ' |\n';
    md += '|' + headers.map(() => '---').join('|') + '|\n';
    return md;
  }

  // Separate headers and rows
  const headers = hasHeader ? data[0] : generateHeaders(data[0].length);
  const rows = hasHeader ? data.slice(1) : data;

  // Build table header
  let md = '| ' + headers.join(' | ') + ' |\n';

  // Build separator row
  md += '|' + headers.map(() => '---').join('|') + '|\n';

  // Build data rows
  rows.forEach(row => {
    // Pad row if it has fewer columns than header
    const paddedRow = [...row];
    while (paddedRow.length < headers.length) {
      paddedRow.push('');
    }

    // Only take as many columns as headers
    const trimmedRow = paddedRow.slice(0, headers.length);

    md += '| ' + trimmedRow.join(' | ') + ' |\n';
  });

  return md;
}

/**
 * Generates generic column headers (Column 1, Column 2, etc.)
 */
function generateHeaders(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Column ${i + 1}`);
}

/**
 * Detects if first row looks like a header
 * Heuristic: if first row cells are different type/pattern from second row
 */
export function detectHeader(data: ParsedData): boolean {
  if (!data || data.length < 2) {
    return true; // Default to true for single row
  }

  const firstRow = data[0];
  const secondRow = data[1];

  // Check if first row is all text and second row has numbers
  const firstRowAllText = firstRow.every(
    cell => cell && isNaN(Number(cell))
  );
  const secondRowHasNumbers = secondRow.some(
    cell => cell && !isNaN(Number(cell))
  );

  return firstRowAllText && secondRowHasNumbers;
}
