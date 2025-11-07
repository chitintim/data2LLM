import { FormatSelector } from './FormatSelector';
import { useDataStore } from '@/store';

export function ControlPanel() {
  const { processedData, transposeData } = useDataStore();
  const hasData = processedData.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Transform
      </h2>
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <FormatSelector />
        </div>
        <button
          onClick={transposeData}
          disabled={!hasData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                     disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500
                     transition-colors duration-200 font-medium"
          title="Swap rows and columns"
        >
          ⟲ Transpose
        </button>
      </div>
    </div>
  );
}
