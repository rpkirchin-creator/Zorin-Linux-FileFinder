/**
 * @file App.tsx
 * @description Main application controller for Linux & Zorin OS Fast File Search Station.
 * Coordinates visual filter state, multi-tool command generators (fd, fzf, find, rg, fsearch),
 * simulated filesystem query evaluation, and educational tutorial walkthroughs.
 */

import React, { useState, useMemo } from 'react';
import { FilterState } from './types/search';
import { generateAllCommands } from './utils/commandGenerators';
import { evaluateSearch } from './utils/fileMatcher';
import { Navbar, ActiveTab } from './components/Navbar';
import { VisualFilterBuilder } from './components/VisualFilterBuilder';
import { CommandOutputCard } from './components/CommandOutputCard';
import { SimulatedResultsView } from './components/SimulatedResultsView';
import { ToolsGuideView } from './components/ToolsGuideView';
import { AdminBypassGuide } from './components/AdminBypassGuide';
import { VirtualTerminal } from './components/VirtualTerminal';
import { BashrcSupercharger } from './components/BashrcSupercharger';
import { TutorialView } from './components/TutorialView';
import { ArchitectureView } from './components/ArchitectureView';
import { downloadProjectZip } from './utils/projectZipExporter';
import {
  SlidersHorizontal,
  Terminal,
  Zap,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  FileText,
  Archive,
  Image,
  Download,
} from 'lucide-react';

