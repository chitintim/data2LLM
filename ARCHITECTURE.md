# Architecture and Technical Approach

## Overview

Data2LLM is designed to intelligently transform various data structures into formats that LLMs can most effectively understand and process. This document outlines the technical architecture, detection algorithms, and transformation strategies.

---

## Core Principles

### 1. Semantic Preservation
The primary goal is to preserve and enhance the semantic meaning of data, not just its structure.

### 2. LLM Optimization
Different LLMs have different strengths:
- **Text understanding**: LLMs excel at processing natural language and structured text
- **Code interpretation**: Can execute/analyze code but adds overhead
- **Pattern recognition**: Great at identifying relationships in well-formatted data
- **Context retention**: Better with clear hierarchies and labels

### 3. Progressive Enhancement
Start with simple detection, layer on sophisticated analysis for complex cases.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Input     │  │   Control    │  │     Output       │   │
│  │   Panel     │  │   Panel      │  │     Panel        │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Parser Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Input Parser (TSV/Excel clipboard format)           │   │
│  │  - Tab detection                                      │   │
│  │  - Row/column extraction                             │   │
│  │  - Data type inference                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Analysis Engine                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Structure   │  │   Content    │  │   Semantic       │  │
│  │  Analyzer    │  │   Analyzer   │  │   Analyzer       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Suggestion Engine                             │
│  - Pattern matching                                          │
│  - Heuristic scoring                                         │
│  - Format recommendation                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Transformation Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐ │
│  │ Markdown │  │   JSON   │  │  List  │  │   Custom     │ │
│  │ Formatter│  │ Formatter│  │ Format │  │  Transformer │ │
│  └──────────┘  └──────────┘  └────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                     [Formatted Output]
```

---

## Data Structure Detection

### Structure Analyzer

Examines the dimensional and relational properties of the data:

#### 1. **Dimensional Analysis**
```typescript
interface DimensionalMetrics {
  rowCount: number;
  columnCount: number;
  density: number; // ratio of filled to total cells
  headerPresent: boolean;
  consistentColumns: boolean;
}
```

**Detection Rules:**
- Single column → Simple list
- Two columns, first is labels → Key-value pairs
- Multiple columns, consistent rows → Tabular data
- Multiple columns, variable rows → Hierarchical or sparse data

#### 2. **Relational Analysis**
```typescript
interface RelationalPattern {
  hasRepeatingValues: boolean; // Indicates potential hierarchical structure
  repeatingColumns: number[]; // Which columns have repeating values
  groupingPotential: GroupingType; // FLAT, HIERARCHICAL, NESTED
}

enum GroupingType {
  FLAT = 'flat',           // No grouping needed
  HIERARCHICAL = 'hierarchical', // Parent-child relationships
  NESTED = 'nested',       // Multiple levels of nesting
  CATEGORICAL = 'categorical'    // Bucket/category based
}
```

**Detection Rules:**
- Repeating values in first column → Grouped/hierarchical data
- Multiple levels of repeating values → Nested structure
- Each column is independent → Categorical/bucket structure

#### 3. **Sparsity Analysis**
```typescript
interface SparsityMetrics {
  emptyRatio: number;
  isIrregular: boolean;
  columnDensities: number[]; // Density per column
}
```

**Detection Rules:**
- High empty ratio (>30%) → Sparse data, needs cleaning
- Irregular column densities → Potentially categorical structure
- Empty cells within otherwise dense data → Intentional structure

### Content Analyzer

Examines the actual content of cells:

#### 1. **Data Type Detection**
```typescript
enum CellType {
  TEXT_SHORT = 'text_short',   // < 50 chars
  TEXT_LONG = 'text_long',     // > 50 chars
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  URL = 'url',
  EMAIL = 'email',
  EMPTY = 'empty'
}

