# Implementation Roadmap

This document outlines a phased approach to building Data2LLM, from MVP to full-featured product. Each phase builds on the previous one, delivering value incrementally.

---

## Philosophy

1. **Start Simple**: MVP should be usable in 1-2 weeks
2. **Iterate Quickly**: Each phase should deliver visible value
3. **Test Early**: Real user feedback shapes priorities
4. **Client-Side Only**: Everything runs in browser, no backend needed
5. **Progressive Enhancement**: Add features without breaking existing functionality

---

## Phase 0: Project Setup (1-2 days)

### Goals
- Set up development environment
- Configure tooling
- Create initial project structure

### Tasks

#### 1. Initialize Project
```bash
npm create vite@latest data2LLM -- --template react-ts
cd data2LLM
npm install
```

#### 2. Install Dependencies
```bash
# Core
npm install zustand

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Code Quality
npm install -D eslint prettier eslint-config-prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 3. Configure Tools
- Set up Tailwind CSS
- Configure ESLint and Prettier
- Set up Vitest
- Configure path aliases in `tsconfig.json`
- Set up GitHub Pages deployment workflow

#### 4. Create Basic Structure
```
src/
├── components/
├── lib/
├── hooks/
├── store/
└── styles/
```

### Deliverables
- ✅ Project initialized
- ✅ All tools configured
- ✅ Basic folder structure created
- ✅ Dev server running
- ✅ GitHub repo set up with Actions

---

## Phase 1: MVP - Basic Table Transformation (1-2 weeks)

### Goals
- Accept pasted tabular data
- Display it in input panel
- Transform to Markdown table
- Copy to clipboard

### Features
1. **Input Panel**: Textarea that accepts pasted data
2. **Parser**: Basic TSV parser (Excel clipboard format)
3. **Output Panel**: Display formatted Markdown
4. **Copy Button**: Copy output to clipboard

### Implementation Steps

#### Week 1: Core Functionality

**Day 1-2: Input Panel + Parser**
```typescript
// src/lib/parser/parseTSV.ts
export function parseTSV(input: string): string[][] {
  return input
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.split('\t'));
}

// src/components/InputPanel/InputPanel.tsx
export function InputPanel() {
  const [input, setInput] = useState('');

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    setInput(text);
    // Parse and store
  };

  return (
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onPaste={handlePaste}
      placeholder="Paste your data here..."
    />
  );
}
```

**Day 3-4: Markdown Transformer + Output Panel**
```typescript
// src/lib/transformers/toMarkdownTable.ts
export function toMarkdownTable(data: string[][]): string {
  if (data.length === 0) return '';

  const [headers, ...rows] = data;

  let md = '| ' + headers.join(' | ') + ' |\n';
  md += '|' + headers.map(() => '---').join('|') + '|\n';

  rows.forEach(row => {
    md += '| ' + row.join(' | ') + ' |\n';
  });

  return md;
}

// src/components/OutputPanel/OutputPanel.tsx
export function OutputPanel({ output }: { output: string }) {
  return (
    <div className="output-panel">
      <pre>{output}</pre>
    </div>
  );
}
```

**Day 5: Copy Button + State Management**
```typescript
// src/store/dataStore.ts
import { create } from 'zustand';

interface DataStore {
  inputData: string;
  parsedData: string[][];
  outputData: string;
  setInputData: (data: string) => void;
  setOutputData: (data: string) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  inputData: '',
  parsedData: [],
  outputData: '',
  setInputData: (data) => set({ inputData: data }),
  setOutputData: (data) => set({ outputData: data }),
}));

// src/components/OutputPanel/CopyButton.tsx
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

#### Week 2: Polish + Deploy

**Day 6-7: UI Polish**
- Style with Tailwind CSS
- Responsive layout (3-panel design)
- Basic error handling

**Day 8-9: Testing**
- Unit tests for parser
- Unit tests for transformer
- Integration test for full flow

**Day 10: Deploy**
- GitHub Pages deployment
- README with usage instructions
- Share with first users

### Success Criteria
- [ ] Can paste Excel data
- [ ] Converts to Markdown table
- [ ] Copy button works
- [ ] Deployed to GitHub Pages
- [ ] 5+ people test it and provide feedback

### Metrics
- Time from paste to copy: <1 second
- Supports up to 100 rows
- No crashes on invalid input

