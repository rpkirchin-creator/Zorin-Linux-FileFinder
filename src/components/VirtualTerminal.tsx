import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { SIMULATED_FILES, formatBytes } from '../data/simulatedFileSystem';

interface TerminalLine {
  id: string;
  type: 'command' | 'stdout' | 'stderr' | 'system' | 'highlight';
  text: string;
}

interface VirtualTerminalProps {
  initialCommand?: string;
}

export const VirtualTerminal: React.FC<VirtualTerminalProps> = ({ initialCommand }) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'sys-1',
      type: 'system',
      text: 'Zorin OS 17.2 LTS (Kernel 6.8.0-generic x86_64)',
    },
    {
      id: 'sys-2',
      type: 'system',
      text: 'Type "help" for available commands, or run any "fd", "find", "rg", or "fzf" query.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCommand) {
      executeCommand(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Add command to terminal history
    const newLines: TerminalLine[] = [
      ...history,
      { id: `cmd-${Date.now()}`, type: 'command', text: trimmed },
    ];

    setCmdHistoryList(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Command Parser & Simulator
    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmed === 'help') {
      newLines.push(
        { id: `out-${Date.now()}-1`, type: 'highlight', text: 'Available simulated commands:' },
        { id: `out-${Date.now()}-2`, type: 'stdout', text: '  fd [pattern] [-e ext] [-S size] [-H]   : Modern fast search' },
        { id: `out-${Date.now()}-3`, type: 'stdout', text: '  find [path] -name [pattern] 2>/dev/null: Classic search' },
        { id: `out-${Date.now()}-4`, type: 'stdout', text: '  rg "term"                              : Ripgrep text search inside files' },
        { id: `out-${Date.now()}-5`, type: 'stdout', text: '  fzf                                    : Interactive fuzzy finder' },
        { id: `out-${Date.now()}-6`, type: 'stdout', text: '  ls [-la]                               : List directory files' },
        { id: `out-${Date.now()}-7`, type: 'stdout', text: '  cat ~/.bashrc                          : View aliases & PATH' },
        { id: `out-${Date.now()}-8`, type: 'stdout', text: '  fsearch                                : Launch GUI FSearch' },
        { id: `out-${Date.now()}-9`, type: 'stdout', text: '  clear                                  : Clear terminal window' }
      );
      setHistory(newLines);
      return;
    }

    if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'ls -l') {
      newLines.push(
        { id: `out-${Date.now()}-1`, type: 'stdout', text: 'drwxr-xr-x 12 zorin zorin  4096 Nov 11 09:30 Documents' },
        { id: `out-${Date.now()}-2`, type: 'stdout', text: 'drwxr-xr-x  8 zorin zorin  4096 Nov 11 09:25 Downloads' },
        { id: `out-${Date.now()}-3`, type: 'stdout', text: 'drwxr-xr-x  5 zorin zorin  4096 Nov 10 18:20 Pictures' },
        { id: `out-${Date.now()}-4`, type: 'stdout', text: 'drwxr-xr-x  4 zorin zorin  4096 Nov 11 08:45 Projects' },
        { id: `out-${Date.now()}-5`, type: 'stdout', text: '-rw-r--r--  1 zorin zorin  4200 Nov 07 14:10 .bashrc' },
        { id: `out-${Date.now()}-6`, type: 'stdout', text: 'drwxr-xr-x  6 zorin zorin  4096 Nov 05 11:15 .config' },
        { id: `out-${Date.now()}-7`, type: 'stdout', text: 'drwxr-xr-x  3 zorin zorin  4096 Oct 22 10:00 .local' }
      );
      setHistory(newLines);
      return;
    }

    if (trimmed === 'cat ~/.bashrc') {
      newLines.push(
        { id: `out-${Date.now()}-1`, type: 'highlight', text: '# ~/.bashrc file search enhancements' },
        { id: `out-${Date.now()}-2`, type: 'stdout', text: 'alias ff="fd --type f --hidden"' },
        { id: `out-${Date.now()}-3`, type: 'stdout', text: 'alias fif="rg --hidden --files | fzf --preview \'bat --color=always {}\'"' },
        { id: `out-${Date.now()}-4`, type: 'stdout', text: 'export PATH="$HOME/.local/bin:$PATH"' }
      );
      setHistory(newLines);
      return;
    }

    if (trimmed.startsWith('fsearch')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'highlight',
        text: '⚡ Launching FSearch GUI (v0.2.3)... Database loaded in 4.2ms. Indexed 1,280,440 files into memory.',
      });
      setHistory(newLines);
      return;
    }

    // Process find / fd / rg / fzf
    const isFind = trimmed.startsWith('find');
    const isFd = trimmed.startsWith('fd');
    const isRg = trimmed.startsWith('rg');
    const isFzf = trimmed.includes('fzf');

    const suppressErrors = trimmed.includes('2>/dev/null') || trimmed.includes('-readable');

    // Filter simulation
    let matches = [...SIMULATED_FILES];

    // Check extension filter
    const extMatch = trimmed.match(/-e\s+["']?([a-zA-Z0-9]+)["']?|-iname\s+["']\*\.([a-zA-Z0-9]+)["']|-g\s+["']\*\.([a-zA-Z0-9]+)["']/);
    if (extMatch) {
      const ext = (extMatch[1] || extMatch[2] || extMatch[3]).toLowerCase();
      matches = matches.filter(f => f.extension.toLowerCase() === ext);
    }

    // Check size filter
    if (trimmed.includes('+100m') || trimmed.includes('+100M')) {
      matches = matches.filter(f => f.sizeBytes > 100 * 1024 * 1024);
    } else if (trimmed.includes('+1g') || trimmed.includes('+1G')) {
      matches = matches.filter(f => f.sizeBytes > 1024 * 1024 * 1024);
    }

    // Check hidden flag
    if (!trimmed.includes('-H') && !trimmed.includes('--hidden') && !trimmed.includes('.bashrc') && !trimmed.includes('.config')) {
      matches = matches.filter(f => !f.isHidden);
    }

    // Check content search
    if (isRg) {
      const contentTermMatch = trimmed.match(/"([^"]+)"|'([^']+)'/);
      if (contentTermMatch) {
        const term = (contentTermMatch[1] || contentTermMatch[2]).toLowerCase();
        matches = matches.filter(f => f.contentSnippet?.toLowerCase().includes(term));
      }
    }

    // Handle Permission Denied for standard find without 2>/dev/null
    if (isFind && !suppressErrors && (trimmed.includes('/') || trimmed.includes('/var') || trimmed.includes('/etc'))) {
      newLines.push(
        { id: `err-${Date.now()}-1`, type: 'stderr', text: 'find: ‘/var/log/syslog’: Permission denied' },
        { id: `err-${Date.now()}-2`, type: 'stderr', text: 'find: ‘/var/log/auth.log’: Permission denied' },
        { id: `err-${Date.now()}-3`, type: 'stderr', text: 'find: ‘/etc/shadow’: Permission denied' }
      );
    }

    if (matches.length === 0) {
      newLines.push({
        id: `out-${Date.now()}-none`,
        type: 'system',
        text: '(No matching files found)',
      });
    } else {
      matches.forEach(m => {
        newLines.push({
          id: `out-${Date.now()}-${m.id}`,
          type: 'stdout',
          text: `${m.path}  (${formatBytes(m.sizeBytes)})`,
        });
      });
    }

    setHistory(newLines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    executeCommand(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistoryList.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistoryList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(cmdHistoryList[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistoryList.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(cmdHistoryList[nextIndex]);
      }
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-zinc-400 font-medium ml-2 text-[11px]">
            zorin@zorin-os: ~ (Bash 5.2)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
            title="Clear terminal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 space-y-1.5 min-h-[300px] max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
        {history.map(item => {
          if (item.type === 'command') {
            return (
              <div key={item.id} className="flex items-start gap-2 pt-1 text-zinc-100">
                <span className="text-emerald-400 font-bold select-none">zorin@zorin-os:~$</span>
                <span className="font-semibold">{item.text}</span>
              </div>
            );
          }
          if (item.type === 'stderr') {
            return (
              <div key={item.id} className="text-rose-400 pl-4">
                {item.text}
              </div>
            );
          }
          if (item.type === 'highlight') {
            return (
              <div key={item.id} className="text-cyan-400 font-semibold pl-4">
                {item.text}
              </div>
            );
          }
          if (item.type === 'system') {
            return (
              <div key={item.id} className="text-zinc-500 italic">
                {item.text}
              </div>
            );
          }
          return (
            <div key={item.id} className="text-zinc-300 pl-4 hover:text-white transition-colors">
              {item.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-800/80 bg-zinc-900/50 p-3 flex items-center gap-2">
        <span className="text-emerald-400 font-bold select-none text-xs">
          zorin@zorin-os:~$
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command here (e.g. fd -e pdf, or help)..."
          className="flex-1 bg-transparent text-zinc-100 text-xs focus:outline-none caret-cyan-400 placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1 transition-all"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Run</span>
        </button>
      </form>
    </div>
  );
};
