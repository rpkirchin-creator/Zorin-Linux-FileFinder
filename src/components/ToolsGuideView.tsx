import React, { useState } from 'react';
import { TOOLS_DIRECTORY } from '../data/toolsComparison';
import {
  Zap,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Keyboard,
  ShieldCheck,
  HardDrive,
  AlertTriangle,
  FolderSearch,
  Sparkles,
} from 'lucide-react';

export const ToolsGuideView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Why Default File Managers Fail Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white mb-1">
              Why Zorin OS &amp; GNOME Files (Nautilus) Search Feels So Slow and Useless
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Zorin OS is built on Ubuntu and GNOME. By default, it relies on a background indexing daemon called <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">tracker-miner-fs</code>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="font-semibold text-zinc-200 block mb-1">1. Narrow Indexing</span>
                Nautilus only indexes your home user directories. Searching root, external drives, or system folders causes it to crawl one file at a time, freezing the UI.
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="font-semibold text-zinc-200 block mb-1">2. Tracker Throttling</span>
                Tracker frequently pauses on battery power or when CPU load is high, causing file searches to miss files created recently.
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="font-semibold text-zinc-200 block mb-1">3. Lack of Fast Filtering</span>
                Nautilus lacks regex, size ranges, instant extension filters, or interactive live previews.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Tools Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">The 4 Definitive Search Tools for Linux &amp; Zorin OS</h2>
            <p className="text-xs text-zinc-400">Choose GUI if you like visual windows, or CLI for instant terminal superpower</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {TOOLS_DIRECTORY.map(tool => (
            <div
              key={tool.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-zinc-700 transition-all"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-zinc-800 text-cyan-400 border border-zinc-700 rounded-full">
                      {tool.category}
                    </span>
                    {tool.id === 'fsearch' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full uppercase tracking-wider">
                        Top GUI Choice (Like Everything)
                      </span>
                    )}
                    {tool.id === 'fd' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full uppercase tracking-wider">
                        Top Terminal Choice
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-cyan-300 font-medium">{tool.tagline}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Search Speed:</span>
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg">
                    {tool.speed}
                  </span>
                </div>
              </div>

              {/* Why & Best For */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <span className="font-semibold text-zinc-300 block mb-1">Why It Beats the Default File Manager:</span>
                  <p className="text-zinc-400 leading-relaxed">{tool.whyUseIt}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <span className="font-semibold text-zinc-300 block mb-1">Best Used For:</span>
                  <p className="text-zinc-400 leading-relaxed">{tool.bestFor}</p>
                </div>
              </div>

              {/* No-Admin / Sudo Method */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>How to Install WITHOUT Root/Admin Password ({tool.installWithoutAdmin.methodName})</span>
                  </div>

                  <button
                    onClick={() => handleCopy(tool.installWithoutAdmin.command, `no-admin-${tool.id}`)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
                  >
                    {copiedId === `no-admin-${tool.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Install Command</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                  {tool.installWithoutAdmin.command}
                </pre>
                <p className="text-[11px] text-zinc-400">
                  ℹ️ {tool.installWithoutAdmin.notes}
                </p>
              </div>

              {/* Quick Usage Tips */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2">
                  Key Shortcuts &amp; Everyday Syntax:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {tool.keyHotkeysOrUsage.map((tip, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-300 flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">&gt;</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to bind FSearch to a Global Hotkey in Zorin OS */}
      <div className="bg-zinc-900 border border-cyan-800/40 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Pro-Tip: Bind FSearch to Super + F (or Ctrl + Space) in Zorin OS
            </h3>
            <p className="text-xs text-zinc-400">
              Open your instant search tool in 0.1 seconds from anywhere on your desktop
            </p>
          </div>
        </div>

        <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 pl-2 leading-relaxed">
          <li>Open <strong>Zorin Settings</strong> (press Super key and type "Settings").</li>
          <li>Go to <strong>Keyboard</strong> &rarr; <strong>View and Customize Shortcuts</strong> &rarr; <strong>Custom Shortcuts</strong>.</li>
          <li>Click <strong>+</strong> to add a new shortcut:</li>
          <li className="font-mono text-cyan-300 ml-4">Name: FSearch Fast Finder</li>
          <li className="font-mono text-cyan-300 ml-4">Command: fsearch (or ~/.local/bin/fsearch)</li>
          <li className="font-mono text-cyan-300 ml-4">Shortcut: Super + F or Ctrl + Space</li>
          <li>Now press that shortcut anytime to bring up instant file search with zero lag!</li>
        </ol>
      </div>
    </div>
  );
};
