import { create } from 'zustand';
import type { ParsedData } from '@/lib/types';
import { OutputFormat } from '@/lib/types';
import { parseTSV } from '@/lib/parser';
import {
  toMarkdownTable,
  toJSONFlat,
  toMarkdownHierarchical,
  toPlainList,
  detectHeader,
} from '@/lib/transformers';
import { fillAllMergedCells, type MergedCellStats } from '@/lib/operations';

/**
 * Transform data to the selected output format
 */
function transformData(
  data: ParsedData,
  format: OutputFormat,
  hasHeader: boolean
): string {
  if (!data || data.length === 0) {
    return '';
  }

  switch (format) {
    case OutputFormat.MARKDOWN_TABLE:
      return toMarkdownTable(data, hasHeader);

    case OutputFormat.JSON_FLAT:
      return toJSONFlat(data, hasHeader);

    case OutputFormat.MARKDOWN_HIERARCHICAL:
      return toMarkdownHierarchical(data, hasHeader);

    case OutputFormat.PLAIN_LIST:
      return toPlainList(data, hasHeader);

    case OutputFormat.MARKDOWN_LIST:
      return toMarkdownHierarchical(data, hasHeader); // Same as hierarchical for now

    default:
      return toMarkdownTable(data, hasHeader);
  }
}

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

      // Get current format from state (default to MARKDOWN_TABLE)
      const currentFormat = OutputFormat.MARKDOWN_TABLE;

      // Transform to selected format
      const output = transformData(processedData, currentFormat, hasHeader);

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
    set((state) => {
      // Re-transform the processed data with the new format
      const output = transformData(state.processedData, format, state.hasHeader);

      return {
        selectedFormat: format,
        outputData: output,
      };
    });
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
