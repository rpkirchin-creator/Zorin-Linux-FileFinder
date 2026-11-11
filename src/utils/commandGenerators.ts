/**
 * @file commandGenerators.ts
 * @description Generates syntactically correct, optimized Linux search commands for
 * fd (fd-find), fzf (fuzzy finder), GNU find, ripgrep (rg), and FSearch.
 * Also generates detailed flag explanations for teaching and tutorial documentation.
 */

import { FilterState, GeneratedCommand, FlagExplanation } from '../types/search';

/**
 * Generates all command variations simultaneously based on active filter state.
 */
export function generateAllCommands(filters: FilterState): GeneratedCommand[] {
  return [
    generateFdCommand(filters),
    generateFzfCommand(filters),
    generateFindCommand(filters),
    generateRipgrepCommand(filters),
    generateFsearchQuery(filters),
  ];
}

/**
 * 1. FD (fd-find) Generator
 * Written in Rust, fd is 5-10x faster than traditional find.
 * Key advantage for users with admin issues: it skips unreadable directories automatically
 * without generating terminal error spam.
 */
export function generateFdCommand(filters: FilterState): GeneratedCommand {
  const flags: FlagExplanation[] = [];
  const parts: string[] = ['fd'];

  // Hidden files flag (-H / --hidden)
  if (filters.includeHidden) {
    parts.push('-H');
    flags.push({
      flag: '-H (--hidden)',
      meaning: 'Include hidden & dotfiles',
      detail: 'Searches hidden files (like .bashrc, .config) which fd skips by default for speed.'
    });
  }

  // Extensions filter (-e / --extension)
  const extList = getEffectiveExtensions(filters);
  if (extList.length > 0) {
    if (extList.length === 1) {
      parts.push(`-e ${extList[0]}`);
      flags.push({
        flag: `-e ${extList[0]}`,
        meaning: `Filter by extension .${extList[0]}`,
        detail: `Only matches files ending with .${extList[0]} (case-insensitive by default in fd).`
      });
    } else {
      extList.forEach(ext => parts.push(`-e ${ext}`));
      flags.push({
        flag: extList.map(e => `-e ${e}`).join(' '),
        meaning: `Filter by extensions: ${extList.join(', ')}`,
        detail: `Matches any file ending in one of the selected file types.`
      });
    }
  }

  // Size boundary filter (-S / --size)
  const sizeFlag = getFdSizeFlag(filters);
  if (sizeFlag) {
    parts.push(sizeFlag.flag);
    flags.push(sizeFlag.explanation);
  }

  // Date modified filter (--changed-within / --changed-before)
  const dateFlag = getFdDateFlag(filters);
  if (dateFlag) {
    parts.push(dateFlag.flag);
    flags.push(dateFlag.explanation);
  }

  // File type filter (-t / --type f, d, l, x)
  if (filters.fileType === 'file') {
    parts.push('-t f');
    flags.push({ flag: '-t f', meaning: 'Regular files only', detail: 'Excludes directories, symlinks, and device files.' });
  } else if (filters.fileType === 'directory') {
    parts.push('-t d');
    flags.push({ flag: '-t d', meaning: 'Directories only', detail: 'Finds only folder names.' });
  } else if (filters.fileType === 'symlink') {
    parts.push('-t l');
    flags.push({ flag: '-t l', meaning: 'Symlinks only', detail: 'Finds symbolic pointer links.' });
  } else if (filters.fileType === 'executable') {
    parts.push('-t x');
    flags.push({ flag: '-t x', meaning: 'Executable files only', detail: 'Finds binaries and scripts with +x execute permissions.' });
  }

  // Max directory depth (-d / --max-depth)
  if (filters.maxDepth !== null && filters.maxDepth > 0) {
    parts.push(`-d ${filters.maxDepth}`);
    flags.push({
      flag: `-d ${filters.maxDepth}`,
      meaning: `Max depth: ${filters.maxDepth} levels`,
      detail: `Stops recursive directory descent beyond ${filters.maxDepth} folders to save time.`
    });
  }

  // Case sensitivity (-s / --case-sensitive)
  if (filters.caseSensitive) {
    parts.push('-s');
    flags.push({ flag: '-s', meaning: 'Strict case-sensitivity', detail: 'Disables default smart-case and requires exact casing.' });
  }

  // Name query pattern
  let pattern = filters.searchName.trim();
  if (!pattern) {
    pattern = '.';
  } else if (filters.nameMatchType === 'exact') {
    pattern = `^${escapeRegex(pattern)}$`;
  } else if (filters.nameMatchType === 'glob') {
    parts.push('-g');
    flags.push({ flag: '-g', meaning: 'Glob pattern mode', detail: 'Treats the search term as a shell glob wildcard (e.g. *test*).' });
  }

  parts.push(`'${pattern}'`);

  // Target directory path
  const targetPath = filters.searchPath || '.';
  if (targetPath !== '.') {
    parts.push(targetPath);
  }

  // Post-search action pipeline
  let fullCmd = parts.join(' ');
  if (filters.action === 'fzf_preview') {
    fullCmd += " | fzf --preview 'bat --style=numbers --color=always {} 2>/dev/null || cat {}'";
    flags.push({
      flag: "| fzf --preview '...'",
      meaning: 'Interactive Fuzzy Picker with Live Preview',
      detail: 'Pipes the results into fzf with syntax-highlighted preview using bat or cat.'
    });
  } else if (filters.action === 'xargs_delete') {
    fullCmd += ' -X rm -I';
    flags.push({
      flag: '-X rm -I',
      meaning: 'Batch delete with confirmation prompt',
      detail: 'Safely prompts before deleting all matched files.'
    });
  } else if (filters.action === 'open_editor') {
    fullCmd += ' -X xdg-open';
    flags.push({
      flag: '-X xdg-open',
      meaning: 'Open matched files in default GUI application',
      detail: 'Uses Zorin OS desktop handler (document viewer, image viewer, or text editor).'
    });
  } else if (filters.action === 'export_list') {
    fullCmd += ' > search_results.txt';
    flags.push({
      flag: '> search_results.txt',
      meaning: 'Export results to file',
      detail: 'Redirects terminal output to search_results.txt in the current directory.'
    });
  }

  return {
    tool: 'fd',
    title: 'fd (fd-find)',
    command: fullCmd,
    description: 'Modern Rust-powered replacement for find. 5x-10x faster, colors results, ignores unreadable folders without admin errors.',
    recommended: true,
    flags,
    requiresSudo: false,
    speedRating: 'Blazing',
  };
}

