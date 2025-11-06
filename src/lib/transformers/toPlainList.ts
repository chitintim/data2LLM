import type { ParsedData } from '@/lib/types';

/**
 * Transforms parsed data into a plain Markdown list
 * Flattens all data into a single list
 *
 * @param data - 2D array of cell values
 * @param skipHeader - Whether to skip the first row
 * @returns Plain Markdown list string
 */
export function toPlainList(
  data: ParsedData,
  skipHeader: boolean = true
): string {
  if (!data || data.length === 0) {
    return '';
  }

  const rows = skipHeader ? data.slice(1) : data;

  // Flatten all cells and filter out empty ones
  const items = rows
    .flat()
    .map((cell) => cell?.trim())
    .filter((cell) => cell);

  if (items.length === 0) {
    return '';
  }

  return items.map((item) => `- ${item}`).join('\n');
}