interface ColumnProfile {
  dominantType: CellType;
  mixedTypes: boolean;
  avgLength: number;
  maxLength: number;
}
```

**Detection Rules:**
- Column with >80% numbers → Numeric column
- High average length (>100 chars) → Text-heavy content
- Mixed types → Unstructured or notes column
- URLs/emails → Reference data

#### 2. **Semantic Pattern Detection**
```typescript
interface SemanticPattern {
  isConfiguration: boolean;    // Key-value config data
  isTimeSeries: boolean;       // Temporal data
  isHierarchical: boolean;     // Parent-child relationships
  isCategorical: boolean;      // Buckets/categories
  isDocumentary: boolean;      // Long-form text content
  isListLike: boolean;         // Simple enumeration
}
```

**Detection Heuristics:**

**Configuration Pattern:**
- Two columns
- First column: short text (parameter names)
- Second column: various types (values)
- Row count: 3-20 (typical config size)

**Time Series Pattern:**
- First column/row contains dates or period indicators
- Other columns contain numeric or measurement data
- Regular intervals

**Hierarchical Pattern:**
- Repeating values in parent columns
- Unique values in child columns
- 3+ columns with different cardinality

**Categorical Pattern:**
- Multiple columns with independent lists
- Column headers are category names
- Little to no cross-column relationships

**Documentary Pattern:**
- One or more columns with long text (avg > 100 chars)
- Few columns (2-4)
- ID or reference column present

**List Pattern:**
- Single column
- Multiple rows
- Short text items
- No complex relationships

### Semantic Analyzer

Provides contextual understanding:

```typescript
interface SemanticContext {
  primaryPurpose: DataPurpose;
  structuralComplexity: ComplexityLevel;
  recommendedFormats: FormatRecommendation[];
}

enum DataPurpose {
  DISCUSSION = 'discussion',        // Data for discussing with LLM
  ANALYSIS = 'analysis',            // Data for LLM to analyze
  DOCUMENTATION = 'documentation',   // Reference data
  CONFIGURATION = 'configuration',   // Settings/parameters
  PLANNING = 'planning'             // Tasks/ideas/plans
}

enum ComplexityLevel {
  SIMPLE = 'simple',           // Straightforward transformation
  MODERATE = 'moderate',       // Some decisions needed
  COMPLEX = 'complex'          // Multiple valid approaches
}
```

---

## Format Recommendation Engine

### Scoring System

Each potential format receives a score based on multiple factors:

```typescript
interface FormatScore {
  format: OutputFormat;
  score: number;        // 0-100
  confidence: number;   // 0-1
  reasoning: string[];
  alternatives: OutputFormat[];
}