/**
 * 2. FZF Interactive Finder Command
 */
export function generateFzfCommand(filters: FilterState): GeneratedCommand {
  const flags: FlagExplanation[] = [];
  const targetPath = filters.searchPath || '.';
  const extList = getEffectiveExtensions(filters);

  let baseFd = `fd --type f`;
  flags.push({ flag: 'fd --type f', meaning: 'Fast file list generator', detail: 'Supplies file paths to fzf in milliseconds.' });

  if (filters.includeHidden) {
    baseFd += ' -H';
    flags.push({ flag: '-H', meaning: 'Include hidden files', detail: 'Shows dotfiles in fuzzy picker.' });
  }

  if (extList.length > 0) {
    baseFd += ` -e ${extList[0]}`;
  }

  if (targetPath !== '.') {
    baseFd += ` . ${targetPath}`;
  }

  let fzfQuery = '';
  if (filters.searchName.trim()) {
    fzfQuery = ` -q '${filters.searchName.trim()}'`;
    flags.push({
      flag: `-q '${filters.searchName.trim()}'`,
      meaning: 'Initial query',
      detail: 'Pre-fills the interactive fuzzy search bar with your query.'
    });
  }

  const cmd = `${baseFd} | fzf${fzfQuery} --preview 'bat --style=numbers --color=always {} 2>/dev/null || head -n 50 {}' --bind 'ctrl-/:toggle-preview'`;
  flags.push({
    flag: "--preview 'bat ... || head ...'",
    meaning: 'Instant file preview pane',
    detail: 'Shows the contents or metadata of the highlighted file without opening it.'
  });
  flags.push({
    flag: "--bind 'ctrl-/:toggle-preview'",
    meaning: 'Toggle preview hotkey',
    detail: 'Press Ctrl+/ in terminal to hide or show the preview split pane.'
  });

  return {
    tool: 'fzf',
    title: 'fzf (Interactive Fuzzy Finder)',
    command: cmd,
    description: 'Live interactive search as you type directly in your terminal, with full file preview. The fastest workflow once mastered.',
    recommended: false,
    flags,
    requiresSudo: false,
    speedRating: 'Instant',
  };
}

