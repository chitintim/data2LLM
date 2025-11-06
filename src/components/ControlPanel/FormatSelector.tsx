import { OutputFormat } from '@/lib/types';
import { useDataStore } from '@/store';

const FORMAT_OPTIONS = [
  {
    value: OutputFormat.MARKDOWN_TABLE,
    label: 'Markdown Table',
    description: 'Structured table with aligned columns',
  },
  {
    value: OutputFormat.JSON_FLAT,
    label: 'JSON',
    description: 'Structured JSON array of objects',
  },
  {
    value: OutputFormat.MARKDOWN_HIERARCHICAL,
    label: 'Hierarchical Lists',
    description: 'Categories with items (ideal for idea boards)',
  },
  {
    value: OutputFormat.PLAIN_LIST,
    label: 'Plain List',
    description: 'Simple bulleted list',
  },
];

export function FormatSelector() {
  const { selectedFormat, setFormat, processedData } = useDataStore();

  const hasData = processedData.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value as OutputFormat);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="format-selector"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Output Format
      </label>
      <select
        id="format-selector"
        value={selectedFormat}
        onChange={handleChange}
        disabled={!hasData}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {FORMAT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Show description of selected format */}
      {hasData && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {FORMAT_OPTIONS.find((opt) => opt.value === selectedFormat)
            ?.description}
        </p>
      )}
    </div>
  );
}
