# Data2LLM

**Transform your data into LLM-friendly formats with intelligent suggestions**

## The Problem

When working with AI assistants like ChatGPT, users frequently need to share data from spreadsheets, notes, or other sources. However, the format in which data is presented significantly impacts how well the LLM can understand and process it:

- **Default behavior isn't always optimal**: LLMs often default to processing data by running Python code, which may not be the best approach for text-heavy or semantically structured data
- **Format matters**: A text-heavy table might be better as Markdown, while hierarchical data could work better as JSON
- **Structure varies**: Not all data is classic tabular format - think sticky notes organized in buckets, lists within columns, or key-value pairs

## The Solution

Data2LLM is a simple yet intelligent tool that helps you convert spreadsheet data into the optimal format for LLM consumption.

### Key Features

- **Paste and Transform**: Simply paste Excel/spreadsheet cell ranges into the input panel
- **Smart Suggestions**: Get intelligent recommendations for the best output format based on your data structure
- **Multiple Output Formats**:
  - Markdown tables and lists
  - JSON (flat or nested)
  - Plain text lists
  - Key-value pairs
- **Transformations**:
  - Transpose data
  - Restructure columns into lists
  - Convert buckets/categories into hierarchical formats
  - Handle sparse and irregular data

### Use Cases

1. **Idea Boards**: Convert sticky-note style data (buckets as columns, ideas as rows) into structured lists
2. **Text-Heavy Tables**: Transform tables with long text content into readable Markdown
3. **Configuration Data**: Convert key-value pairs into JSON format
4. **Lists and Categories**: Restructure grouped data into appropriate formats
5. **Data Transposition**: Flip rows and columns when needed for better LLM comprehension

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/data2LLM.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## How It Works

1. **Input**: Paste your Excel/spreadsheet data into the left panel
2. **Analysis**: The tool analyzes your data structure and content
3. **Suggestions**: Receive recommendations for optimal format and transformations
4. **Preview**: See the transformed output in real-time
5. **Copy**: Copy the LLM-friendly formatted output

## Project Status

🚧 **In Development** - This project is in active development. See our [roadmap](#roadmap) for planned features.

## Documentation

- [User Stories](./USER_STORIES.md) - Detailed use cases and scenarios
- [Architecture](./ARCHITECTURE.md) - Technical design and approach
- [Edge Cases](./EDGE_CASES.md) - Handling complex data scenarios
- [Contributing](./CONTRIBUTING.md) - How to contribute to the project

## Technology Stack

- **Frontend**: React with TypeScript
- **Parsing**: Custom parser for Excel/spreadsheet data
- **Intelligence**: Pattern recognition and heuristics for format suggestions
- **Styling**: Tailwind CSS for responsive design

## Roadmap

- [ ] Core input/output interface
- [ ] Basic format detection (table, list, key-value)
- [ ] Markdown output formatter
- [ ] JSON output formatter
- [ ] Transpose transformation
- [ ] Hierarchical data restructuring
- [ ] Smart suggestions engine
- [ ] Export and copy functionality
- [ ] Advanced pattern recognition
- [ ] User preference learning

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - See [LICENSE](./LICENSE) for details

## Authors

Built with ❤️ for the LLM community
