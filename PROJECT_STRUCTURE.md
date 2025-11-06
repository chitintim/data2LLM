# Project Structure

This document defines the folder structure and organization for the Data2LLM project.

---

## Overview

Data2LLM is a single-page application (SPA) that runs entirely in the browser, with no backend required. It will be hosted on GitHub Pages for easy access and deployment.

---

## Folder Structure

```
data2LLM/
├── docs/                          # Documentation
│   ├── USER_STORIES.md
│   ├── ARCHITECTURE.md
│   ├── EDGE_CASES.md
│   ├── PROJECT_STRUCTURE.md
│   └── IMPLEMENTATION_ROADMAP.md
│
├── public/                        # Static assets
│   ├── index.html                # Main HTML file
│   ├── favicon.ico               # Favicon
│   └── assets/                   # Images, fonts, etc.
│       └── logo.svg
│
├── src/                          # Source code
│   ├── index.tsx                 # Application entry point
│   ├── App.tsx                   # Main App component
│   │
│   ├── components/               # React components
│   │   ├── InputPanel/
│   │   │   ├── InputPanel.tsx
│   │   │   ├── InputPanel.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ControlPanel/
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── FormatSelector.tsx
│   │   │   ├── TransformOptions.tsx
│   │   │   ├── SuggestionCard.tsx
│   │   │   ├── ControlPanel.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── OutputPanel/
│   │   │   ├── OutputPanel.tsx
│   │   │   ├── OutputDisplay.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   ├── DownloadButton.tsx
│   │   │   ├── OutputPanel.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── common/               # Shared/reusable components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Toggle.tsx
│   │       └── index.ts
│   │
│   ├── lib/                      # Core logic (framework-agnostic)
│   │   ├── parser/
│   │   │   ├── parseClipboard.ts         # Parse pasted data
│   │   │   ├── detectDelimiter.ts        # Auto-detect delimiter
│   │   │   ├── parseCSV.ts               # CSV parsing
│   │   │   ├── parseTSV.ts               # TSV parsing (Excel format)
│   │   │   ├── types.ts                  # Parser types
│   │   │   ├── parser.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── analyzer/
│   │   │   ├── structureAnalyzer.ts      # Analyze data structure
│   │   │   ├── contentAnalyzer.ts        # Analyze cell content
│   │   │   ├── semanticAnalyzer.ts       # Semantic pattern detection
│   │   │   ├── detectDataTypes.ts        # Type inference
│   │   │   ├── calculateMetrics.ts       # Sparsity, density, etc.
│   │   │   ├── types.ts                  # Analyzer types
│   │   │   ├── analyzer.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── recommender/
│   │   │   ├── formatRecommender.ts      # Suggest best format
│   │   │   ├── scoringEngine.ts          # Score each format option
│   │   │   ├── heuristics.ts             # Detection heuristics
│   │   │   ├── rules.ts                  # Recommendation rules
│   │   │   ├── types.ts                  # Recommender types
│   │   │   ├── recommender.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── transformers/
│   │   │   ├── toMarkdownTable.ts        # MD table formatter
│   │   │   ├── toMarkdownList.ts         # MD list formatter
│   │   │   ├── toMarkdownHierarchical.ts # MD hierarchical formatter
│   │   │   ├── toMarkdownDocument.ts     # MD document formatter
│   │   │   ├── toJSONFlat.ts             # JSON flat formatter
│   │   │   ├── toJSONNested.ts           # JSON nested formatter
│   │   │   ├── toPlainList.ts            # Plain list formatter
│   │   │   ├── toKeyValue.ts             # Key-value formatter
│   │   │   ├── types.ts                  # Transformer types
│   │   │   ├── transformers.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── operations/
│   │   │   ├── transpose.ts              # Transpose data
│   │   │   ├── removeEmpty.ts            # Remove empty cells/rows
│   │   │   ├── fillMerged.ts             # Fill merged cells
│   │   │   ├── normalize.ts              # Normalize data
│   │   │   ├── group.ts                  # Group related data
│   │   │   ├── nest.ts                   # Create nested structure
│   │   │   ├── operations.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── stringUtils.ts            # String manipulation
│   │   │   ├── arrayUtils.ts             # Array helpers
│   │   │   ├── typeUtils.ts              # Type checking/inference
│   │   │   ├── escapeUtils.ts            # Escape special characters
│   │   │   ├── clipboardUtils.ts         # Clipboard operations
│   │   │   ├── downloadUtils.ts          # File download
│   │   │   └── index.ts
│   │   │
│   │   └── types/
│   │       ├── common.ts                 # Common types
│   │       ├── data.ts                   # Data structure types
│   │       ├── format.ts                 # Format types
│   │       └── index.ts
│   │
│   ├── hooks/                    # React hooks
│   │   ├── useDataTransformation.ts      # Main transformation hook
│   │   ├── useClipboard.ts               # Clipboard operations
│   │   ├── useLocalStorage.ts            # Persist preferences
│   │   ├── useDebounce.ts                # Debounce input
│   │   └── index.ts
│   │
│   ├── store/                    # State management (Zustand)
│   │   ├── dataStore.ts                  # Input data state
│   │   ├── analysisStore.ts              # Analysis results state
│   │   ├── outputStore.ts                # Output data state
│   │   ├── preferencesStore.ts           # User preferences state
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── styles/                   # Styling
│   │   ├── globals.css                   # Global styles
│   │   ├── tailwind.css                  # Tailwind imports
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   └── constants/                # Constants and configs
│       ├── formats.ts                    # Format definitions
│       ├── patterns.ts                   # Regex patterns
│       ├── defaults.ts                   # Default values
│       └── index.ts
│
├── tests/                        # Additional test files
│   ├── integration/              # Integration tests
│   │   ├── endToEnd.test.ts
│   │   └── realWorldExamples.test.ts
│   │
│   ├── fixtures/                 # Test data
│   │   ├── examples/
│   │   │   ├── ideaBoard.txt
│   │   │   ├── textHeavyTable.txt
│   │   │   ├── configuration.txt
│   │   │   └── ...
│   │   └── edgeCases/
│   │       ├── multilineCell.txt
│   │       ├── specialChars.txt
│   │       └── ...
│   │
│   └── utils/                    # Test utilities
│       ├── testHelpers.ts
│       └── mockData.ts
│
├── .github/                      # GitHub configuration
│   ├── workflows/
│   │   ├── deploy.yml            # Deploy to GitHub Pages
│   │   ├── test.yml              # Run tests on PR
│   │   └── lint.yml              # Linting
│   │
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── .gitignore                    # Git ignore rules
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite configuration
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Lock file
│
├── README.md                     # Project overview
├── LICENSE                       # MIT License
└── CONTRIBUTING.md               # Contribution guidelines
```