/**
 * 3. GNU Find Generator (POSIX Universal Standard)
 * Includes 2>/dev/null and -readable handling to solve the user's admin issues!
 */
export function generateFindCommand(filters: FilterState): GeneratedCommand {
  const flags: FlagExplanation[] = [];
  const parts: string[] = ['find'];

  const targetPath = filters.searchPath || '.';
  parts.push(targetPath);

  // Depth limit (-maxdepth N)
  if (filters.maxDepth !== null && filters.maxDepth > 0) {
    parts.push(`-maxdepth ${filters.maxDepth}`);
    flags.push({
      flag: `-maxdepth ${filters.maxDepth}`,
      meaning: `Limit search depth to ${filters.maxDepth} levels`,
      detail: 'Crucial for speed when searching root or large home folders.'
    });
  }

  // Readable only test (Admin issue fix!)
  if (filters.readableOnly) {
    parts.push('-readable');
    flags.push({
      flag: '-readable',
      meaning: 'Current user readable only',
      detail: 'Only searches files and folders current user has read permissions for (prevents admin permission locks).'
    });
  }

  // File type
  if (filters.fileType === 'file') {
    parts.push('-type f');
    flags.push({ flag: '-type f', meaning: 'Regular files only', detail: 'Ignores folders, sockets, and character devices.' });
  } else if (filters.fileType === 'directory') {
    parts.push('-type d');
    flags.push({ flag: '-type d', meaning: 'Directories only', detail: 'Only searches for folder names.' });
  } else if (filters.fileType === 'symlink') {
    parts.push('-type l');
    flags.push({ flag: '-type l', meaning: 'Symlinks only', detail: 'Only searches for symbolic links.' });
  }

  // Name & Extension filter
  const extList = getEffectiveExtensions(filters);
  const nameQuery = filters.searchName.trim();

  if (extList.length > 0 && !nameQuery) {
    if (extList.length === 1) {
      parts.push(`-iname "*.${extList[0]}"`);
      flags.push({ flag: `-iname "*.${extList[0]}"`, meaning: `Case-insensitive extension match`, detail: 'Matches files ending with .' + extList[0] });
    } else {
      const extConditions = extList.map(ext => `-iname "*.${ext}"`).join(' -o ');
      parts.push(`\\( ${extConditions} \\)`);
      flags.push({ flag: `\\( -iname ... -o ... \\)`, meaning: `Multiple extension match (OR logic)`, detail: 'Matches any of: ' + extList.join(', ') });
    }
  } else if (nameQuery) {
    const caseFlag = filters.caseSensitive ? '-name' : '-iname';
    let pattern = `*${nameQuery}*`;
    if (filters.nameMatchType === 'glob' || filters.nameMatchType === 'exact') {
      pattern = nameQuery;
    }
    parts.push(`${caseFlag} "${pattern}"`);
    flags.push({
      flag: `${caseFlag} "${pattern}"`,
      meaning: filters.caseSensitive ? 'Case-sensitive name match' : 'Case-insensitive name match',
      detail: `Matches file names containing pattern "${pattern}".`
    });
  }

  // Size filter (-size)
  const findSize = getFindSizeFlag(filters);
  if (findSize) {
    parts.push(findSize.flag);
    flags.push(findSize.explanation);
  }

  // Date filter (-mtime)
  const findDate = getFindDateFlag(filters);
  if (findDate) {
    parts.push(findDate.flag);
    flags.push(findDate.explanation);
  }

  // Content search (grep)
  if (filters.contentSearch.trim()) {
    const grepCase = filters.contentCaseSensitive ? '' : '-i';
    parts.push(`-exec grep ${grepCase} -l "${filters.contentSearch.trim()}" {} +`);
    flags.push({
      flag: `-exec grep ${grepCase} -l "${filters.contentSearch.trim()}" {} +`,
      meaning: 'Search text inside matched files',
      detail: 'Uses grep on batches of files to print only filenames that contain the exact text.'
    });
  }

  // Standard Error Redirection (The ultimate admin fix!)
  if (filters.suppressErrors) {
    parts.push('2>/dev/null');
    flags.push({
      flag: '2>/dev/null',
      meaning: 'Mute "Permission denied" errors (Admin Fix)',
      detail: 'Redirects error messages (stream 2) to the null device /dev/null so your terminal is not flooded with permission errors.'
    });
  }

  return {
    tool: 'find',
    title: 'find (Standard GNU/Linux)',
    command: parts.join(' '),
    description: 'Universal standard present on 100% of Linux distributions without installing anything. Configured with 2>/dev/null to silence admin errors.',
    recommended: false,
    flags,
    requiresSudo: false,
    speedRating: 'Moderate',
  };
}

