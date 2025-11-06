import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Data2LLM
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Transform spreadsheet data into LLM-friendly formats
          </p>
        </header>

        {/* Main Content - Two Panel Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Input Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 h-[600px]">
            <InputPanel />
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 h-[600px]">
            <OutputPanel />
          </div>
        </main>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How to use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Copy from Excel
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select cells in Excel or Google Sheets and copy (Ctrl+C / Cmd+C)
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Paste into Input
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Paste the data into the input panel on the left
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Copy Output
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click Copy to get your formatted Markdown table
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm space-y-2">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">
              100% client-side • Your data never leaves your browser
            </p>
          </div>
          <p className="text-xs">
            Built by Tim to solve a daily pain point when working with ChatGPT &
            friends. Created with a bit of Claude-powered vibe coding ✨
          </p>
          <p className="text-xs opacity-75">
            (Honestly just got tired of Excel tables confusing LLMs, so here we
            are)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
