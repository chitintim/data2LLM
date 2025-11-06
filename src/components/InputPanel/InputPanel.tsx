import { useState } from 'react';
import { useDataStore } from '@/store';
import { getDataStats } from '@/lib/parser';
import { PreviewTable } from './PreviewTable';

export function InputPanel() {
  const {
    inputData,
    processedData,
    hasHeader,
    mergedCellStats,
    setInputData,
    clearData,
  } = useDataStore();

  const [showRaw, setShowRaw] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);
  };

  const handleClear = () => {
    clearData();
  };

  const stats = processedData.length > 0 ? getDataStats(processedData) : null;
  const hasMergedCells =
    mergedCellStats && mergedCellStats.totalFilled > 0;

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
        <div className="flex items-center gap-2">
          {processedData.length > 0 && (
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {showRaw ? 'Show Table' : 'Show Raw'}
            </button>
          )}
          {inputData && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats & Merge Info */}
      {stats && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {stats.rowCount} rows × {stats.columnCount} columns
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {stats.nonEmptyCells} filled cells
          </span>
          {hasMergedCells && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ Filled {mergedCellStats.totalFilled} merged cells
            </span>
          )}
        </div>
      )}

      {/* Content: Table or Textarea */}
      <div className="flex-1 overflow-hidden">
        {processedData.length > 0 && !showRaw ? (
          <PreviewTable data={processedData} hasHeader={hasHeader} />
        ) : (
          <textarea
            value={inputData}
            onChange={handleChange}
            placeholder="Paste your data here...

Try copying cells from Excel or Google Sheets - they'll appear as a table!"
            className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       font-mono text-sm resize-none"
          />
        )}
      </div>
    </div>
  );
}
