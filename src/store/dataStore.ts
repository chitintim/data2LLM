import { create } from 'zustand';
import type { ParsedData } from '@/lib/types';
import { OutputFormat } from '@/lib/types';
import { parseTSV } from '@/lib/parser';
import { toMarkdownTable, detectHeader } from '@/lib/transformers';
import { fillAllMergedCells, type MergedCellStats } from '@/lib/operations';

interface DataStore {
  // Input data
  inputData: string;
  parsedData: ParsedData;
  processedData: ParsedData; // After filling merged cells

  // Output data
  outputData: string;
  selectedFormat: OutputFormat;

  // Settings
  hasHeader: boolean;

  // Merged cell info
  mergedCellStats: MergedCellStats | null;

  // Error state
  error: string | null;

  // Actions
  setInputData: (data: string) => void;
  setFormat: (format: OutputFormat) => void;
  clearData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  // Initial state
  inputData: '',
  parsedData: [],
  processedData: [],
  outputData: '',
  selectedFormat: OutputFormat.MARKDOWN_TABLE,
  hasHeader: true,
  mergedCellStats: null,
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
          processedData: [],
          outputData: '',
          hasHeader: true,
          mergedCellStats: null,
          error: null,
        });
        return;
      }

      // Fill merged cells (auto-duplicate values)
      const fillResult = fillAllMergedCells(parsed);
      const processedData = fillResult.data;

      // Detect if first row is header
      const hasHeader = detectHeader(processedData);

      // Transform to markdown (default format)
      const output = toMarkdownTable(processedData, hasHeader);

      // Update state
      set({
        inputData: data,
        parsedData: parsed, // Original parsed data
        processedData, // After filling merged cells
        hasHeader,
        outputData: output,
        mergedCellStats: fillResult.stats,
        error: null,
      });
    } catch (err) {
      // Handle any errors during parsing/transformation
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  },

  setFormat: (format: OutputFormat) => {
    // TODO: Transform data to selected format
    set({ selectedFormat: format });
  },

  clearData: () => {
    set({
      inputData: '',
      parsedData: [],
      processedData: [],
      outputData: '',
      selectedFormat: OutputFormat.MARKDOWN_TABLE,
      hasHeader: true,
      mergedCellStats: null,
      error: null,
    });
  },
}));
