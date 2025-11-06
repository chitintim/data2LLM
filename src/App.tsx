function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Data2LLM
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transform your data into LLM-friendly formats with intelligent
            suggestions
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Welcome to Data2LLM
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Paste your spreadsheet data and get optimal format suggestions
              for LLM processing
            </p>
            <div className="max-w-2xl mx-auto text-left space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  🎯 Smart Format Detection
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Automatically detects the best format for your data
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  📊 Multiple Output Formats
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300">
                  Markdown, JSON, Lists, and more
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                  ⚡ Real-time Preview
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  See transformations as you type
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
          <p>
            Phase 0: Project Setup Complete ✓ | Next: Building MVP Interface
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