---

## Phase 2: Multiple Formats (2-3 weeks)

### Goals
- Support multiple output formats
- Manual format selection
- Handle simple edge cases

### New Features
1. **Format Selector**: Dropdown to choose format
2. **Additional Formatters**: JSON, Plain List, Key-Value
3. **Basic Validation**: Check for common issues
4. **Empty Cell Handling**: Remove/handle empty cells

### Implementation Steps

**Week 1: Additional Formatters**
```typescript
// src/lib/transformers/toJSONFlat.ts
export function toJSONFlat(data: string[][]): string {
  const [headers, ...rows] = data;

  const jsonData = rows.map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });

  return JSON.stringify(jsonData, null, 2);
}

// src/lib/transformers/toPlainList.ts
export function toPlainList(data: string[][]): string {
  const items = data.flat().filter(cell => cell.trim());
  return items.map(item => `- ${item}`).join('\n');
}
```

**Week 2: Format Selector**
```typescript
// src/components/ControlPanel/FormatSelector.tsx
export function FormatSelector() {
  const [format, setFormat] = useState<OutputFormat>('markdown_table');

  return (
    <select value={format} onChange={(e) => setFormat(e.target.value)}>
      <option value="markdown_table">Markdown Table</option>
      <option value="markdown_list">Markdown List</option>
      <option value="json_flat">JSON</option>
      <option value="plain_list">Plain List</option>
    </select>
  );
}
```

**Week 3: Edge Case Handling**
- Empty cell removal
- Whitespace trimming
- Header detection (heuristic)
- Error messages for malformed data

### Success Criteria
- [ ] 4+ output formats available
- [ ] Format selector works
- [ ] Handles empty cells gracefully
- [ ] Shows helpful error messages

---

## Phase 3: Smart Suggestions (2-3 weeks)

### Goals
- Analyze input data structure
- Suggest best format automatically
- Provide reasoning for suggestions

### New Features
1. **Structure Analyzer**: Detect patterns in data
2. **Format Recommender**: Suggest best format with confidence score
3. **Suggestion UI**: Display recommendation with reasoning
4. **Alternative Formats**: Show other viable options

### Implementation Steps

**Week 1: Structure Analyzer**
```typescript
// src/lib/analyzer/structureAnalyzer.ts
export interface StructureMetrics {
  rowCount: number;
  columnCount: number;
  density: number;
  hasHeader: boolean;
  consistentColumns: boolean;
}

export function analyzeStructure(data: string[][]): StructureMetrics {
  const rowCount = data.length;
  const columnCount = Math.max(...data.map(row => row.length));

  const totalCells = rowCount * columnCount;
  const filledCells = data.flat().filter(cell => cell?.trim()).length;
  const density = filledCells / totalCells;

  // Heuristic: first row is different type = header
  const hasHeader = detectHeader(data);

  const consistentColumns = data.every(row => row.length === columnCount);

  return { rowCount, columnCount, density, hasHeader, consistentColumns };
}
```

**Week 2: Format Recommender**
```typescript
// src/lib/recommender/formatRecommender.ts
export interface FormatRecommendation {
  format: OutputFormat;
  score: number;
  confidence: number;
  reasoning: string[];
}

export function recommendFormat(
  data: string[][],
  metrics: StructureMetrics
): FormatRecommendation[] {
  const recommendations: FormatRecommendation[] = [];

  // Single column → Plain list
  if (metrics.columnCount === 1) {
    recommendations.push({
      format: 'plain_list',
      score: 90,
      confidence: 0.95,
      reasoning: ['Single column data works best as a simple list']
    });
  }

  // Two columns → Key-value or JSON
  if (metrics.columnCount === 2) {
    recommendations.push({
      format: 'json_flat',
      score: 85,
      confidence: 0.9,
      reasoning: ['Two columns detected', 'Could be key-value pairs']
    });
  }

  // Multiple columns, consistent → Table
  if (metrics.columnCount > 2 && metrics.consistentColumns) {
    recommendations.push({
      format: 'markdown_table',
      score: 80,
      confidence: 0.85,
      reasoning: ['Consistent tabular structure', 'Multiple columns with regular rows']
    });
  }

  return recommendations.sort((a, b) => b.score - a.score);
}
```

