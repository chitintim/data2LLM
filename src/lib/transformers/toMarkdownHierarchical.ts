import type { ParsedData } from '@/lib/types';

/**
 * Transforms parsed data into hierarchical Markdown lists
 * Perfect for idea boards, categorized data, bucket-style organization
 *
 * Each column becomes a category/section with items listed below
 *
 * @param data - 2D array of cell values
 * @param hasHeader - Whether first row should be treated as category names
 * @returns Markdown hierarchical list string
 */
export function toMarkdownHierarchical(
  data: ParsedData,
  hasHeader: boolean = true
): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Separate headers and rows
  const headers = hasHeader ? data[0] : generateHeaders(data[0].length);
  const rows = hasHeader ? data.slice(1) : data;

  let md = '';

  // For each column, create a category with items
  headers.forEach((header, colIndex) => {
    md += `## ${header || `Category ${colIndex + 1}`}\n\n`;

    // Collect all items from this column
    const items = rows
      .map((row) => row[colIndex])
      .filter((cell) => cell && cell.trim());

    if (items.length === 0) {
      md += '_No items_\n\n';
    } else {
      items.forEach((item) => {
        md += `- ${item}\n`;
      });
      md += '\n';
    }
  });

  return md;
}

/**
 * Generates generic headers (Category 1, Category 2, etc.)
 */
function generateHeaders(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Category ${i + 1}`);
}