---

## Key Design Decisions

### 1. Component Organization

**Pattern**: Feature-based components in dedicated folders
- Each component gets its own folder with component file, test file, and index
- Promotes co-location of related code
- Makes testing easier

### 2. Separation of Concerns

**Pattern**: `lib/` folder for framework-agnostic logic
- Core transformation logic is independent of React
- Can be tested without UI
- Could be extracted to npm package later
- Makes the logic reusable

### 3. State Management

**Tool**: Zustand
- Lightweight compared to Redux
- TypeScript-friendly
- Simple API
- No boilerplate

**Stores**:
- `dataStore`: Raw input data and parsed data
- `analysisStore`: Analysis results and metrics
- `outputStore`: Formatted output and selected format
- `preferencesStore`: User preferences and settings

### 4. Testing Strategy

**Unit Tests**: Co-located with source files (`*.test.ts`)
- Test core logic (parser, analyzer, transformers)
- Test individual components

**Integration Tests**: In `tests/integration/`
- Test complete transformation pipelines
- Test real-world examples
- Test edge cases

**Fixtures**: In `tests/fixtures/`
- Real data examples
- Edge case data
- Reusable across tests

### 5. Type Safety

**TypeScript throughout**:
- Strict mode enabled
- Explicit types for all public APIs
- Shared types in `lib/types/`
- Component prop types

### 6. Styling Approach

**Tailwind CSS**:
- Utility-first CSS
- Responsive design built-in
- Consistent design system
- Small bundle size (purged unused styles)

**Theme Support**:
- Light and dark themes
- CSS variables for colors
- Respect system preference
- User can override

---

## File Naming Conventions

### Components
- PascalCase: `InputPanel.tsx`
- Test files: `InputPanel.test.tsx`
- Index file for exports: `index.ts`

### Utilities and Logic
- camelCase: `parseClipboard.ts`
- Test files: `parseClipboard.test.ts`
- Type files: `types.ts`

### Constants
- camelCase files: `formats.ts`
- UPPER_CASE exports: `export const DEFAULT_FORMAT = ...`

### Styles
- kebab-case: `global.css`

---

## Import Organization

Standard import order:
```typescript
// 1. External dependencies
import React from 'react';
import { useStore } from 'zustand';

// 2. Internal lib/modules
import { parseClipboard } from '@/lib/parser';
import { analyzeStructure } from '@/lib/analyzer';

// 3. Components
import { Button } from '@/components/common';

// 4. Hooks
import { useDataTransformation } from '@/hooks';

// 5. Types
import type { ParsedData, FormatType } from '@/lib/types';

// 6. Styles
import './InputPanel.css';
```

---

## Module Resolution

Use path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/store/*": ["./src/store/*"],
      "@/utils/*": ["./src/lib/utils/*"]
    }
  }
}
```

Benefits:
- Clean imports
- Easy refactoring
- No relative path hell (`../../../`)

---

## Build and Deployment

### Development
```bash
npm run dev          # Start dev server (Vite)
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
- Automatic via GitHub Actions
- Push to `main` branch triggers deployment
- Builds to `dist/` folder
- Deployed to GitHub Pages

---

## Configuration Files

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/data2LLM/', // GitHub Pages subdirectory
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `tailwind.config.js`
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        // ... more custom colors
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
```

### `package.json` (key scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Performance Considerations

### Code Splitting
```typescript
// Lazy load heavy components
const OutputPanel = lazy(() => import('./components/OutputPanel'));

// Lazy load syntax highlighters (only when needed)
const JSONHighlighter = lazy(() => import('./components/JSONHighlighter'));
```

### Optimization
- Tree-shaking enabled by Vite
- Minimize bundle size
- Lazy load heavy dependencies
- Use Web Workers for heavy processing (future enhancement)

---

## Browser Support

Target modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Using:
- ES2020 features
- Modern JavaScript APIs
- CSS Grid and Flexbox
- Clipboard API (with fallback)

---

## Data Flow

```
User Paste
    ↓
Input Component
    ↓
Parser (lib/parser)
    ↓
Analyzer (lib/analyzer)
    ↓
Recommender (lib/recommender)
    ↓
Transformer (lib/transformers)
    ↓
Output Component
```

State updates flow through stores:
```
inputData → parsedData → analysisResult → formatSuggestions → selectedFormat → outputData
```

---

## Future Considerations

### Potential Additions
- `examples/` folder with preset examples
- `presets/` folder for transformation templates
- Service worker for offline support
- Web Workers for heavy processing
- Internationalization (i18n) support

### Scalability
- Current structure supports up to ~50 components
- Clear separation makes refactoring easy
- Can extract `lib/` to separate package if needed
- Type system makes large refactors safe
