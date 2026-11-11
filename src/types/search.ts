/**
 * @file search.ts
 * @description Core TypeScript types for the Linux & Zorin OS search workbench.
 * Defines filter options, command generators, flag breakdowns, and mock file objects.
 */

/**
 * How file names are matched:
 * - 'contains': substring matching (e.g., 'report' matches 'quarterly_report_2026.pdf')
 * - 'glob': shell wildcard matching (e.g., '*.pdf', 'tax_??.txt')
 * - 'exact': complete name match (e.g., '.bashrc')
 * - 'regex': full regular expression pattern
 */
export type NameMatchType = 'contains' | 'glob' | 'exact' | 'regex';

/**
 * High-level extension categories
 */
export type ExtensionGroup = 'all' | 'txt' | 'jpg' | 'zip' | 'rar' | 'documents' | 'media' | 'code' | 'archives' | 'custom';

/**
 * File size threshold presets
 */
export type SizeFilterType = 'any' | 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'custom';

/**
 * Time elapsed since modification date
 */
export type DateFilterType = 'any' | 'today' | '7days' | '30days' | '90days' | 'older_1year';

/**
 * Linux file system entry types (-type f / d / l / x)
 */
export type FileTypeFilter = 'all' | 'file' | 'directory' | 'symlink' | 'executable';

/**
 * Comprehensive filter state bound to visual controls
 */
export interface FilterState {
  searchPath: string;            // Directory to search in (e.g., '~', '.', '/var/log')
  searchName: string;            // Name query or pattern
  nameMatchType: NameMatchType;  // Matching strategy
  caseSensitive: boolean;        // Whether case matters (-name vs -iname)
  extensionGroup: ExtensionGroup;// Active extension preset or group
  customExtensions: string;      // Comma/space separated custom extensions
  sizeFilter: SizeFilterType;    // Size range preset
  customSizeOp: '>' | '<';       // Custom size boundary direction
  customSizeValue: number;       // Custom numeric size value
  customSizeUnit: 'KB' | 'MB' | 'GB'; // Unit
  dateFilter: DateFilterType;    // Modified date range
  fileType: FileTypeFilter;      // Entry type
  contentSearch: string;         // Search text inside file bodies (ripgrep / grep)
  contentCaseSensitive: boolean; // Case sensitivity for content grep
  includeHidden: boolean;        // Include dotfiles (.bashrc, .config)
  suppressErrors: boolean;       // Mute 'Permission denied' with 2>/dev/null
  readableOnly: boolean;         // Check read permissions before descending (-readable)
  followSymlinks: boolean;       // Follow symbolic links (-L)
  maxDepth: number | null;       // Restrict directory recursion levels
  action: 'print' | 'fzf_preview' | 'open_editor' | 'xargs_delete' | 'export_list';
}

/**
 * Explanatory breakdown for an individual command-line flag
 */
export interface FlagExplanation {
  flag: string;
  meaning: string;
  detail: string;
}

/**
 * Generated command bundle ready for terminal execution or display
 */
export interface GeneratedCommand {
  tool: 'fd' | 'find' | 'fzf' | 'ripgrep' | 'fsearch';
  title: string;
  command: string;
  description: string;
  recommended: boolean;
  flags: FlagExplanation[];
  requiresSudo: boolean;
  speedRating: 'Instant' | 'Blazing' | 'Fast' | 'Moderate';
}

/**
 * Representation of a virtual Linux file entry
 */
export interface MockFile {
  id: string;
  path: string;
  name: string;
  extension: string;
  sizeBytes: number;
  modifiedDate: string; // ISO 8601 string
  isDirectory: boolean;
  isExecutable?: boolean;
  isSymlink?: boolean;
  isHidden?: boolean;
  requiresRoot?: boolean;
  contentSnippet?: string;
  permissions?: string;
  owner?: string;
  mimeType?: string;
  previewContent?: string;
  archiveContents?: string[];
  imageDimensions?: string;
  pageCount?: number;
}
