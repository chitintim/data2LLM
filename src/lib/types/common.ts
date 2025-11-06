/**
 * Common types used throughout the application
 */

// Cell type represents a single cell value
export type Cell = string;

// ParsedData represents the parsed spreadsheet data
export type ParsedData = Cell[][];

// Output format options
export enum OutputFormat {
  MARKDOWN_TABLE = 'markdown_table',
  MARKDOWN_LIST = 'markdown_list',
  MARKDOWN_HIERARCHICAL = 'markdown_hierarchical',
  MARKDOWN_DOCUMENT = 'markdown_document',
  JSON_FLAT = 'json_flat',
  JSON_NESTED = 'json_nested',
  PLAIN_LIST = 'plain_list',
  KEY_VALUE = 'key_value',
}

// Data type of a cell
export enum CellType {
  TEXT_SHORT = 'text_short',
  TEXT_LONG = 'text_long',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  URL = 'url',
  EMAIL = 'email',
  EMPTY = 'empty',
}

// Purpose of the data
export enum DataPurpose {
  DISCUSSION = 'discussion',
  ANALYSIS = 'analysis',
  DOCUMENTATION = 'documentation',
  CONFIGURATION = 'configuration',
  PLANNING = 'planning',
}

// Complexity level
export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
}