/**
 * 4. Ripgrep (rg) Generator for Ultra-Fast Content & Pattern Search
 */
export function generateRipgrepCommand(filters: FilterState): GeneratedCommand {
  const flags: FlagExplanation[] = [];
  const parts: string[] = ['rg'];

  if (filters.includeHidden) {
    parts.push('--hidden');
    flags.push({ flag: '--hidden', meaning: 'Include hidden files', detail: 'Searches hidden files and dot-directories.' });
  }

  const extList = getEffectiveExtensions(filters);
  if (extList.length > 0) {
    extList.forEach(ext => {
      parts.push(`-g "*.${ext}"`);
      flags.push({ flag: `-g "*.${ext}"`, meaning: `Include glob *.${ext}`, detail: `Restricts ripgrep to ${ext} files.` });
    });
  }

  if (filters.maxDepth !== null && filters.maxDepth > 0) {
    parts.push(`--max-depth ${filters.maxDepth}`);
  }

  if (filters.contentSearch.trim()) {
    if (!filters.contentCaseSensitive) {
      parts.push('-i');
      flags.push({ flag: '-i', meaning: 'Case-insensitive content search', detail: 'Matches content regardless of upper/lower case.' });
    }
    parts.push(`"${filters.contentSearch.trim()}"`);
    flags.push({
      flag: `"${filters.contentSearch.trim()}"`,
      meaning: 'Content query string',
      detail: 'Searches for this exact string inside file bodies at extreme multithreaded speed.'
    });
  } else {
    parts.push('--files');
    flags.push({ flag: '--files', meaning: 'List files matching globs', detail: 'Prints matching file paths rather than searching file contents.' });
  }

  const targetPath = filters.searchPath || '.';
  parts.push(targetPath);

  return {
    tool: 'ripgrep',
    title: 'ripgrep (rg)',
    command: parts.join(' '),
    description: 'The world’s fastest content search tool. Perfect when you remember a sentence, error code, or variable name inside your files.',
    recommended: false,
    flags,
    requiresSudo: false,
    speedRating: 'Blazing',
  };
}

/**
 * 5. FSearch GUI Query String Generator
 */