**Week 3: Suggestion UI**
```typescript
// src/components/ControlPanel/SuggestionCard.tsx
export function SuggestionCard({ suggestion }: { suggestion: FormatRecommendation }) {
  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <span className="format-badge">{suggestion.format}</span>
        <span className="confidence">
          {Math.round(suggestion.confidence * 100)}% confident
        </span>
      </div>

      <div className="reasoning">
        <p className="label">Why this format?</p>
        <ul>
          {suggestion.reasoning.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </div>

      <button className="use-suggestion">Use This Format</button>
    </div>
  );
}
```

### Success Criteria
- [ ] Detects 5+ common patterns
- [ ] Suggestions are accurate >80% of the time
- [ ] Users understand reasoning
- [ ] Can override suggestion

---

## Phase 4: Advanced Transformations (2-3 weeks)

### Goals
- Support complex transformations
- Handle hierarchical data
- Transpose functionality

### New Features
1. **Transpose**: Flip rows and columns
2. **Hierarchical List**: For bucket/category data
3. **Nested JSON**: For parent-child relationships
4. **Document Format**: For text-heavy data

### Implementation Steps

**Week 1: Transpose**
```typescript
// src/lib/operations/transpose.ts
export function transpose(data: string[][]): string[][] {
  const rows = data.length;
  const cols = Math.max(...data.map(row => row.length));

  const transposed: string[][] = [];

  for (let col = 0; col < cols; col++) {
    const newRow: string[] = [];
    for (let row = 0; row < rows; row++) {
      newRow.push(data[row][col] || '');
    }
    transposed.push(newRow);
  }

  return transposed;
}
```

**Week 2: Hierarchical Formatters**
```typescript
// src/lib/transformers/toMarkdownHierarchical.ts
export function toMarkdownHierarchical(data: string[][]): string {
  const [headers, ...rows] = data;
  let md = '';

  headers.forEach((header, colIndex) => {
    md += `## ${header}\n\n`;

    const items = rows
      .map(row => row[colIndex])
      .filter(cell => cell?.trim());

    items.forEach(item => {
      md += `- ${item}\n`;
    });

    md += '\n';
  });

  return md;
}
```

**Week 3: Nested JSON**
```typescript
// src/lib/transformers/toJSONNested.ts
export function toJSONNested(data: string[][]): string {
  // Detect grouping column (has repeating values)
  const grouped = groupByFirstColumn(data);

  const nested = Object.entries(grouped).map(([key, items]) => ({
    [data[0][0]]: key,
    items: items
  }));

  return JSON.stringify(nested, null, 2);
}
```

### Success Criteria
- [ ] Transpose works correctly
- [ ] Hierarchical format handles category data
- [ ] Nested JSON preserves relationships
- [ ] Document format good for long text

---

## Phase 5: Content Analysis (2 weeks)

### Goals
- Analyze cell content, not just structure
- Better format suggestions based on content type
- Handle text-heavy vs numeric data differently

### New Features
1. **Content Analyzer**: Detect data types, text length, patterns
2. **Enhanced Recommendations**: Use content analysis
3. **Special Handling**: URLs, dates, code snippets

### Implementation Steps

**Week 1: Content Analysis**
```typescript
// src/lib/analyzer/contentAnalyzer.ts
export interface ContentMetrics {
  columns: ColumnProfile[];
  hasLongText: boolean;
  hasCode: boolean;
  hasURLs: boolean;
  isNumericHeavy: boolean;
}

export interface ColumnProfile {
  index: number;
  dominantType: CellType;
  avgLength: number;
  maxLength: number;
  sampleValues: string[];
}

