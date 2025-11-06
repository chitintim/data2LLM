import { create } from 'zustand';
import type { ParsedData } from '@/lib/types';
import { parseTSV } from '@/lib/parser';
import { toMarkdownTable, detectHeader } from '@/lib/transformers';

interface DataStore {
  // Input data
  inputData: string;
  parsedData: ParsedData;

  // Output data
  outputData: string;

  // Settings
  hasHeader: boolean;

  // Error state
  error: string | null;

  // Actions
  setInputData: (data: string) => void;
  clearData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  // Initial state
  inputData: '',
  parsedData: [],
  outputData: '',
  hasHeader: true,
  error: null,

  // Actions
  setInputData: (data: string) => {
    try {
      // Parse the input
      const parsed = parseTSV(data);

      // If no data after parsing, clear everything
      if (parsed.length === 0) {
        set({
          inputData: data,
          parsedData: [],
          outputData: '',
          hasHeader: true,
          error: null,
        });
        return;
      }

      // Detect if first row is header
      const hasHeader = detectHeader(parsed);

      // Transform to markdown
      const output = toMarkdownTable(parsed, hasHeader);

      // Update state
      set({
        inputData: data,
        parsedData: parsed,
        hasHeader,
        outputData: output,
        error: null,
      });
    } catch (err) {
      // Handle any errors during parsing/transformation
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  },

  clearData: () => {
    set({
      inputData: '',
      parsedData: [],
      outputData: '',
      hasHeader: true,
      error: null,
    });
  },
}));
