/**
 * @file CommandAnatomyExplainer.tsx
 * @description Interactive visual switch decoder component for students and beginners.
 * Translates intimidating terminal syntax (like '+100M', '-type f', '2>/dev/null')
 * into plain English sentences and clickable anatomy cards.
 */

import React, { useState } from 'react';
import { explainCommandAnatomy, CommandToken } from '../utils/commandExplainer';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
} from 'lucide-react';

interface CommandAnatomyExplainerProps {
  command: string;
  tool: string;
}

export const CommandAnatomyExplainer: React.FC<CommandAnatomyExplainerProps> = ({
  command,
  tool,
}) => {
  const [selectedToken, setSelectedToken] = useState<CommandToken | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Compute educational breakdown
  const anatomy = explainCommandAnatomy(command, tool);

  const getTokenColor = (category: CommandToken['category']) => {
    switch (category) {
      case 'tool':
        return 'bg-purple-950/80 border-purple-700/80 text-purple-200 hover:bg-purple-900/60';
      case 'path':
        return 'bg-blue-950/80 border-blue-700/80 text-blue-200 hover:bg-blue-900/60';
      case 'switch':
        return 'bg-cyan-950/80 border-cyan-700/80 text-cyan-200 hover:bg-cyan-900/60';
      case 'shield':
        return 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200 hover:bg-emerald-900/60';
      case 'pipe':
      case 'action':
        return 'bg-amber-950/80 border-amber-700/80 text-amber-200 hover:bg-amber-900/60';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700';
    }
  };

  return (
    <div className="bg-zinc-950/90 border border-cyan-900/50 rounded-xl p-4 space-y-4 text-xs">
      {/* Header: Student Explainer Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block">
              Student Switch Decoder &amp; Anatomy
            </span>
            <span className="text-[11px] text-zinc-400">
              Click any colored block below to see what the letters and symbols mean!
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCheatSheet(!showCheatSheet)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{showCheatSheet ? 'Hide Symbol Cheatsheet' : 'What does + / - / f mean?'}</span>
        </button>
      </div>

      {/* Beginner Cheatsheet Drawer (Demystifying + / - / f / d / 2>/dev/null) */}
      {showCheatSheet && (
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-800/50 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>The 3 Most Puzzling Things for Linux Beginners:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
            {/* The Plus vs Minus Mystery */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
              <span className="font-bold text-rose-300 block">
                1. The Plus (+) vs Minus (-) Mystery
              </span>
              <p className="text-zinc-300">
                In Linux search tools, <code className="text-rose-400 font-mono font-bold">+</code> means <strong>MORE THAN</strong> and <code className="text-cyan-400 font-mono font-bold">-</code> means <strong>LESS THAN</strong>!
              </p>
              <div className="font-mono text-[10px] space-y-0.5 text-zinc-400 pt-1">
                <div>• <span className="text-rose-300 font-bold">+100M</span>: Larger than 100MB</div>
                <div>• <span className="text-cyan-300 font-bold">-10k</span>: Smaller than 10KB</div>
                <div>• <span className="text-cyan-300 font-bold">-mtime -7</span>: Less than 7 days ago (recent!)</div>
                <div>• <span className="text-rose-300 font-bold">-mtime +30</span>: More than 30 days ago (old!)</div>
              </div>
            </div>

            {/* The Letters Decoder */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
              <span className="font-bold text-cyan-300 block">
                2. Letters: f is FILE, d is DIRECTORY!
              </span>
              <p className="text-zinc-300">
                Students often assume "f" means folder. In Linux, <strong className="text-white">f = File</strong> and <strong className="text-white">d = Directory (folder)</strong>!
              </p>
              <div className="font-mono text-[10px] space-y-0.5 text-zinc-400 pt-1">
                <div>• <span className="text-cyan-300 font-bold">-type f</span> or <span className="text-cyan-300 font-bold">-t f</span>: Files only</div>
                <div>• <span className="text-amber-300 font-bold">-type d</span> or <span className="text-amber-300 font-bold">-t d</span>: Folders only</div>
                <div>• <span className="text-purple-300 font-bold">-t x</span>: Executable programs</div>
                <div>• <span className="text-emerald-300 font-bold">-e txt</span>: Extension = .txt</div>
              </div>
            </div>

            {/* Why 2>/dev/null */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
              <span className="font-bold text-emerald-300 block">
                3. What is 2&gt;/dev/null?
              </span>
              <p className="text-zinc-300">
                It's the <strong>"Mute Button"</strong> for permission denied errors when searching without sudo!
              </p>
              <div className="font-mono text-[10px] space-y-0.5 text-zinc-400 pt-1">
                <div>• <span className="text-emerald-400 font-bold">2</span>: Stream 2 (Error messages)</div>
                <div>• <span className="text-zinc-300 font-bold">&gt;</span>: Send / Redirect into</div>
                <div>• <span className="text-purple-300 font-bold">/dev/null</span>: Digital trash can</div>
                <div>• <em>Result: Zero ugly error spam!</em></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plain English Translation Sentence */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
          🗣️ Plain English Translation:
        </span>
        <p className="text-xs text-zinc-200 leading-relaxed">
          &ldquo;Hey computer: {anatomy.plainEnglishSentence}&rdquo;
        </p>
      </div>

      {/* Interactive Command Blocks (Clickable Tokens) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-zinc-400">
            Interactive Command Blocks (Click any block for full explanation):
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {anatomy.tokens.length} segments
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {anatomy.tokens.map((token, index) => {
            const isSelected = selectedToken?.text === token.text;
            return (
              <button
                key={index}
                onClick={() => setSelectedToken(token)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${getTokenColor(
                  token.category
                )} ${isSelected ? 'ring-2 ring-white shadow-lg scale-105' : ''}`}
                title={`Click to inspect ${token.text}`}
              >
                <span className="font-semibold">{token.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Detail Card */}
      {selectedToken && (
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-cyan-800/60 space-y-2 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-300 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                {selectedToken.text}
              </span>
              <span className="font-semibold text-white">{selectedToken.title}</span>
            </div>
            <button
              onClick={() => setSelectedToken(null)}
              className="text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Close
            </button>
          </div>

          <p className="text-zinc-300 leading-relaxed">
            <strong className="text-white">What it does: </strong>
            {selectedToken.plainEnglish}
          </p>

          <p className="text-zinc-400 leading-relaxed">
            <strong className="text-zinc-300">Why it exists: </strong>
            {selectedToken.whyThisExists}
          </p>

          {selectedToken.symbolBreakdown && (
            <div className="p-2.5 rounded bg-zinc-950 font-mono text-[11px] text-cyan-200/90 whitespace-pre-wrap border border-zinc-800">
              {selectedToken.symbolBreakdown}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
