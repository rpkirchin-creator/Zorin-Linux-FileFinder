/**
 * @file fileMatcher.ts
 * @description Evaluates the current FilterState against the in-memory simulated Linux filesystem.
 * Returns matched files, scanned totals, simulated execution latency (ms),
 * and triggers simulated 'Permission denied' errors if protected system paths are scanned
 * without error suppression (2>/dev/null) or -readable tests.
 */

import { FilterState, MockFile } from '../types/search';
import { SIMULATED_FILES } from '../data/simulatedFileSystem';
import { getEffectiveExtensions } from './commandGenerators';

export interface SearchEvaluationResult {
  matches: MockFile[];
  totalScanned: number;
  timeMs: number;
  permissionErrors: string[];
}

/**
 * Filters the virtual filesystem according to user-selected rules.
 */
export function evaluateSearch(filters: FilterState): SearchEvaluationResult {
  const startTime = performance.now();
  const permissionErrors: string[] = [];

  const pathPrefix = filters.searchPath === '~' ? '/home/zorin' : (filters.searchPath === '.' ? '/home/zorin' : filters.searchPath);

  // Effective extensions from active category or custom input
  const extList = getEffectiveExtensions(filters);

  const matches = SIMULATED_FILES.filter(file => {
    // 1. Path prefix evaluation
    if (pathPrefix && pathPrefix !== '/' && !file.path.startsWith(pathPrefix)) {
      return false;
    }

    // 2. Permission check: Simulated root privilege check
    // If the file requires root and the user has NOT suppressed errors,
    // we emit a realistic 'find: ...: Permission denied' warning!
    if (file.requiresRoot) {
      if (!filters.suppressErrors && !filters.readableOnly) {
        permissionErrors.push(`find: ‘${file.path}’: Permission denied`);
      }
      if (filters.readableOnly) {
        return false;
      }
    }

    // 3. Hidden dotfiles evaluation
    if (!filters.includeHidden && file.isHidden) {
      return false;
    }

    // 4. File type check (file vs directory vs executable)
    if (filters.fileType === 'file' && file.isDirectory) return false;
    if (filters.fileType === 'directory' && !file.isDirectory) return false;
    if (filters.fileType === 'executable' && !file.isExecutable) return false;

    // 5. Extension matching
    if (extList.length > 0) {
      if (!extList.includes(file.extension.toLowerCase())) {
        return false;
      }
    }

    // 6. Name search matching (contains / glob / exact)
    if (filters.searchName.trim()) {
      const q = filters.caseSensitive ? filters.searchName.trim() : filters.searchName.trim().toLowerCase();
      const fn = filters.caseSensitive ? file.name : file.name.toLowerCase();

      if (filters.nameMatchType === 'exact') {
        if (fn !== q) return false;
      } else if (filters.nameMatchType === 'glob') {
        const regexStr = q.replace(/\*/g, '.*').replace(/\?/g, '.');
        try {
          const reg = new RegExp(`^${regexStr}$`, filters.caseSensitive ? '' : 'i');
          if (!reg.test(fn)) return false;
        } catch {
          if (!fn.includes(q)) return false;
        }
      } else {
        if (!fn.includes(q)) return false;
      }
    }

    // 7. Size filter boundary check
    if (filters.sizeFilter !== 'any') {
      const b = file.sizeBytes;
      if (filters.sizeFilter === 'tiny' && b >= 10 * 1024) return false;
      if (filters.sizeFilter === 'small' && b >= 1024 * 1024) return false;
      if (filters.sizeFilter === 'medium' && (b < 1024 * 1024 || b > 100 * 1024 * 1024)) return false;
      if (filters.sizeFilter === 'large' && b < 100 * 1024 * 1024) return false;
      if (filters.sizeFilter === 'huge' && b < 1024 * 1024 * 1024) return false;
      if (filters.sizeFilter === 'custom') {
        const mult = filters.customSizeUnit === 'KB' ? 1024 : filters.customSizeUnit === 'MB' ? 1024 * 1024 : 1024 * 1024 * 1024;
        const targetBytes = filters.customSizeValue * mult;
        if (filters.customSizeOp === '>' && b <= targetBytes) return false;
        if (filters.customSizeOp === '<' && b >= targetBytes) return false;
      }
    }

    // 8. Date modified comparison
    if (filters.dateFilter !== 'any') {
      const fileTime = new Date(file.modifiedDate).getTime();
      const now = new Date('2026-11-11T09:40:00Z').getTime();
      const ageHours = (now - fileTime) / (3600 * 1000);
      const ageDays = ageHours / 24;

      if (filters.dateFilter === 'today' && ageHours > 24) return false;
      if (filters.dateFilter === '7days' && ageDays > 7) return false;
      if (filters.dateFilter === '30days' && ageDays > 30) return false;
      if (filters.dateFilter === 'older_1year' && ageDays < 365) return false;
    }

    // 9. Text content search (simulating grep / ripgrep)
    if (filters.contentSearch.trim()) {
      if (!file.contentSnippet) return false;
      const target = filters.contentCaseSensitive ? filters.contentSearch.trim() : filters.contentSearch.trim().toLowerCase();
      const haystack = filters.contentCaseSensitive ? file.contentSnippet : file.contentSnippet.toLowerCase();
      if (!haystack.includes(target)) return false;
    }

    return true;
  });

  const endTime = performance.now();
  // Simulated execution time in milliseconds
  const simulatedTime = Math.max(1, Math.round((endTime - startTime) * 1.5 + 4));

  return {
    matches,
    totalScanned: SIMULATED_FILES.length,
    timeMs: simulatedTime,
    permissionErrors,
  };
}