export function generateFsearchQuery(filters: FilterState): GeneratedCommand {
  const flags: FlagExplanation[] = [];
  const terms: string[] = [];

  if (filters.searchName.trim()) {
    terms.push(filters.searchName.trim());
  }

  const extList = getEffectiveExtensions(filters);
  if (extList.length > 0) {
    terms.push(`ext:${extList.join(',')}`);
    flags.push({
      flag: `ext:${extList.join(',')}`,
      meaning: 'Extension filter modifier',
      detail: 'FSearch filter syntax for file extensions.'
    });
  }

  if (filters.sizeFilter === 'large') {
    terms.push('size:>100mb');
    flags.push({ flag: 'size:>100mb', meaning: 'Size greater than 100MB', detail: 'FSearch size modifier.' });
  } else if (filters.sizeFilter === 'huge') {
    terms.push('size:>1gb');
    flags.push({ flag: 'size:>1gb', meaning: 'Size greater than 1GB', detail: 'FSearch size modifier.' });
  }

  const query = terms.join(' ') || '*';

  return {
    tool: 'fsearch',
    title: 'FSearch (GUI Search Bar)',
    command: query,
    description: 'Instant GUI application like "Everything" on Windows. Type this query in the FSearch search bar for instantaneous zero-latency results.',
    recommended: false,
    flags,
    requiresSudo: false,
    speedRating: 'Instant',
  };
}

/**
 * Resolves high-level extension groups and formats into concrete file extensions
 */