export function analyzeContent(data: string[][]): ContentMetrics {
  const columns = analyzeColumns(data);

  const hasLongText = columns.some(col => col.avgLength > 100);
  const hasCode = detectCode(data);
  const hasURLs = detectURLs(data);
  const isNumericHeavy = columns.filter(col =>
    col.dominantType === 'number'
  ).length / columns.length > 0.5;

  return { columns, hasLongText, hasCode, hasURLs, isNumericHeavy };
}
```

**Week 2: Enhanced Suggestions**
```typescript
// Update recommender to use content analysis
export function recommendFormat(
  data: string[][],
  structureMetrics: StructureMetrics,
  contentMetrics: ContentMetrics
): FormatRecommendation[] {
  const recommendations: FormatRecommendation[] = [];

  // Text-heavy content → Document format
  if (contentMetrics.hasLongText) {
    recommendations.push({
      format: 'markdown_document',
      score: 90,
      confidence: 0.92,
      reasoning: [
        'Long text content detected',
        'LLMs process documents better than tables for text-heavy data'
      ]
    });
  }

  // Code snippets → Preserve with code blocks
  if (contentMetrics.hasCode) {
    // Special handling
  }

  // Mix with structure-based suggestions
  // ...

  return recommendations.sort((a, b) => b.score - a.score);
}
```

### Success Criteria
- [ ] Detects 6+ content types
- [ ] Suggestions account for content type
- [ ] Better accuracy on text-heavy data
- [ ] Special handling for URLs/code

---

## Phase 6: Edge Case Handling (2 weeks)

### Goals
- Handle edge cases gracefully
- Provide helpful error messages
- Validate and clean data

### New Features
1. **Data Validation**: Check for issues
2. **Auto-cleaning**: Remove empty rows/cols
3. **Warnings**: Alert user to problems
4. **Fix Suggestions**: "Would you like to remove empty rows?"

### Implementation Steps

**Week 1: Validation**
```typescript
// src/lib/validator/dataValidator.ts
export interface ValidationResult {
  isValid: boolean;
  warnings: Warning[];
  errors: Error[];
  suggestions: Suggestion[];
}

export interface Warning {
  type: 'empty_rows' | 'inconsistent_columns' | 'special_chars';
  message: string;
  affectedRows?: number[];
}

export function validateData(data: string[][]): ValidationResult {
  const warnings: Warning[] = [];

  // Check for empty rows
  const emptyRows = data
    .map((row, i) => ({ row, index: i }))
    .filter(({ row }) => row.every(cell => !cell?.trim()))
    .map(({ index }) => index);

  if (emptyRows.length > 0) {
    warnings.push({
      type: 'empty_rows',
      message: `${emptyRows.length} empty rows detected`,
      affectedRows: emptyRows
    });
  }

  // Check for inconsistent columns
  const columnCounts = data.map(row => row.length);
  const inconsistent = new Set(columnCounts).size > 1;

  if (inconsistent) {
    warnings.push({
      type: 'inconsistent_columns',
      message: 'Rows have different numbers of columns'
    });
  }

  return { isValid: true, warnings, errors: [], suggestions: [] };
}
```

**Week 2: Auto-cleaning**
```typescript
// src/lib/operations/clean.ts
export function removeEmptyRows(data: string[][]): string[][] {
  return data.filter(row => row.some(cell => cell?.trim()));
}

