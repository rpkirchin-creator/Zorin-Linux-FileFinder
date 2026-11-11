import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface AliasConfig {
  aliasName: string;
  command: string;
  description: string;
  example: string;
}

export const BASHRC_ALIASES: AliasConfig[] = [
  {
    aliasName: 'ff',
    command: 'alias ff="fd --type f --hidden"',
    description: 'Blazing fast file search that includes hidden files and skips unreadable directories automatically.',
    example: 'ff report.pdf',
  },
  {
    aliasName: 'fif',
    command: `fif() {
  rg --files --hidden --no-ignore-vcs 2>/dev/null | fzf --preview 'bat --style=numbers --color=always {} 2>/dev/null || cat {}'
}`,
    description: 'Fuzzy Interactive Finder: Launches fzf with live preview. Type letters to instantly narrow down any file.',
    example: 'fif',
  },
  {
    aliasName: 'fcd',
    command: `fcd() {
  local dir
  dir=$(fd --type d --hidden 2>/dev/null | fzf +m) && cd "$dir"
}`,
    description: 'Fuzzy CD: Type a few letters of any directory on your system and immediately cd into it.',
    example: 'fcd',
  },
  {
    aliasName: 'fsize',
    command: 'alias fsize="fd -S +100m --exec ls -lh {} 2>/dev/null | sort -k5 -hr"',
    description: 'Find Huge Files: Instantly lists all files larger than 100MB sorted from biggest to smallest.',
    example: 'fsize',
  },
  {
    aliasName: 'ftoday',
    command: 'alias ftoday="fd --changed-within 24h"',
    description: 'Recent Files: Lists files created or modified in the last 24 hours.',
    example: 'ftoday',
  },
  {
    aliasName: 'safe-find',
    command: 'alias sfind="find . -readable 2>/dev/null"',
    description: 'Safe POSIX Find: Ignores permission denied errors and only scans files readable by your account.',
    example: 'sfind -name "*.log"',
  },
];

export const BashrcSupercharger: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fullBlock = `# --- Fast File Search Supercharger for Zorin OS / Linux ---
export PATH="$HOME/.local/bin:$PATH"

${BASHRC_ALIASES.map(a => `${a.command}`).join('\n\n')}
# -----------------------------------------------------------`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Supercharge Your Terminal (.bashrc Snippets)
            </h2>
            <p className="text-xs text-zinc-400">
              Add these aliases once to your <code className="text-cyan-300 font-mono">~/.bashrc</code> and never suffer slow file searches again.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleCopy(fullBlock, 'all')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/30 transition-all flex-shrink-0"
        >
          {copiedKey === 'all' ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied All Aliases!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All to ~/.bashrc</span>
            </>
          )}
        </button>
      </div>

      {/* Alias Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BASHRC_ALIASES.map(item => (
          <div
            key={item.aliasName}
            className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-sm font-bold text-cyan-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {item.aliasName}
                </span>
                <button
                  onClick={() => handleCopy(item.command, item.aliasName)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs flex items-center gap-1"
                  title="Copy this alias"
                >
                  {copiedKey === item.aliasName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-400 overflow-x-auto whitespace-pre-wrap">
              <span className="text-zinc-500">Usage: </span>
              <span className="text-emerald-400 font-semibold">$ {item.example}</span>
            </div>
          </div>
        ))}
      </div>

      {/* How to Apply */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1.5 font-mono">
        <div className="text-zinc-500 font-sans font-semibold mb-1">
          📌 How to install into Zorin OS:
        </div>
        <div>1. Run: <span className="text-cyan-300">nano ~/.bashrc</span></div>
        <div>2. Scroll to the bottom and paste the snippet</div>
        <div>3. Save with <span className="text-cyan-300">Ctrl+O</span> then press <span className="text-cyan-300">Enter</span>, and exit with <span className="text-cyan-300">Ctrl+X</span></div>
        <div>4. Reload your terminal: <span className="text-cyan-300">source ~/.bashrc</span></div>
      </div>
    </div>
  );
};