export function getEffectiveExtensions(filters: FilterState): string[] {
  if (filters.extensionGroup === 'all') return [];
  if (filters.extensionGroup === 'txt') return ['txt'];
  if (filters.extensionGroup === 'jpg') return ['jpg', 'jpeg', 'png', 'webp'];
  if (filters.extensionGroup === 'zip') return ['zip'];
  if (filters.extensionGroup === 'rar') return ['rar'];
  if (filters.extensionGroup === 'documents') return ['pdf', 'docx', 'xlsx', 'txt', 'md', 'odt'];
  if (filters.extensionGroup === 'media') return ['mp4', 'mkv', 'mp3', 'flac', 'jpg', 'png', 'webp'];
  if (filters.extensionGroup === 'code') return ['ts', 'js', 'py', 'json', 'html', 'css', 'sh', 'rs', 'c', 'cpp'];
  if (filters.extensionGroup === 'archives') return ['zip', 'rar', 'tar.gz', 'iso', '7z', 'deb'];
  if (filters.extensionGroup === 'custom' && filters.customExtensions.trim()) {
    return filters.customExtensions
      .split(/[,;\s]+/)
      .map(e => e.replace(/^\./, '').trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function getFdSizeFlag(filters: FilterState): { flag: string; explanation: FlagExplanation } | null {
  if (filters.sizeFilter === 'any') return null;
  if (filters.sizeFilter === 'tiny') {
    return { flag: '-S -10k', explanation: { flag: '-S -10k', meaning: 'Smaller than 10 Kilobytes', detail: 'Filters for tiny files.' } };
  }
  if (filters.sizeFilter === 'small') {
    return { flag: '-S -1m', explanation: { flag: '-S -1m', meaning: 'Smaller than 1 Megabyte', detail: 'Filters for small files under 1 MB.' } };
  }
  if (filters.sizeFilter === 'medium') {
    return { flag: '-S +1m -S -100m', explanation: { flag: '-S +1m -S -100m', meaning: 'Between 1 MB and 100 MB', detail: 'Filters for mid-sized files.' } };
  }
  if (filters.sizeFilter === 'large') {
    return { flag: '-S +100m', explanation: { flag: '-S +100m', meaning: 'Larger than 100 Megabytes', detail: 'Great for finding disk-hogging files.' } };
  }
  if (filters.sizeFilter === 'huge') {
    return { flag: '-S +1g', explanation: { flag: '-S +1g', meaning: 'Larger than 1 Gigabyte', detail: 'Finds ISOs, videos, and large archives.' } };
  }
  if (filters.sizeFilter === 'custom') {
    const sign = filters.customSizeOp === '>' ? '+' : '-';
    const unit = filters.customSizeUnit.toLowerCase()[0];
    const val = `${sign}${filters.customSizeValue}${unit}`;
    return {
      flag: `-S ${val}`,
      explanation: {
        flag: `-S ${val}`,
        meaning: `File size ${filters.customSizeOp} ${filters.customSizeValue}${filters.customSizeUnit}`,
        detail: 'Filters files by exact custom size boundary.'
      }
    };
  }
  return null;
}

function getFindSizeFlag(filters: FilterState): { flag: string; explanation: FlagExplanation } | null {
  if (filters.sizeFilter === 'any') return null;
  if (filters.sizeFilter === 'tiny') {
    return { flag: '-size -10k', explanation: { flag: '-size -10k', meaning: 'Size < 10 Kilobytes', detail: 'Matches files smaller than 10k.' } };
  }
  if (filters.sizeFilter === 'small') {
    return { flag: '-size -1M', explanation: { flag: '-size -1M', meaning: 'Size < 1 Megabyte', detail: 'Matches files smaller than 1M.' } };
  }
  if (filters.sizeFilter === 'medium') {
    return { flag: '-size +1M -size -100M', explanation: { flag: '-size +1M -size -100M', meaning: 'Between 1MB and 100MB', detail: 'Matches mid-range files.' } };
  }
  if (filters.sizeFilter === 'large') {
    return { flag: '-size +100M', explanation: { flag: '-size +100M', meaning: 'Size > 100 Megabytes', detail: 'Finds files larger than 100M.' } };
  }
  if (filters.sizeFilter === 'huge') {
    return { flag: '-size +1G', explanation: { flag: '-size +1G', meaning: 'Size > 1 Gigabyte', detail: 'Finds files larger than 1G.' } };
  }
  if (filters.sizeFilter === 'custom') {
    const sign = filters.customSizeOp === '>' ? '+' : '-';
    const unit = filters.customSizeUnit === 'KB' ? 'k' : filters.customSizeUnit === 'MB' ? 'M' : 'G';
    const flagStr = `-size ${sign}${filters.customSizeValue}${unit}`;
    return {
      flag: flagStr,
      explanation: {
        flag: flagStr,
        meaning: `Size ${filters.customSizeOp} ${filters.customSizeValue}${filters.customSizeUnit}`,
        detail: 'GNU find size parameter.'
      }
    };
  }
  return null;
}

function getFdDateFlag(filters: FilterState): { flag: string; explanation: FlagExplanation } | null {
  if (filters.dateFilter === 'any') return null;
  if (filters.dateFilter === 'today') {
    return { flag: '--changed-within 24h', explanation: { flag: '--changed-within 24h', meaning: 'Modified in last 24 hours', detail: 'Finds recent files.' } };
  }
  if (filters.dateFilter === '7days') {
    return { flag: '--changed-within 7d', explanation: { flag: '--changed-within 7d', meaning: 'Modified in last 7 days', detail: 'Finds work from this week.' } };
  }
  if (filters.dateFilter === '30days') {
    return { flag: '--changed-within 30d', explanation: { flag: '--changed-within 30d', meaning: 'Modified in last 30 days', detail: 'Finds files from this month.' } };
  }
  if (filters.dateFilter === 'older_1year') {
    return { flag: '--changed-before 1y', explanation: { flag: '--changed-before 1y', meaning: 'Older than 1 year', detail: 'Finds old archival files.' } };
  }
  return null;
}

function getFindDateFlag(filters: FilterState): { flag: string; explanation: FlagExplanation } | null {
  if (filters.dateFilter === 'any') return null;
  if (filters.dateFilter === 'today') {
    return { flag: '-mtime -1', explanation: { flag: '-mtime -1', meaning: 'Modified within last 24 hours', detail: 'mtime < 1 day.' } };
  }
  if (filters.dateFilter === '7days') {
    return { flag: '-mtime -7', explanation: { flag: '-mtime -7', meaning: 'Modified within last 7 days', detail: 'mtime < 7 days.' } };
  }
  if (filters.dateFilter === '30days') {
    return { flag: '-mtime -30', explanation: { flag: '-mtime -30', meaning: 'Modified within last 30 days', detail: 'mtime < 30 days.' } };
  }
  if (filters.dateFilter === 'older_1year') {
    return { flag: '-mtime +365', explanation: { flag: '-mtime +365', meaning: 'Older than 365 days', detail: 'mtime > 365 days.' } };
  }
  return null;
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
