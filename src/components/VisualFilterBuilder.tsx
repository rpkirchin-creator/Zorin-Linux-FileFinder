/**
 * @file VisualFilterBuilder.tsx
 * @description Interactive visual filter configuration panel for Linux & Zorin OS search.
 * Includes quick-search presets, format dropdown for .txt, .jpg, .rar, .zip, size filters,
 * date ranges, and admin permission toggles (2>/dev/null, -readable).
 */

import React from 'react';
import { FilterState, ExtensionGroup, SizeFilterType, DateFilterType, FileTypeFilter } from '../types/search';
import {
  Folder,
  File,
  Search,
  Filter,
  Shield,
  HardDrive,
  Clock,
  Sparkles,
  Layers,
  FileType,
  Terminal,
  FileCode,
  Archive,
  Image,
  Eye,
  Trash2,
  FileText,
  AlertTriangle,
  ChevronDown,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

interface VisualFilterBuilderProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApplyPreset: (presetName: string) => void;
  onNavigateToTutorial?: () => void;
}

export const VisualFilterBuilder: React.FC<VisualFilterBuilderProps> = ({
  filters,
  setFilters,
  onApplyPreset,
  onNavigateToTutorial,
}) => {
  // Reset all filters to default state
  const handleResetFilters = () => {
    setFilters({
      searchPath: '~',
      searchName: '',
      nameMatchType: 'contains',
      caseSensitive: false,
      extensionGroup: 'all',
      customExtensions: '',
      sizeFilter: 'any',
      customSizeOp: '>',
      customSizeValue: 100,
      customSizeUnit: 'MB',
      dateFilter: 'any',
      fileType: 'all',
      contentSearch: '',
      contentCaseSensitive: false,
      includeHidden: true,
      suppressErrors: true,
      readableOnly: true,
      followSymlinks: false,
      maxDepth: null,
      action: 'print',
    });
  };

  // Helper to update individual state attributes
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Predefined format list requested by the user, covering .txt, .jpg, .rar, .zip, etc.
   */
  const formatDropdownOptions = [
    { value: 'all', label: 'All Files (No extension filter)', group: 'all', custom: '' },
    { value: 'txt', label: 'Plain Text Files (.txt)', group: 'txt', custom: '' },
    { value: 'jpg', label: 'Images & Photos (.jpg, .jpeg, .png, .webp)', group: 'jpg', custom: '' },
    { value: 'zip', label: 'Zip Compressed Archives (.zip)', group: 'zip', custom: '' },
    { value: 'rar', label: 'RAR Archives (.rar)', group: 'rar', custom: '' },
    { value: 'archives', label: 'All Compressed Archives (.zip, .rar, .tar.gz, .7z)', group: 'archives', custom: '' },
    { value: 'pdf', label: 'PDF Documents (.pdf)', group: 'custom', custom: 'pdf' },
    { value: 'documents', label: 'Office Documents (.pdf, .docx, .xlsx, .odt)', group: 'documents', custom: '' },
    { value: 'log', label: 'Log Files (.log)', group: 'custom', custom: 'log' },
    { value: 'media', label: 'Audio & Video (.mp4, .mkv, .mp3, .flac)', group: 'media', custom: '' },
    { value: 'code', label: 'Code & Scripts (.sh, .py, .ts, .json)', group: 'code', custom: '' },
    { value: 'iso', label: 'Disk Images & Packages (.iso, .deb)', group: 'custom', custom: 'iso, deb' },
    { value: 'custom', label: 'Custom extension list...', group: 'custom', custom: filters.customExtensions || '' },
  ];

  // Determine current dropdown value
  const currentDropdownValue = (() => {
    if (filters.extensionGroup === 'txt') return 'txt';
    if (filters.extensionGroup === 'jpg') return 'jpg';
    if (filters.extensionGroup === 'zip') return 'zip';
    if (filters.extensionGroup === 'rar') return 'rar';
    if (filters.extensionGroup === 'archives') return 'archives';
    if (filters.extensionGroup === 'documents') return 'documents';
    if (filters.extensionGroup === 'media') return 'media';
    if (filters.extensionGroup === 'code') return 'code';
    if (filters.extensionGroup === 'all') return 'all';
    if (filters.customExtensions.toLowerCase() === 'pdf') return 'pdf';
    if (filters.customExtensions.toLowerCase() === 'log') return 'log';
    if (filters.customExtensions.toLowerCase().includes('iso')) return 'iso';
    return 'custom';
  })();

  const handleFormatDropdownChange = (val: string) => {
    const selected = formatDropdownOptions.find(o => o.value === val);
    if (!selected) return;

    if (selected.value === 'custom') {
      updateFilter('extensionGroup', 'custom');
    } else if (selected.custom) {
      setFilters(prev => ({
        ...prev,
        extensionGroup: 'custom',
        customExtensions: selected.custom,
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        extensionGroup: selected.group as ExtensionGroup,
        customExtensions: '',
      }));
    }
  };

  const extensionGroups: { id: ExtensionGroup; label: string; icon: React.ReactNode; hint: string }[] = [
    { id: 'all', label: 'All Files', icon: <File className="w-3.5 h-3.5" />, hint: 'No extension limit' },
    { id: 'txt', label: 'Text (.txt)', icon: <FileText className="w-3.5 h-3.5 text-cyan-400" />, hint: '.txt notes & docs' },
    { id: 'jpg', label: 'Photos (.jpg)', icon: <Image className="w-3.5 h-3.5 text-emerald-400" />, hint: '.jpg, .png, .webp' },
    { id: 'zip', label: 'Zip (.zip)', icon: <Archive className="w-3.5 h-3.5 text-purple-400" />, hint: '.zip archives' },
    { id: 'rar', label: 'RAR (.rar)', icon: <Archive className="w-3.5 h-3.5 text-amber-400" />, hint: '.rar compressed' },
    { id: 'documents', label: 'Docs (.pdf...)', icon: <FileText className="w-3.5 h-3.5 text-blue-400" />, hint: 'pdf, docx, txt...' },
    { id: 'archives', label: 'All Archives', icon: <Archive className="w-3.5 h-3.5 text-purple-400" />, hint: 'zip, rar, tar.gz...' },
    { id: 'code', label: 'Code & Scripts', icon: <FileCode className="w-3.5 h-3.5 text-amber-400" />, hint: 'sh, py, ts, json...' },
    { id: 'custom', label: 'Custom Ext', icon: <Filter className="w-3.5 h-3.5 text-cyan-400" />, hint: 'Type custom' },
  ];

  const sizeOptions: { id: SizeFilterType; label: string; desc: string }[] = [
    { id: 'any', label: 'Any Size', desc: 'No limit' },
    { id: 'tiny', label: '< 10 KB', desc: 'Configs, scripts' },
    { id: 'small', label: '< 1 MB', desc: 'Text & notes' },
    { id: 'medium', label: '1 MB - 100 MB', desc: 'Docs, photos' },
    { id: 'large', label: '> 100 MB', desc: 'Videos, logs' },
    { id: 'huge', label: '> 1 GB', desc: 'ISOs, backups' },
    { id: 'custom', label: 'Custom...', desc: 'Exact threshold' },
  ];

  const dateOptions: { id: DateFilterType; label: string }[] = [
    { id: 'any', label: 'Any Time' },
    { id: 'today', label: 'Last 24 Hours' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: 'older_1year', label: 'Older than 1 Year' },
  ];

  const fileTypeOptions: { id: FileTypeFilter; label: string }[] = [
    { id: 'all', label: 'Files & Folders' },
    { id: 'file', label: 'Files Only' },
    { id: 'directory', label: 'Folders Only' },
    { id: 'executable', label: 'Executables (+x)' },
    { id: 'symlink', label: 'Symlinks' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Presets Carousel */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Quick Default Searches &amp; Presets
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 flex items-center gap-1.5 shadow-sm"
              title="Reset all filters back to standard defaults"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Reset All Filters</span>
            </button>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              Click to load common Linux queries
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Default Searches for TXT, JPG, ZIP, RAR */}
          <button
            onClick={() => onApplyPreset('search_txt')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-800/80 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Find .txt Notes</span>
          </button>

          <button
            onClick={() => onApplyPreset('search_jpg')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/80 flex items-center gap-1.5 transition-all"
          >
            <Image className="w-3.5 h-3.5 text-emerald-400" />
            <span>Find .jpg Photos</span>
          </button>

          <button
            onClick={() => onApplyPreset('search_zip_rar')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/80 flex items-center gap-1.5 transition-all"
          >
            <Archive className="w-3.5 h-3.5 text-purple-400" />
            <span>Find .zip &amp; .rar Archives</span>
          </button>

          <button
            onClick={() => onApplyPreset('large_files')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all"
          >
            <HardDrive className="w-3.5 h-3.5 text-rose-400" />
            <span>Big Files (&gt;100MB)</span>
          </button>

          <button
            onClick={() => onApplyPreset('recent_docs')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Recent Docs (7 Days)</span>
          </button>

          <button
            onClick={() => onApplyPreset('safe_root_search')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>No-Admin Safe Root Search</span>
          </button>
        </div>

        {/* Student Tutorial Callout Banner with Bold Tutorial */}
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-zinc-950 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-300 leading-relaxed">
              New to command switches? Read the comprehensive student <strong className="font-bold text-amber-300">Tutorial</strong> for step-by-step exercises, switch breakdowns, and zero-sudo tricks.
            </span>
          </div>
          {onNavigateToTutorial && (
            <button
              type="button"
              onClick={onNavigateToTutorial}
              className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 hover:text-white border border-blue-500/40 font-semibold flex-shrink-0 transition-all self-start sm:self-auto"
            >
              Open <strong className="font-bold text-white">Tutorial</strong> &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Target Location & File Name */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Folder className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">1. Where &amp; What to Find</h3>
          </div>

          {/* Search Path */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Search Location (Directory)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                { label: '~ (Home)', value: '~' },
                { label: '. (Current)', value: '.' },
                { label: 'Downloads', value: '~/Downloads' },
                { label: 'Documents', value: '~/Documents' },
                { label: 'Pictures', value: '~/Pictures' },
                { label: '/ (Whole Drive)', value: '/' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateFilter('searchPath', opt.value)}
                  className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                    filters.searchPath === opt.value
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={filters.searchPath}
              onChange={e => updateFilter('searchPath', e.target.value)}
              placeholder="e.g. ~ or /var/log or /home/username/Projects"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Search Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-400">
                File Name or Pattern
              </label>
              <div className="flex items-center gap-3">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.caseSensitive}
                    onChange={e => updateFilter('caseSensitive', e.target.checked)}
                    className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Match Case</span>
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={filters.searchName}
                onChange={e => updateFilter('searchName', e.target.value)}
                placeholder="e.g. report, invoice*, *.log, backup"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Match Type Radios */}
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
              <span className="text-[11px] text-zinc-500">Matching Mode:</span>
              {[
                { id: 'contains', label: 'Contains' },
                { id: 'glob', label: 'Glob (*.pdf)' },
                { id: 'exact', label: 'Exact' },
              ].map(mode => (
                <label key={mode.id} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="matchType"
                    checked={filters.nameMatchType === mode.id}
                    onChange={() => updateFilter('nameMatchType', mode.id as any)}
                    className="text-cyan-500 focus:ring-0 w-3 h-3"
                  />
                  <span>{mode.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Search (Inside Files) */}
          <div className="pt-2 border-t border-zinc-800/60">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Search Text Inside File (ripgrep / grep)</span>
              </label>
              <label className="text-[11px] text-zinc-400 flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.contentCaseSensitive}
                  onChange={e => updateFilter('contentCaseSensitive', e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0 w-3 h-3"
                />
                <span>Case Sensitive</span>
              </label>
            </div>
            <input
              type="text"
              value={filters.contentSearch}
              onChange={e => updateFilter('contentSearch', e.target.value)}
              placeholder="e.g. 'TODO', 'connection error', 'tax deduction'"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500/80"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Finds documents or code that contain this specific phrase or sentence.
            </p>
          </div>
        </div>

        {/* Section 2: File Types & Extensions (with User Requested Dropdown!) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <FileType className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">2. File Types &amp; Formats</h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-medium">
              Dropdown + Quick Pills
            </span>
          </div>

          {/* Format Selector Dropdown (Requested by user) */}
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Quick Format Dropdown (.txt, .jpg, .rar, .zip, etc.)
            </label>
            <div className="relative">
              <select
                value={currentDropdownValue}
                onChange={e => handleFormatDropdownChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer pr-8"
              >
                {formatDropdownOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-200">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-zinc-500">
              Select any default format to instantly restrict search to those file types.
            </p>
          </div>

          {/* Extension Quick Categories */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Or Choose by Category Card:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {extensionGroups.map(grp => {
                const isSelected = filters.extensionGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => updateFilter('extensionGroup', grp.id)}
                    className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium text-xs">
                      {grp.icon}
                      <span>{grp.label}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-0.5 truncate w-full">
                      {grp.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            {filters.extensionGroup === 'custom' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={filters.customExtensions}
                  onChange={e => updateFilter('customExtensions', e.target.value)}
                  placeholder="Enter comma-separated extensions (e.g. txt, jpg, rar, zip, pdf)"
                  className="w-full bg-zinc-950 border border-cyan-700/60 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-200 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Kind of File (Regular vs Directory vs Executable) */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Item Type Filter
            </label>
            <div className="flex flex-wrap gap-1.5">
              {fileTypeOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateFilter('fileType', opt.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    filters.fileType === opt.id
                      ? 'bg-zinc-700 text-white shadow-sm'
                      : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: File Size Filter */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">3. File Size Filtering</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sizeOptions.map(opt => {
              const isSelected = filters.sizeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateFilter('sizeFilter', opt.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 text-white font-semibold'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-zinc-500">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          {filters.sizeFilter === 'custom' && (
            <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              <select
                value={filters.customSizeOp}
                onChange={e => updateFilter('customSizeOp', e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 font-mono"
              >
                <option value=">">&gt; (Larger than)</option>
                <option value="<">&lt; (Smaller than)</option>
              </select>

              <input
                type="number"
                min="1"
                value={filters.customSizeValue}
                onChange={e => updateFilter('customSizeValue', Number(e.target.value))}
                className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 font-mono"
              />

              <select
                value={filters.customSizeUnit}
                onChange={e => updateFilter('customSizeUnit', e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 font-mono"
              >
                <option value="KB">Kilobytes (KB)</option>
                <option value="MB">Megabytes (MB)</option>
                <option value="GB">Gigabytes (GB)</option>
              </select>
            </div>
          )}
        </div>

        {/* Section 4: Date Modified Filter */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">4. Date Modified</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {dateOptions.map(opt => {
              const isSelected = filters.dateFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateFilter('dateFilter', opt.id)}
                  className={`p-2 rounded-xl border text-center transition-all text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 font-semibold'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-500">
            Translates directly to <code className="text-zinc-400 font-mono">--changed-within</code> in fd and <code className="text-zinc-400 font-mono">-mtime</code> in find.
          </p>
        </div>
      </div>

      {/* Section 5: Admin & Permission Hardening (The Core Issue Solved!) */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-900/40 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>5. Admin &amp; Permissions Optimization (Fix "Permission Denied" Errors)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Solves terminal clutter and access locks on Zorin OS and Linux without requiring root/sudo
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Suppress Errors 2>/dev/null */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  Silence Admin Errors
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  2&gt;/dev/null
                </span>
              </div>
              <input
                type="checkbox"
                checked={filters.suppressErrors}
                onChange={e => updateFilter('suppressErrors', e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 w-4 h-4 mt-1"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Discards "Permission denied" output so your terminal stays clean.
            </p>
          </div>

          {/* User Readable Only */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  Readable Only
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  -readable
                </span>
              </div>
              <input
                type="checkbox"
                checked={filters.readableOnly}
                onChange={e => updateFilter('readableOnly', e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 w-4 h-4 mt-1"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Skips root-protected folders before attempting to open them.
            </p>
          </div>

          {/* Hidden Files */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  Include Hidden Files
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  -H / --hidden
                </span>
              </div>
              <input
                type="checkbox"
                checked={filters.includeHidden}
                onChange={e => updateFilter('includeHidden', e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0 w-4 h-4 mt-1"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Searches dotfiles like <code className="text-zinc-400">.bashrc</code>, <code className="text-zinc-400">.config</code>.
            </p>
          </div>

          {/* Max Depth */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  Limit Directory Depth
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  -maxdepth / -d
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {[
                { label: 'All', val: null },
                { label: '1', val: 1 },
                { label: '2', val: 2 },
                { label: '4', val: 4 },
              ].map(d => (
                <button
                  key={String(d.val)}
                  type="button"
                  onClick={() => updateFilter('maxDepth', d.val)}
                  className={`px-2 py-0.5 text-xs rounded font-mono ${
                    filters.maxDepth === d.val
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Action on Results */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">6. What to Do with Matched Files (Pipeline Action)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'print', label: 'Print List to Terminal', icon: <Terminal className="w-3.5 h-3.5" />, desc: 'Standard path output' },
            { id: 'fzf_preview', label: 'Pipe to Interactive fzf', icon: <Eye className="w-3.5 h-3.5 text-cyan-400" />, desc: 'Live preview & select' },
            { id: 'open_editor', label: 'Open in GUI (xdg-open)', icon: <Folder className="w-3.5 h-3.5 text-blue-400" />, desc: 'Launch default viewer' },
            { id: 'xargs_delete', label: 'Safe Delete (-X rm -I)', icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />, desc: 'Prompt before delete' },
          ].map(act => (
            <button
              key={act.id}
              type="button"
              onClick={() => updateFilter('action', act.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                filters.action === act.id
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                  : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                {act.icon}
                <span>{act.label}</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">{act.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
