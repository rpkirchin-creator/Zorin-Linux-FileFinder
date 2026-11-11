import React, { useState } from 'react';
import { ADMIN_BYPASS_STRATEGIES } from '../data/toolsComparison';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  AlertOctagon,
  Cpu,
  KeyRound,
  DownloadCloud,
  CheckCircle2,
} from 'lucide-react';

export const AdminBypassGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white mb-1">
              Mastering File Search Without Admin / Sudo Privileges
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              On managed corporate laptops, university lab PCs, or restricted user accounts in Zorin OS, you do not have root access (<code className="text-emerald-300 font-mono text-xs">sudo</code>). Here is how you bypass every standard limitation.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium">
                ✓ No root password needed
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium">
                ✓ Eliminates "Permission denied" terminal spam
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-medium">
                ✓ 100% portable binaries
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Core Solutions */}
      <div className="space-y-4">
        {ADMIN_BYPASS_STRATEGIES.map((strat, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-cyan-400 font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-white">{strat.title}</h3>
              </div>

              <button
                onClick={() => handleCopy(strat.solutionCommand, `strat-${idx}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex-shrink-0"
              >
                {copiedKey === `strat-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-zinc-400 pl-8 space-y-2">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="text-rose-400 font-semibold block mb-0.5">The Pain Point:</span>
                <span>{strat.problem}</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-900/30 font-mono text-cyan-300 text-xs">
                $ {strat.solutionCommand}
              </div>

              <p className="text-zinc-300 leading-relaxed">
                {strat.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The Portable User-Space Ecosystem (~/.local/bin) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              The "Golden Key": The ~/.local/bin Directory
            </h3>
            <p className="text-xs text-zinc-400">
              The official Linux standard for running software without system administrator permissions
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          On modern Linux and Zorin OS, Ubuntu automatically adds <code className="text-cyan-400 font-mono">~/.local/bin</code> to your PATH environment variable. Any executable file you place in this folder can be run in the terminal by just typing its name, exactly like system programs in <code className="text-zinc-400 font-mono">/usr/bin</code>!
        </p>

        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2">
          <div className="text-zinc-500"># 1. Create your user bin directory</div>
          <div className="text-cyan-300 font-semibold">mkdir -p ~/.local/bin</div>
          <div className="text-zinc-500 mt-2"># 2. Verify it is in your path</div>
          <div className="text-cyan-300 font-semibold">echo $PATH | grep -q ".local/bin" && echo "Active!" || echo 'export PATH="$HOME/.local/bin:$PATH"' &gt;&gt; ~/.bashrc</div>
          <div className="text-zinc-500 mt-2"># 3. Download standalone binaries (fd, fzf, ripgrep) directly here</div>
        </div>
      </div>

      {/* Disabling Tracker Miner to Save Battery & CPU */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Stopping the Sluggish Default "Tracker Miner" in Zorin OS
            </h3>
            <p className="text-xs text-zinc-400">
              How to stop the default file manager's indexing daemon from eating CPU without needing sudo
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          If your laptop fan spins up or typing in the file manager freezes your desktop, Tracker is likely struggling. You can stop or disable it for your user account:
        </p>

        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2">
          <div className="text-zinc-500"># Check tracker indexing status:</div>
          <div className="text-cyan-300">tracker3 status</div>
          <div className="text-zinc-500 mt-2"># Temporarily pause it:</div>
          <div className="text-cyan-300">tracker3 daemon pause</div>
          <div className="text-zinc-500 mt-2"># Permanently disable tracker for your user without root:</div>
          <div className="text-cyan-300">systemctl --user mask tracker-miner-fs-3 tracker-miner-rss-3</div>
        </div>
      </div>
    </div>
  );
};
