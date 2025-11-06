import { FormatSelector } from './FormatSelector';

export function ControlPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Transform
      </h2>
      <FormatSelector />
    </div>
  );
}
