import { useDataStore } from '@/store';
import { getDataStats } from '@/lib/parser';

export function InputPanel() {
  const { inputData, parsedData, setInputData, clearData } = useDataStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);
  };

  const handleClear = () => {
    clearData();
  };

  const stats = parsedData.length > 0 ? getDataStats(parsedData) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Input
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Paste your Excel or spreadsheet data here
          </p>
        </div>
        {inputData && (
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-3 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span>
            {stats.rowCount} rows × {stats.columnCount} columns
          </span>
          <span>{stats.nonEmptyCells} filled cells</span>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={inputData}
        onChange={handleChange}
        placeholder="Paste your data here... (Try copying cells from Excel or Google Sheets)"
        className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   font-mono text-sm resize-none"
      />
    </div>
  );
}
