import type { ParsedData } from '@/lib/types';

interface PreviewTableProps {
  data: ParsedData;
  hasHeader?: boolean;
}

export function PreviewTable({ data, hasHeader = true }: PreviewTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded">
        Table preview will appear here after you paste data
      </div>
    );
  }

  const headers = hasHeader ? data[0] : [];
  const rows = hasHeader ? data.slice(1) : data;

  return (
    <div className="overflow-auto max-h-64 border border-gray-300 dark:border-gray-600 rounded">
      <table className="w-full text-sm border-collapse">
        {hasHeader && headers.length > 0 && (
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600"
                >
                  {header || <span className="text-gray-400">(empty)</span>}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                >
                  {cell || (
                    <span className="text-gray-400 dark:text-gray-600 italic text-xs">
                      (empty)
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