export default function App() {
  // Navigation active tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('builder');
  // Selected search tool for command output card
  const [selectedTool, setSelectedTool] = useState<string>('fd');
  // Command preloaded into simulated terminal
  const [terminalCommand, setTerminalCommand] = useState<string | undefined>(undefined);

  /**
   * Primary Search Filter State
   * Pre-configured with sensible defaults that automatically solve admin permission issues:
   * - suppressErrors: true (appends 2>/dev/null to silence Permission Denied errors)
   * - readableOnly: true (tests current user readability)
   * - includeHidden: true (includes dotfiles)
   */
  const [filters, setFilters] = useState<FilterState>({
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
    suppressErrors: true, // Crucial default for user's admin issues!
    readableOnly: true,
    followSymlinks: false,
    maxDepth: null,
    action: 'print',
  });

  /**
   * Memoized commands generator: builds synchronized syntax for all 5 tools
   */
  const generatedCommands = useMemo(() => generateAllCommands(filters), [filters]);

  /**
   * Memoized simulation evaluator: searches the virtual filesystem in real time
   */
  const evaluation = useMemo(() => evaluateSearch(filters), [filters]);

  /**
   * Preset loader for common tasks, format searches (.txt, .jpg, .zip, .rar), and educational challenges
   */
  const handleApplyPreset = (presetName: string) => {
    switch (presetName) {
      // Default search for Plain Text (.txt) notes
      case 'search_txt':
        setFilters(prev => ({
          ...prev,
          searchPath: '~',
          extensionGroup: 'txt',
          customExtensions: '',
          searchName: '',
          sizeFilter: 'any',
          dateFilter: 'any',
          contentSearch: '',
        }));
        setSelectedTool('fd');
        break;

      // Default search for Photos (.jpg, .png)
      case 'search_jpg':
        setFilters(prev => ({
          ...prev,
          searchPath: '~/Pictures',
          extensionGroup: 'jpg',
          customExtensions: '',
          searchName: '',
          sizeFilter: 'any',
          dateFilter: 'any',
          contentSearch: '',
        }));
        setSelectedTool('fd');
        break;

      // Default search for .zip & .rar compressed files
      case 'search_zip_rar':
        setFilters(prev => ({
          ...prev,
          searchPath: '~/Downloads',
          extensionGroup: 'archives',
          customExtensions: '',
          searchName: '',
          sizeFilter: 'any',
          dateFilter: 'any',
          contentSearch: '',
        }));
        setSelectedTool('fd');
        break;

      // Find files larger than 100MB
      case 'large_files':
        setFilters(prev => ({
          ...prev,
          searchPath: '~',
          sizeFilter: 'large',
          extensionGroup: 'all',
          searchName: '',
          dateFilter: 'any',
          contentSearch: '',
        }));
        setSelectedTool('fd');
        break;

      // Recent documents modified in last 7 days
      case 'recent_docs':
        setFilters(prev => ({
          ...prev,
          searchPath: '~',
          sizeFilter: 'any',
          extensionGroup: 'documents',
          dateFilter: '7days',
          searchName: '',
          contentSearch: '',
        }));
        setSelectedTool('fd');
        break;

      // Clean downloads folder (ISOs, tarballs)
      case 'downloads_cleanup':
        setFilters(prev => ({
          ...prev,
          searchPath: '~/Downloads',
          extensionGroup: 'archives',
          sizeFilter: 'any',
          dateFilter: 'any',
          searchName: '',
          contentSearch: '',
        }));
        setSelectedTool('fd');
        break;

      // Search inside code with ripgrep
      case 'search_code':
        setFilters(prev => ({
          ...prev,
          searchPath: '~/Projects',
          contentSearch: 'TODO',
          extensionGroup: 'code',
          sizeFilter: 'any',
          dateFilter: 'any',
          searchName: '',
        }));
        setSelectedTool('ripgrep');
        break;

      // Safe root drive search without sudo
      case 'safe_root_search':
        setFilters(prev => ({
          ...prev,
          searchPath: '/',
          suppressErrors: true,
          readableOnly: true,
          maxDepth: 3,
          searchName: 'log',
          sizeFilter: 'any',
          extensionGroup: 'all',
        }));
        setSelectedTool('find');
        break;

      default:
        break;
    }
  };

  /**
   * Challenge solver for the tutorial view
   */
  const handleLoadChallenge = (challengeKey: string) => {
    if (challengeKey === 'zip_rar') {
      handleApplyPreset('search_zip_rar');
    } else if (challengeKey === 'txt_today') {
      setFilters(prev => ({
        ...prev,
        searchPath: '~',
        extensionGroup: 'txt',
        dateFilter: 'today',
        searchName: '',
        sizeFilter: 'any',
        contentSearch: '',
      }));
      setSelectedTool('fd');
    } else if (challengeKey === 'safe_root') {
      handleApplyPreset('safe_root_search');
    }
    setActiveTab('builder');
  };

  /**
   * Switches to the Simulated Terminal and immediately runs the command
   */
  const handleRunInTerminal = (cmd: string) => {
    setTerminalCommand(cmd);
    setActiveTab('terminal');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={evaluation.matches.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Interactive Visual Filter Builder */}
        {activeTab === 'builder' && (
          <div className="space-y-6">
            {/* Real-time Generated Command Box (Hero Area) */}
            <CommandOutputCard
              commands={generatedCommands}
              selectedTool={selectedTool}
              onSelectTool={setSelectedTool}
              onRunInTerminal={handleRunInTerminal}
              onNavigateToTutorial={() => setActiveTab('tutorial')}
            />

            {/* Two-Column Layout: Visual Controls (Left) & Simulated Matches (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-6">
                <VisualFilterBuilder
                  filters={filters}
                  setFilters={setFilters}
                  onApplyPreset={handleApplyPreset}
                  onNavigateToTutorial={() => setActiveTab('tutorial')}
                />
              </div>

              <div className="lg:col-span-5 sticky top-20 space-y-6">
                <SimulatedResultsView
                  evaluation={evaluation}
                  onRunInTerminal={handleRunInTerminal}
                />

                {/* Helpful Tip Box */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-zinc-200">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Quick Summary for Your Tutorial:</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    • <strong>GUI:</strong> Install <strong>FSearch</strong> (instant RAM search like Everything, works via AppImage without sudo).
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    • <strong>CLI:</strong> Use <strong>fd</strong> (<code className="font-mono text-zinc-300">fd -e txt</code> or <code className="font-mono text-zinc-300">fd -e zip -e rar</code>). Skips unreadable folders automatically!
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                    <button
                      onClick={() => setActiveTab('tutorial')}
                      className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                    >
                      Read Full Tutorial (.MD) &rarr;
                    </button>
                    <span className="text-zinc-600">•</span>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                    >
                      Tool Install Guide &rarr;
                    </button>
                    <span className="text-zinc-600">•</span>
                    <button
                      onClick={() => setActiveTab('no-admin')}
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                    >
                      No-Sudo Fixes &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Tutorial Walkthrough & Challenges */}
        {activeTab === 'tutorial' && (
          <TutorialView onLoadChallenge={handleLoadChallenge} />
        )}

        {/* Tab 3: Best Tools Guide (FSearch, fd, fzf, ripgrep) */}
        {activeTab === 'tools' && <ToolsGuideView />}

        {/* Tab 4: No-Admin / Sudo Fixes */}
        {activeTab === 'no-admin' && <AdminBypassGuide />}

        {/* Tab 5: Interactive Virtual Terminal Simulator */}
        {activeTab === 'terminal' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-amber-400" />
                  <span>Linux &amp; Zorin OS Interactive Terminal Simulator</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Test search commands before pasting them into your real desktop terminal.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('bashrc')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Get ~/.bashrc Aliases</span>
              </button>
            </div>

            <VirtualTerminal initialCommand={terminalCommand} />
          </div>
        )}

        {/* Tab 6: Bashrc Supercharger */}
        {activeTab === 'bashrc' && <BashrcSupercharger />}

        {/* Tab 7: Architecture & AI Engineering Rationale */}
        {activeTab === 'architecture' && (
          <ArchitectureView
            onNavigateToBuilder={() => setActiveTab('builder')}
            onNavigateToTutorial={() => setActiveTab('tutorial')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Ready for Zorin OS 16/17, Ubuntu 22.04/24.04, Debian, and Linux Mint</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Co-inspired by <strong className="text-zinc-200">rkirchin</strong> / <strong className="text-purple-300">Gemini</strong></span>
              <span>•</span>
              <a
                href="https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>GitHub Repository</span>
                <span className="text-[10px]">&rarr;</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
            <button
              onClick={() => setActiveTab('builder')}
              className="hover:text-zinc-200 transition-colors"
            >
              Filter Builder
            </button>
            <button
              onClick={() => setActiveTab('tutorial')}
              className="hover:text-zinc-200 transition-colors"
            >
              Tutorial Guide
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className="hover:text-zinc-200 transition-colors"
            >
              Tools Guide
            </button>
            <button
              onClick={() => setActiveTab('no-admin')}
              className="hover:text-zinc-200 transition-colors"
            >
              Permission Fixes
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Architecture &amp; AI
            </button>
            <button
              onClick={() => setActiveTab('bashrc')}
              className="hover:text-zinc-200 transition-colors"
            >
              .bashrc Supercharger
            </button>
            <button
              onClick={() => downloadProjectZip()}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Download entire project repository as a .zip file (131 KB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project (.ZIP)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
