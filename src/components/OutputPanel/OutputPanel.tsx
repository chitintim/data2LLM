import { useState } from 'react';
import { useDataStore } from '@/store';

export function OutputPanel() {
  const { outputData, error } = useDataStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: select text
      alert('Copy failed. Please select and copy manually.');
    }
  };

  const hasOutput = outputData.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Output
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Markdown table format
          </p>
        </div>
        {hasOutput && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                       text-sm font-medium transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Display */}
      <div
        className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-gray-50 dark:bg-gray-900 overflow-auto"
      >
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
                Error
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {error}
              </p>
            </div>
          </div>
        ) : hasOutput ? (
          <pre className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre">
            {outputData}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Formatted output will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