enum OutputFormat {
  MARKDOWN_TABLE = 'markdown_table',
  MARKDOWN_LIST = 'markdown_list',
  MARKDOWN_HIERARCHICAL = 'markdown_hierarchical',
  MARKDOWN_DOCUMENT = 'markdown_document',
  JSON_FLAT = 'json_flat',
  JSON_NESTED = 'json_nested',
  JSON_ARRAY = 'json_array',
  PLAIN_LIST = 'plain_list',
  KEY_VALUE = 'key_value'
}
```

### Decision Matrix

| Data Characteristics | Recommended Format | Score Factors |
|---------------------|-------------------|---------------|
| Single column, simple items | Plain List | Simplicity (+30), Single dimension (+20) |
| Two columns, labels+values | Key-Value / JSON Flat | Structure match (+40), Clarity (+20) |
| Numeric table, consistent | Markdown Table | Data type (+30), Consistency (+20), Preserves structure (+20) |
| Text-heavy cells | Markdown Document | Readability (+40), LLM processing (+30) |
| Hierarchical structure | JSON Nested / MD Hierarchical | Semantic preservation (+40), Clarity (+30) |
| Categorical buckets | Markdown Hierarchical List | Grouping (+35), Readability (+25) |
| Config/settings | JSON Flat | Semantic match (+45), Standard format (+25) |
| Time series | Depends on analysis need | Variable based on use case |

### Heuristic Rules

```typescript
class FormatRecommender {
  recommend(data: ParsedData, analysis: AnalysisResult): FormatScore[] {
    const scores: FormatScore[] = [];

    // Rule 1: Single column → Plain list
    if (analysis.dimensions.columnCount === 1) {
      scores.push({
        format: OutputFormat.PLAIN_LIST,
        score: 90,
        confidence: 0.95,
        reasoning: ['Single column data is best as a simple list']
      });
    }

    // Rule 2: Two columns with label-value pattern → Key-value or JSON
    if (analysis.dimensions.columnCount === 2 &&
        analysis.content.columns[0].dominantType === CellType.TEXT_SHORT &&
        analysis.dimensions.rowCount < 30) {
      scores.push({
        format: OutputFormat.KEY_VALUE,
        score: 85,
        confidence: 0.9,
        reasoning: ['Two-column label-value pattern detected', 'Small dataset suitable for key-value']
      });
      scores.push({
        format: OutputFormat.JSON_FLAT,
        score: 80,
        confidence: 0.85,
        reasoning: ['Can be structured as JSON object', 'Good for programmatic use']
      });
    }

    // Rule 3: Text-heavy content → Document format
    if (analysis.content.hasLongText && analysis.dimensions.columnCount <= 4) {
      scores.push({
        format: OutputFormat.MARKDOWN_DOCUMENT,
        score: 88,
        confidence: 0.92,
        reasoning: ['Long text content detected', 'LLMs process documents better than tables']
      });
    }

    // Rule 4: Hierarchical pattern → Nested structure
    if (analysis.semantic.isHierarchical) {
      scores.push({
        format: OutputFormat.JSON_NESTED,
        score: 87,
        confidence: 0.88,
        reasoning: ['Hierarchical relationships detected', 'Nested structure preserves relationships']
      });
      scores.push({
        format: OutputFormat.MARKDOWN_HIERARCHICAL,
        score: 85,
        confidence: 0.85,
        reasoning: ['Hierarchical relationships detected', 'Readable nested list format']
      });
    }

    // Rule 5: Categorical/bucket pattern → Hierarchical list
    if (analysis.semantic.isCategorical) {
      scores.push({
        format: OutputFormat.MARKDOWN_HIERARCHICAL,
        score: 92,
        confidence: 0.93,
        reasoning: ['Categorical bucket structure detected', 'Each column represents a category']
      });
    }

    // Rule 6: Numeric table with consistency → Keep as table
    if (analysis.content.isNumericHeavy &&
        analysis.dimensions.consistentColumns &&
        analysis.sparsity.emptyRatio < 0.1) {
      scores.push({
        format: OutputFormat.MARKDOWN_TABLE,
        score: 85,
        confidence: 0.9,
        reasoning: ['Consistent numeric data', 'Table structure adds value', 'Low sparsity']
      });
    }

    // Rule 7: Configuration pattern → JSON
    if (analysis.semantic.isConfiguration) {
      scores.push({
        format: OutputFormat.JSON_FLAT,
        score: 90,
        confidence: 0.92,
        reasoning: ['Configuration pattern detected', 'JSON is standard for configs']
      });
    }

    // Rule 8: Sparse or irregular → Clean and restructure
    if (analysis.sparsity.emptyRatio > 0.3) {
      // Apply cleaning transformation first, then re-evaluate
      scores.forEach(s => s.reasoning.push('Data cleaning recommended first'));
    }

    return scores.sort((a, b) => b.score - a.score);
  }
}
```

---

## Transformation Strategies

### 1. Markdown Table
**When to use:**
- Consistent tabular data
- Numeric or short text content
- Structure adds clarity
- Low sparsity

**Implementation:**
```typescript
function toMarkdownTable(data: Cell[][]): string {
  const headers = data[0];
  const rows = data.slice(1);

  let md = '| ' + headers.join(' | ') + ' |\n';
  md += '|' + headers.map(() => '---').join('|') + '|\n';

  rows.forEach(row => {
    md += '| ' + row.join(' | ') + ' |\n';
  });

  return md;
}
```

### 2. Markdown Hierarchical List
**When to use:**
- Categorical/bucket structure
- Hierarchical relationships
- Planning/organization data

**Implementation:**
```typescript
function toHierarchicalList(data: Cell[][]): string {
  const headers = data[0];
  let md = '';

  headers.forEach((header, colIndex) => {
    md += `## ${header}\n\n`;

    const items = data.slice(1)
      .map(row => row[colIndex])
      .filter(cell => cell && cell.trim());

    items.forEach(item => {
      md += `- ${item}\n`;
    });

    md += '\n';
  });

  return md;
}
```

### 3. Markdown Document
**When to use:**
- Text-heavy content
- Interview responses, notes
- ID/reference + content structure

**Implementation:**
```typescript
function toMarkdownDocument(data: Cell[][]): string {
  const headers = data[0];
  const rows = data.slice(1);
  let md = '';

  rows.forEach((row, index) => {
    md += `## ${headers[0]}: ${row[0]}\n\n`;

    for (let i = 1; i < row.length; i++) {
      md += `**${headers[i]}:** ${row[i]}\n\n`;
    }

    if (index < rows.length - 1) {
      md += '---\n\n';
    }
  });

  return md;
}
```

### 4. JSON Flat
**When to use:**
- Configuration data
- API-style data
- Structured key-value pairs

**Implementation:**
```typescript
function toJSONFlat(data: Cell[][]): string {
  const headers = data[0];
  const rows = data.slice(1);

  const jsonData = rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      const key = header.toLowerCase().replace(/\s+/g, '_');
      obj[key] = inferType(row[index]);
    });
    return obj;
  });

  return JSON.stringify(jsonData, null, 2);
}
```

### 5. JSON Nested
**When to use:**
- Hierarchical relationships
- Parent-child structures
- Multi-level categorization

**Implementation:**
```typescript
function toJSONNested(data: Cell[][], hierarchyColumns: number[]): string {
  // Group by first hierarchy level
  const grouped = groupByColumn(data, hierarchyColumns[0]);

  // Recursively build nested structure
  const nested = buildNestedStructure(grouped, hierarchyColumns.slice(1));

  return JSON.stringify(nested, null, 2);
}
```

### 6. Plain List
**When to use:**
- Single column data
- Simple enumerations
- Minimal formatting needed

**Implementation:**
```typescript
function toPlainList(data: Cell[][]): string {
  const items = data.flat().filter(cell => cell && cell.trim());
  return items.map(item => `- ${item}`).join('\n');
}
```

---

## Transformation Pipeline

```typescript
interface TransformationPipeline {
  steps: TransformationStep[];
}

