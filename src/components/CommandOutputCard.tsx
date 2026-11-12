import React, { useState } from 'react';
import { GeneratedCommand, FlagExplanation } from '../types/search';
import { Copy, Check, Terminal, Zap, Info, ShieldCheck, ChevronDown, ChevronUp, Play, GraduationCap, ExternalLink, Download, FileCode } from 'lucide-react';
import { CommandAnatomyExplainer } from './CommandAnatomyExplainer';

interface CommandOutputCardProps {
  commands: GeneratedCommand[];
  selectedTool: string;
  onSelectTool: (toolId: string) => void;
  onRunInTerminal: (cmd: string) => void;
  onNavigateToTutorial?: () => void;
}

export const CommandOutputCard: React.FC<CommandOutputCardProps> = ({
  commands,
  selectedTool,
  onSelectTool,
  onRunInTerminal,
  onNavigateToTutorial,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedWithComments, setCopiedWithComments] = useState(false);
  const [showFlags, setShowFlags] = useState(false);

  const activeCommand = commands.find(c => c.tool === selectedTool) || commands[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCommand.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyWithComments = () => {
    const annotated = `# ========================================================
# [Linux Student Tutorial Search Command]
# Tool: ${activeCommand.title}
# Description: ${activeCommand.description}
# --------------------------------------------------------
${activeCommand.flags.map(f => `# Flag ${f.flag}: ${f.meaning} - ${f.detail}`).join('\n')}
# ========================================================
${activeCommand.command}`;
    navigator.clipboard.writeText(annotated);
    setCopiedWithComments(true);
    setTimeout(() => setCopiedWithComments(false), 2000);
  };

  const handleDownloadScript = () => {
    const findCommand = commands.find(command => command.tool === 'find');
    let scriptCommand = activeCommand.command;
    let scriptExecution = activeCommand.command;
    const usesFindForScript = ['fd', 'fzf', 'ripgrep'].includes(activeCommand.tool);

    if (activeCommand.tool === 'fsearch') {
      if (!findCommand) {
        throw new Error('Could not generate the GNU find command for the downloaded script.');
      }

      const escapedQuery = activeCommand.command.replace(/'/g, "'\\''");
      scriptCommand = `FSearch GUI query: ${activeCommand.command} (uses find if FSearch is unavailable)`;
      scriptExecution = `fsearch_binary="$(command -v fsearch || true)"
if [[ -z "$fsearch_binary" && -x "$HOME/.local/bin/fsearch" ]]; then
  fsearch_binary="$HOME/.local/bin/fsearch"
fi

if [[ -n "$fsearch_binary" ]]; then
  "$fsearch_binary" >/dev/null 2>&1 &
  printf 'Enter this search query in FSearch: %s\\n' '${escapedQuery}'
else
  echo "FSearch is unavailable; running the equivalent search with GNU find." >&2
  ${findCommand.command}
fi

`;
    } else if (usesFindForScript) {
      if (!findCommand) {
        throw new Error('Could not generate the GNU find command for the downloaded script.');
      }

      if (activeCommand.tool === 'fd') {
        scriptCommand = findCommand.command;
        scriptExecution = findCommand.command;
      } else if (activeCommand.tool === 'ripgrep') {
        scriptCommand = `${activeCommand.command} (falls back to find if rg is unavailable)`;
        scriptExecution = `if command -v rg >/dev/null 2>&1; then
  ${activeCommand.command}
else
  echo "ripgrep (rg) is not installed; using GNU find instead." >&2
  ${findCommand.command}
fi`;
      } else {
        const fzfSeparator = activeCommand.command.indexOf('| fzf');
        if (fzfSeparator === -1) {
          throw new Error('Could not locate the fzf command in the generated script.');
        }

        const fzfCommand = activeCommand.command.slice(fzfSeparator + 2);
        scriptCommand = `(${findCommand.command}) | ${fzfCommand}`;
        scriptExecution = scriptCommand;
      }
    }

    const scriptContent = `#!/usr/bin/env bash
# ==============================================================================
# Linux & Zorin OS Fast File Search Script
# Generated from Student Tutorial Workbench
# Tool: ${activeCommand.title}
# Description: ${activeCommand.description}
# ${activeCommand.tool === 'fsearch' ? 'Uses FSearch when installed; otherwise runs the equivalent GNU find search.' : ''}
# ${usesFindForScript ? 'Uses GNU find for file listing when needed; fd/fzf/ripgrep are not required for fallback searches.' : ''}
# ==============================================================================

set -euo pipefail

echo "==> Running Linux File Search: ${activeCommand.title}..."
echo "==> Command: ${scriptCommand}"
echo ""

${scriptExecution}

echo ""
echo "==> Search finished."
`;
    const blob = new Blob([scriptContent], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search_${activeCommand.tool}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm space-y-4">
      {/* Tool Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {commands.map((cmd) => {
            const isSelected = cmd.tool === activeCommand.tool;
            return (
              <button
                key={cmd.tool}
                onClick={() => onSelectTool(cmd.tool)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent'
                }`}
              >
                <span>{cmd.title}</span>
                {cmd.recommended && (
                  <span className="px-1.5 py-0.2 text-[9px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded font-bold uppercase tracking-wider">
                    BEST
                  </span>
                )}
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Speed:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-mono text-[11px]">
            <Zap className="w-3 h-3" />
            {activeCommand.speedRating}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/50 font-mono text-[11px]">
            <ShieldCheck className="w-3 h-3" />
            No Sudo Needed
          </span>
        </div>
      </div>

      {/* Prominent Google Gemini Banner in the space provided directly under the tool buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-zinc-950 border border-purple-900/40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-zinc-900/90 border border-purple-500/40 shadow-inner flex-shrink-0">
            {/* Official Google Gemini Sparkle 4-point star Logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
              <path
                d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                fill="url(#gemini-logo-gradient)"
              />
              <defs>
                <linearGradient id="gemini-logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4E82EE" />
                  <stop offset="0.35" stopColor="#7E72ED" />
                  <stop offset="0.7" stopColor="#C460D3" />
                  <stop offset="1" stopColor="#EE6E73" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-wide">
                Google Gemini
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                AI Reference
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Need assistance with complex terminal scripts or Linux administration? Discover Google Gemini.
            </p>
          </div>
        </div>

        <a
          href="https://gemini.google/about/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold transition-all group shadow-sm flex-shrink-0"
          title="Learn more about Google Gemini"
        >
          <span>Explore Gemini</span>
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Description of active command & Tutorial header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs px-0.5">
        <span className="text-zinc-300">{activeCommand.description}</span>
        <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Student <strong className="font-bold text-amber-300">Tutorial</strong> Sandbox</span>
        </span>
      </div>

      {/* Terminal Command Box */}
      <div className="relative group bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-sm shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-2 overflow-x-auto text-cyan-300 py-1 scrollbar-thin scrollbar-thumb-zinc-800 flex-1">
            <span className="text-zinc-600 select-none font-bold">$</span>
            <span className="whitespace-pre-wrap break-all selection:bg-cyan-900 selection:text-white">
              {activeCommand.command}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
              }`}
              title="Copy bare command to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyWithComments}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shadow-md ${
                copiedWithComments
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-750'
              }`}
              title="Copy command with student tutorial explanations and flag comments"
            >
              {copiedWithComments ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedWithComments ? 'Copied!' : 'Annotated'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadScript}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-750 transition-all shadow-md"
              title="Download as runnable Linux bash script (search.sh)"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>.sh Script</span>
            </button>

            {activeCommand.tool !== 'fsearch' && (
              <button
                type="button"
                onClick={() => onRunInTerminal(activeCommand.command)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-900/30"
                title="Run in virtual Linux terminal simulator"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Run</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student Switch Decoder (Interactive Anatomy Breakdown) */}
      {activeCommand.tool !== 'fsearch' && (
        <CommandAnatomyExplainer
          command={activeCommand.command}
          tool={activeCommand.tool}
        />
      )}

      {/* Detailed Flag Reference (Collapsible) */}
      {activeCommand.flags.length > 0 && (
        <div className="border border-zinc-800/80 rounded-xl bg-zinc-950/60 overflow-hidden">
          <button
            onClick={() => setShowFlags(!showFlags)}
            className="w-full px-4 py-2 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-all font-medium"
          >
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reference Table: All {activeCommand.flags.length} Flags Explained</span>
            </div>
            {showFlags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFlags && (
            <div className="p-3 pt-0 border-t border-zinc-800/50 divide-y divide-zinc-800/40">
              {activeCommand.flags.map((item, idx) => (
                <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 text-xs">
                  <span className="font-mono text-cyan-400 font-semibold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 flex-shrink-0">
                    {item.flag}
                  </span>
                  <div className="text-zinc-300">
                    <span className="font-medium text-zinc-200">{item.meaning}: </span>
                    <span className="text-zinc-400">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