export function removeEmptyColumns(data: string[][]): string[][] {
  const cols = Math.max(...data.map(row => row.length));
  const emptyCols: number[] = [];

  for (let col = 0; col < cols; col++) {
    const isEmpty = data.every(row => !row[col]?.trim());
    if (isEmpty) emptyCols.push(col);
  }

  return data.map(row =>
    row.filter((_, i) => !emptyCols.includes(i))
  );
}
```

### Success Criteria
- [ ] Detects 10+ edge cases
- [ ] Provides helpful warnings
- [ ] Auto-cleaning works correctly
- [ ] Users can accept/reject fixes

---

## Phase 7: User Experience Polish (2 weeks)

### Goals
- Smooth, delightful user experience
- Keyboard shortcuts
- Undo/redo
- Preferences

### New Features
1. **Keyboard Shortcuts**: Quick actions
2. **Undo/Redo**: History navigation
3. **Preferences**: Save user settings
4. **Dark Mode**: Theme support
5. **Examples**: Preset examples to try

### Implementation Steps

**Week 1: Keyboard Shortcuts + History**
```typescript
// src/hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C: Copy output
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.shiftKey) {
        // Only if output panel has focus
      }

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        // Undo
      }

      // Ctrl/Cmd + Shift + Z: Redo
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        // Redo
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);
}
```

**Week 2: Preferences + Polish**
```typescript
// src/hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// src/store/preferencesStore.ts
export const usePreferencesStore = create<PreferencesStore>((set) => ({
  theme: 'light',
  defaultFormat: 'markdown_table',
  autoClean: true,
  setTheme: (theme) => set({ theme }),
  setDefaultFormat: (format) => set({ defaultFormat: format }),
}));
```

### Success Criteria
- [ ] Keyboard shortcuts work
- [ ] Undo/redo functional
- [ ] Preferences persist
- [ ] Dark mode looks good
- [ ] Examples are helpful

---

## Phase 8: Advanced Features (Ongoing)

### Potential Features
1. **Batch Processing**: Multiple tables at once
2. **Templates**: Save transformation recipes
3. **Export Options**: Save as file, not just copy
4. **Syntax Highlighting**: Better code display
5. **Preview Mode**: See how LLM will interpret
6. **Pattern Library**: Community-contributed patterns
7. **Browser Extension**: Transform data directly in Excel/Sheets
8. **API Mode**: URL parameters for programmatic use

### Prioritization
Based on user feedback and usage analytics:
- Most requested features first
- Quick wins (high value, low effort) early
- Complex features later

---

## Deployment Strategy

### Continuous Deployment
- Every merge to `main` → Deploy to GitHub Pages
- Automatic via GitHub Actions
- No manual deployment steps

### Versioning
- Semantic versioning: MAJOR.MINOR.PATCH
- Tag releases in Git
- Changelog for each release

### Monitoring
- No backend analytics (privacy-first)
- Optional: Anonymous usage stats via client-side ping
- GitHub Stars/Forks as success metric
- User feedback via GitHub Issues

---

## Success Metrics by Phase

### Phase 1 (MVP)
- [ ] 10+ people use it
- [ ] 0 critical bugs
- [ ] Deployed and accessible

### Phase 2 (Multiple Formats)
- [ ] 50+ users
- [ ] Users try multiple formats
- [ ] Positive feedback on format options

### Phase 3 (Smart Suggestions)
- [ ] 100+ users
- [ ] Suggestions accepted 70%+ of the time
- [ ] Users say "it guessed right"

### Phase 4-5
- [ ] 500+ users
- [ ] Handles complex data correctly
- [ ] "Can't live without it" feedback

### Phase 6-7
- [ ] 1000+ users
- [ ] Edge cases handled well
- [ ] Polish noted in feedback

---

## Risk Mitigation

### Technical Risks
- **Large datasets**: Implement chunking, show warnings
- **Browser compatibility**: Test on all major browsers
- **Performance**: Use Web Workers if needed

### User Adoption Risks
- **Too complex**: Keep MVP simple, add gradually
- **Unclear value**: Clear examples and use cases
- **Competition**: Focus on LLM-specific optimization

---

## Getting Started

### For First-Time Contributors

**Start here:**
1. Set up development environment (Phase 0)
2. Implement basic parser (Phase 1, Day 1-2)
3. Build simple UI (Phase 1, Day 3-5)
4. Deploy MVP (Phase 1, Week 2)

**Good first issues:**
- Add new formatter (e.g., CSV output)
- Improve error messages
- Add tests for edge cases
- UI polish and styling
- Documentation improvements

### For Maintainers

**Focus areas:**
1. Review PRs promptly
2. Triage issues by phase
3. Maintain roadmap
4. Gather user feedback
5. Update docs

---

## Timeline Summary

| Phase | Duration | Cumulative | Key Deliverable |
|-------|----------|------------|-----------------|
| Phase 0 | 1-2 days | ~1 week | Project setup |
| Phase 1 | 1-2 weeks | ~3 weeks | MVP deployed |
| Phase 2 | 2-3 weeks | ~6 weeks | Multiple formats |
| Phase 3 | 2-3 weeks | ~9 weeks | Smart suggestions |
| Phase 4 | 2-3 weeks | ~12 weeks | Advanced transforms |
| Phase 5 | 2 weeks | ~14 weeks | Content analysis |
| Phase 6 | 2 weeks | ~16 weeks | Edge case handling |
| Phase 7 | 2 weeks | ~18 weeks | UX polish |
| Phase 8 | Ongoing | - | Advanced features |

**Estimated time to production-ready: 4-5 months**
**Estimated time to MVP: 2-3 weeks**

---

## Next Steps

1. ✅ Complete documentation
2. ⏭️ Set up project (Phase 0)
3. ⏭️ Build MVP (Phase 1)
4. ⏭️ Get first users and feedback
5. ⏭️ Iterate based on feedback

Let's build something useful! 🚀