enum TransformationStep {
  PARSE = 'parse',
  CLEAN = 'clean',          // Remove empty cells, trim whitespace
  NORMALIZE = 'normalize',   // Standardize data types
  TRANSPOSE = 'transpose',   // Flip rows/columns
  GROUP = 'group',          // Group related data
  NEST = 'nest',            // Create hierarchical structure
  FORMAT = 'format'         // Apply output format
}

class DataTransformer {
  transform(data: string, pipeline: TransformationPipeline): string {
    let current = this.parse(data);

    for (const step of pipeline.steps) {
      current = this.applyStep(current, step);
    }

    return current;
  }

  applyStep(data: ParsedData, step: TransformationStep): ParsedData {
    switch(step) {
      case TransformationStep.CLEAN:
        return this.clean(data);
      case TransformationStep.TRANSPOSE:
        return this.transpose(data);
      case TransformationStep.GROUP:
        return this.group(data);
      // ... etc
    }
  }
}
```

---

## User Interface Components

### Input Panel
```typescript
interface InputPanel {
  textArea: HTMLTextAreaElement;
  parser: ClipboardParser;

  onPaste(): void {
    const rawData = this.textArea.value;
    const parsed = this.parser.parse(rawData);

    // Trigger analysis
    eventBus.emit('data:parsed', parsed);
  }
}
```

### Control Panel
```typescript
interface ControlPanel {
  formatSelector: Dropdown;
  transformOptions: CheckboxGroup;
  suggestionDisplay: SuggestionCard;

  onAnalysisComplete(suggestions: FormatScore[]): void {
    this.suggestionDisplay.show(suggestions[0]); // Best suggestion
    this.formatSelector.populate(suggestions);
  }
}
```

### Output Panel
```typescript
interface OutputPanel {
  display: HTMLPreElement;
  copyButton: Button;
  downloadButton: Button;

  update(formattedData: string, format: OutputFormat): void {
    this.display.textContent = formattedData;
    this.applyHighlighting(format);
  }
}
```

---

## Technology Stack

### Frontend Framework
**React with TypeScript**
- Component-based architecture
- Type safety for complex data transformations
- Rich ecosystem

### State Management
**Zustand or Redux Toolkit**
- Manage parsed data, analysis results, user preferences
- Time-travel debugging for undo/redo

### Parsing
**Custom TSV/Excel parser**
- Handle tab-separated values (Excel clipboard format)
- Preserve cell structure
- Handle edge cases (embedded tabs, quotes)

### Styling
**Tailwind CSS**
- Rapid UI development
- Responsive design
- Consistent design system

### Code Highlighting
**Prism.js or Highlight.js**
- Syntax highlighting for JSON output
- Markdown preview

### Build Tools
**Vite**
- Fast development server
- Optimized production builds
- TypeScript support

---

## Performance Considerations

### Large Data Handling
- Stream processing for >1000 rows
- Virtual scrolling for output display
- Web Workers for analysis (non-blocking UI)

### Real-time Updates
- Debounced input processing (300ms)
- Incremental analysis for large datasets
- Progressive rendering

### Caching
- Cache analysis results per input hash
- Remember user format preferences
- Local storage for recent transformations

---

## Future Enhancements

### Machine Learning Integration
- Learn from user corrections
- Improve suggestion accuracy over time
- Custom pattern recognition

### Advanced Features
- Batch processing multiple tables
- Template system for repeated transformations
- API for programmatic access
- Browser extension for direct Excel integration

### Collaboration
- Share transformation recipes
- Community patterns library
- Export/import configurations
