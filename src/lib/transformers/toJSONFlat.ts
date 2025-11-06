import type { ParsedData } from '@/lib/types';

/**
 * Transforms parsed data into flat JSON format
 * Each row becomes an object with column headers as keys
 *
 * @param data - 2D array of cell values
 * @param hasHeader - Whether first row should be treated as header
 * @returns JSON string
 */
export function toJSONFlat(
  data: ParsedData,
  hasHeader: boolean = true
): string {
  if (!data || data.length === 0) {
    return '[]';
  }

  // If only one row and treating as header, return empty array
  if (data.length === 1 && hasHeader) {
    return '[]';
  }

  // Separate headers and rows
  const headers = hasHeader ? data[0] : generateHeaders(data[0].length);
  const rows = hasHeader ? data.slice(1) : data;

  // Convert each row to an object
  const jsonData = rows.map((row) => {
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      const key = sanitizeKey(header);
      const value = row[index] || '';

      // Try to infer type
      obj[key] = inferValue(value);
    });

    return obj;
  });

  return JSON.stringify(jsonData, null, 2);
}

/**
 * Generates generic column headers (column_1, column_2, etc.)
 */
function generateHeaders(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `column_${i + 1}`);
}

/**
 * Sanitizes header text to valid JSON key
 * Converts spaces and special chars to underscores, lowercase
 */
function sanitizeKey(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}

/**
 * Infers the type of a cell value
 * Returns number, boolean, or string
 */
function inferValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  // Empty or whitespace
  if (!trimmed) {
    return '';
  }

  // Boolean
  if (trimmed.toLowerCase() === 'true') return true;
  if (trimmed.toLowerCase() === 'false') return false;

  // Null/NA values
  if (['null', 'n/a', 'na', '-'].includes(trimmed.toLowerCase())) {
    return null;
  }

  // Number (but not if it looks like an ID or code)
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed === num.toString()) {
    return num;
  }

  // Default to string
  return trimmed;
}
