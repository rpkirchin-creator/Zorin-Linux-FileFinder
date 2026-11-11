import React from 'react';
import { Terminal, Search, ShieldCheck, BookOpen, SlidersHorizontal, Sparkles, Zap, Code2, GraduationCap, Download } from 'lucide-react';
import { downloadProjectZip } from '../utils/projectZipExporter';

export type ActiveTab = 'builder' | 'tutorial' | 'tools' | 'no-admin' | 'terminal' | 'bashrc' | 'architecture';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  matchesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, matchesCount }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">Zorin &amp; Linux FileFinder</span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 rounded-full flex items-center gap-1 shadow-sm">
                  <GraduationCap className="w-3 h-3 text-amber-400" />
                  <span>STUDENT <strong className="font-black text-amber-200">TUTORIAL</strong></span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded-full hidden sm:inline">
                  FAST SEARCH &amp; NO-SUDO
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Master terminal search tools, filter switches &amp; permission walls in this comprehensive student <strong className="font-bold text-zinc-200">Tutorial</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Actions */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'builder'
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Filter Builder</span>
                {matchesCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-cyan-500/20 text-cyan-300 rounded-full font-mono">
                    {matchesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tutorial')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'tutorial'
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-800/80 shadow-sm ring-1 ring-blue-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span><strong className="font-bold text-white tracking-wide">Tutorial</strong> Guide</span>
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'tools'
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Tools (FSearch, fd)</span>
                <span className="sm:hidden">Tools</span>
              </button>

              <button
                onClick={() => setActiveTab('no-admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'no-admin'
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">No-Admin Fixes</span>
                <span className="md:hidden">No-Sudo</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'architecture'
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-800/80 shadow-sm ring-1 ring-purple-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="hidden md:inline">Architecture &amp; AI</span>
                <span className="md:hidden">Arch</span>
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'terminal'
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Simulated Terminal</span>
                <span className="sm:inline hidden">Terminal</span>
              </button>
            </nav>

            {/* Prominent Download Project .ZIP Button */}
            <button
              onClick={() => downloadProjectZip()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md shadow-emerald-950/40 border border-emerald-500/40 flex-shrink-0 cursor-pointer"
              title="Download complete project repository as a .zip file (131 KB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Download Project (.ZIP)</span>
              <span className="lg:hidden">.ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
