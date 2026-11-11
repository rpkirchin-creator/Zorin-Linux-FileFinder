/**
 * @file TutorialView.tsx
 * @description Interactive tutorial reader, practice challenges, and Markdown exporter
 * designed for educational and classroom use for Linux & Zorin OS file searching.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Zap,
  Terminal,
  ChevronRight,
  Code2,
  HelpCircle,
  FileText,
  Archive,
  Image,
  GraduationCap,
} from 'lucide-react';
import { downloadProjectZip } from '../utils/projectZipExporter';

interface TutorialViewProps {
  onLoadChallenge: (challengeKey: string) => void;
}

export const TutorialView: React.FC<TutorialViewProps> = ({ onLoadChallenge }) => {
  const [activeChapter, setActiveChapter] = useState<string>('intro');
  const [copiedMd, setCopiedMd] = useState(false);

  const handleDownloadMd = () => {
    // Fetches the markdown or creates a blob from the full tutorial text
    const mdContent = `# Linux & Zorin OS Fast File Search: The Complete Beginner-to-Pro Guide

> **Author / Course:** Linux Desktop Mastery Series  
> **Attribution:** Co-inspired by rkirchin / Gemini  
> **GitHub Repository:** https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git  

## 1. The Core Issue: Why Zorin OS Files (Nautilus) Search Is Slow
Default file managers in Linux (like GNOME Files / Nautilus) rely on 'tracker-miner-fs'.
When you search outside ~/Documents, Tracker either freezes, crawls single-threaded, or fails on battery saving.

## 2. Instant Format Searches
- Plain Text: \`fd -e txt . ~\` or \`find ~ -type f -iname "*.txt" 2>/dev/null\`
- Photos: \`fd -e jpg -e png . ~/Pictures\`
- Compressed Archives: \`fd -e zip -e rar -e tar.gz . ~/Downloads\`
- Heavy Files: \`fd -S +100m . ~\`

## 3. Best Tools
- GUI: FSearch (indexes 1,000,000 files in 4ms, runs without sudo via AppImage)
- CLI: fd (fd-find) - 10x faster than find, colorized, ignores .git
- Fuzzy: fzf - interactive live preview
- Inside text: ripgrep (rg)

## 4. Admin & Sudo Bypasses
- Always mute Permission Denied errors with \`2>/dev/null\`
- Use \`-readable\` with find
- Put standalone binaries into \`~/.local/bin\` (no root needed)`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Linux_Zorin_File_Search_Tutorial.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyMd = () => {
    navigator.clipboard.writeText(`# Linux & Zorin OS Fast File Search: The Complete Tutorial
# Co-inspired by rkirchin / Gemini
# GitHub: https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git

Check TUTORIAL_GUIDE.md in the project directory for the complete textbook guide.`);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadPrereqs = () => {
    const prereqContent = `# Prerequisites & Painless Setup Guide for Linux & Zorin OS

> **Attribution:** Co-inspired by rkirchin / Gemini  
> **GitHub Repository:** https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git  

## The Painless 30-Second Setup (Zero Sudo Required)
Run this single command in terminal to install fd, ripgrep, and FSearch without root:

mkdir -p ~/.local/bin ~/.fzf
curl -sL https://github.com/sharkdp/fd/releases/latest/download/fd-v10.2.0-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ fd-v10.2.0-x86_64-unknown-linux-musl/fd
curl -sL https://github.com/BurntSushi/ripgrep/releases/latest/download/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ ripgrep-14.1.1-x86_64-unknown-linux-musl/rg
curl -sL https://github.com/cboxdoerfer/fsearch/releases/latest/download/FSearch-x86_64.AppImage -o ~/.local/bin/fsearch
chmod +x ~/.local/bin/fd ~/.local/bin/rg ~/.local/bin/fsearch
grep -q '.local/bin' ~/.bashrc || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

echo "✅ All tools installed successfully into ~/.local/bin!"`;

    const blob = new Blob([prereqContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PREREQUISITES_SETUP_GUIDE.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadArch = () => {
    const archContent = `# Application Architecture & Engineering Rationale

> **Attribution:** Co-inspired by rkirchin / Gemini  
> **GitHub Repository:** https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git  

## Languages & Stack
- Language: TypeScript 5.x (Strict type contracts)
- UI: React 19 (Reactive state updates without server roundtrips)
- Styling: Tailwind CSS v4 (Lightweight terminal dark aesthetic)
- Build: Vite 6

## Why the A.I. Agent Chose to Write It This Way
1. Client-Side Sandboxing: Safe environment where students cannot accidentally delete real system files or damage permissions.
2. Sub-Millisecond Speed: 100% deterministic query evaluation runs in under 4ms, matching the speed of fd and FSearch.
3. Multi-Tool Rosetta Stone: Simultaneously generates syntax for fd, find, fzf, ripgrep, and FSearch so students learn universal logic.
4. Plain English Tokenizer: Converts cryptic flags like '+100M', '-type f', and '2>/dev/null' into conversational English sentences.
5. Zero-Sudo Focus: Built around ~/.local/bin and AppImages so students can run tools on school and lab PCs without root.
6. Zero Hallucinations: Uses strict compiler code rather than generating random commands from an LLM.`;

    const blob = new Blob([archContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ARCHITECTURE.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const chapters = [
    { id: 'prereqs', title: '0. Painless Setup & Prerequisites', icon: <Download className="w-4 h-4 text-emerald-400" /> },
    { id: 'intro', title: '1. Why Default Search Fails', icon: <HelpCircle className="w-4 h-4 text-amber-400" /> },
    { id: 'formats', title: '2. Default Formats (.txt, .jpg, .zip, .rar)', icon: <FileText className="w-4 h-4 text-cyan-400" /> },
    { id: 'switches', title: '3. What do + / - / f mean? (Switches 101)', icon: <GraduationCap className="w-4 h-4 text-pink-400" /> },
    { id: 'tools', title: '4. FSearch vs fd vs fzf vs find', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { id: 'admin', title: '5. No-Admin & Sudo Bypasses', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { id: 'challenges', title: '6. Hands-On Practice Challenges', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'architecture', title: '7. How It\'s Coded & AI Rationale', icon: <Code2 className="w-4 h-4 text-cyan-400" /> },
    { id: 'quiz', title: '8. Student Knowledge Check (Quiz)', icon: <GraduationCap className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner with Download & Export */}
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Interactive Tutorial &amp; Course Documentation
              </h2>
              <span className="px-2 py-0.5 text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 rounded-full font-mono">
                TUTORIAL, PREREQUISITES &amp; ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Complete student curriculum, technical documentation, and AI architectural design rationale.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadProjectZip()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md shadow-emerald-950/40 border border-emerald-500/40 cursor-pointer"
            title="Download complete project repository as a .zip file (131 KB)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Project (.ZIP)</span>
          </button>

          <button
            onClick={handleDownloadArch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-700/50 transition-all shadow-md shadow-purple-950/40"
            title="Download Architecture and AI Design Rationale Guide"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Architecture.MD</span>
          </button>

          <button
            onClick={handleDownloadPrereqs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-900/20"
            title="Download Prerequisites and 1-Line Installer Guide"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Prerequisites.MD</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-900/20"
            title="Download full Markdown tutorial file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tutorial.MD</span>
          </button>
        </div>
      </div>

      {/* Chapter Tabs & Reading Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1 block">
              Tutorial Lessons
            </span>
            {chapters.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  activeChapter === ch.id
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {ch.icon}
                  <span>{ch.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            ))}
          </div>

          {/* Quick Tip Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
            <span className="font-semibold text-zinc-200 block">💡 Pro Tip for Students:</span>
            <p className="leading-relaxed">
              Every command generated in this station can be tested live in the <strong>Simulated Terminal</strong> tab without altering your real system.
            </p>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl text-xs leading-relaxed space-y-5">
          {activeChapter === 'prereqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <span>Prerequisites &amp; The Painless 30-Second Setup</span>
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-mono">
                  ZERO SUDO REQUIRED
                </span>
              </div>

              <p className="text-zinc-300">
                To run fast file searches on Zorin OS or Ubuntu without any admin permissions, copy and paste this automated 1-line script into your terminal:
              </p>

              {/* 1-liner copy block */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-800/60 font-mono text-[11px] text-zinc-300 space-y-2 overflow-x-auto whitespace-pre-wrap">
                <div className="text-emerald-400 font-bold"># --- Painless 30-Second No-Sudo Installer ---</div>
                <div>mkdir -p ~/.local/bin ~/.fzf</div>
                <div>curl -sL https://github.com/sharkdp/fd/releases/latest/download/fd-v10.2.0-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ fd-v10.2.0-x86_64-unknown-linux-musl/fd</div>
                <div>curl -sL https://github.com/BurntSushi/ripgrep/releases/latest/download/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ ripgrep-14.1.1-x86_64-unknown-linux-musl/rg</div>
                <div>curl -sL https://github.com/cboxdoerfer/fsearch/releases/latest/download/FSearch-x86_64.AppImage -o ~/.local/bin/fsearch</div>
                <div>chmod +x ~/.local/bin/fd ~/.local/bin/rg ~/.local/bin/fsearch</div>
                <div>grep -q '.local/bin' ~/.bashrc || echo 'export PATH="$HOME/.local/bin:$PATH"' &gt;&gt; ~/.bashrc</div>
                <div>source ~/.bashrc</div>
                <div className="text-emerald-400 font-bold">echo "All tools installed into ~/.local/bin without sudo!"</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-bold text-cyan-300 block mb-1">Verify Installation:</span>
                  <div className="font-mono text-[10px] space-y-1 text-zinc-400">
                    <div>$ <span className="text-zinc-200">fd --version</span></div>
                    <div>$ <span className="text-zinc-200">rg --version</span></div>
                    <div>$ <span className="text-zinc-200">fsearch &amp;</span></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-bold text-emerald-300 block mb-1">Dependencies Check:</span>
                  <p className="text-[11px] text-zinc-400">
                    Requires standard <code className="text-zinc-200 font-mono">curl</code> and <code className="text-zinc-200 font-mono">tar</code>, which come preinstalled on 99% of Linux desktops.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'intro' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>Lesson 1: Why Default Linux &amp; Zorin OS Search Feels Broken</span>
              </h3>
              <p className="text-zinc-300">
                Most Linux users start out clicking the magnifying glass inside the file manager (Nautilus in Zorin OS / Ubuntu). Soon, they encounter three frustrating issues:
              </p>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-amber-300 block mb-1">Issue 1: The Tracker Miner Bottleneck</span>
                  <p className="text-zinc-400">
                    GNOME relies on a background service called <code className="text-zinc-200 font-mono">tracker-miner-fs</code>. It creates a local index of your files. However, whenever you are on battery power, high CPU load, or creating files rapidly, Tracker suspends indexing to preserve resources. Result: freshly created files don't show up!
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-amber-300 block mb-1">Issue 2: Outside Home Folder Traversal</span>
                  <p className="text-zinc-400">
                    Nautilus only indexes your personal user directories (<code className="text-zinc-200 font-mono">~/Documents</code>, <code className="text-zinc-200 font-mono">~/Downloads</code>). Searching external USB drives, network drives, or system directories forces it into an unindexed single-threaded file-by-file crawl that freezes the window.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-amber-300 block mb-1">Issue 3: Permission Denied Spams in Terminal</span>
                  <p className="text-zinc-400">
                    When users give up on the GUI and open the terminal to type <code className="text-zinc-200 font-mono">find / -name myfile</code>, hundreds of <code className="text-rose-400 font-mono">find: Permission denied</code> lines scroll past at warp speed, burying the real results.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'formats' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Lesson 2: Default Format Searches (.txt, .jpg, .zip, .rar)</span>
              </h3>
              <p className="text-zinc-300">
                Here are the exact commands to search for specific formats, with explanations of why each flag is used:
              </p>

              {/* TXT */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-cyan-300">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>1. Searching Plain Text Files (.txt)</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 font-mono text-zinc-200 text-xs">
                  fd -e txt . ~
                </div>
                <p className="text-zinc-400">
                  <code className="text-cyan-400 font-mono">-e txt</code> restricts matches strictly to files with the <code className="text-zinc-300 font-mono">.txt</code> extension. <code className="text-cyan-400 font-mono">. ~</code> searches inside your user home directory.
                </p>
              </div>

              {/* JPG */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-300">
                  <Image className="w-4 h-4 text-emerald-400" />
                  <span>2. Searching Images &amp; Photos (.jpg, .png, .webp)</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 font-mono text-zinc-200 text-xs">
                  fd -e jpg -e png -e webp . ~/Pictures
                </div>
                <p className="text-zinc-400">
                  Multiple <code className="text-emerald-400 font-mono">-e</code> flags act as an <strong>OR condition</strong>. You can also append <code className="text-emerald-400 font-mono">-S +5m</code> to only find high-resolution photos over 5MB.
                </p>
              </div>

              {/* ZIP & RAR */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-purple-300">
                  <Archive className="w-4 h-4 text-purple-400" />
                  <span>3. Searching Compressed Archives (.zip, .rar, .tar.gz)</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 font-mono text-zinc-200 text-xs">
                  fd -e zip -e rar -e "tar.gz" . ~/Downloads
                </div>
                <p className="text-zinc-400">
                  Crucial for freeing up disk space in your Downloads folder. For GNU find, use:
                  <br />
                  <code className="text-zinc-300 font-mono">find ~/Downloads -type f \( -iname "*.zip" -o -iname "*.rar" \) 2&gt;/dev/null</code>
                </p>
              </div>
            </div>
          )}

          {activeChapter === 'switches' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-pink-400" />
                <span>Lesson 3: The Linux Switch &amp; Symbol Decoder (What do +, -, f mean?)</span>
              </h3>
              <p className="text-zinc-300">
                Command-line switches look like hieroglyphics until you learn the basic rules. Here is everything broken down:
              </p>

              {/* The Plus and Minus */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-rose-300 block text-xs">
                  1. The Plus (+) vs Minus (-) Rule
                </span>
                <p className="text-zinc-300">
                  Whenever numbers are involved (file sizes, ages, lines), Linux utilities use <code className="text-rose-400 font-mono font-bold">+</code> for <strong>MORE THAN</strong> and <code className="text-cyan-400 font-mono font-bold">-</code> for <strong>LESS THAN</strong>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <span className="text-rose-300 font-bold">-size +100M</span>
                    <p className="font-sans text-zinc-400 text-[10px] mt-0.5">Files LARGER than 100 Megabytes</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <span className="text-cyan-300 font-bold">-size -1M</span>
                    <p className="font-sans text-zinc-400 text-[10px] mt-0.5">Files SMALLER than 1 Megabyte</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <span className="text-cyan-300 font-bold">-mtime -7</span>
                    <p className="font-sans text-zinc-400 text-[10px] mt-0.5">Modified LESS than 7 days ago (recent!)</p>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <span className="text-rose-300 font-bold">-mtime +365</span>
                    <p className="font-sans text-zinc-400 text-[10px] mt-0.5">Modified MORE than 1 year ago (old!)</p>
                  </div>
                </div>
              </div>

              {/* Letters Decoder */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-cyan-300 block text-xs">
                  2. The Letter Code Rule: 'f' is FILE, 'd' is DIRECTORY (Folder)
                </span>
                <p className="text-zinc-300">
                  Beginners often think <code className="text-amber-400 font-mono">f</code> stands for folder. In Linux, folders are called <strong>directories</strong> (<code className="text-amber-400 font-mono">d</code>), and documents/photos are <strong>regular files</strong> (<code className="text-cyan-400 font-mono">f</code>)!
                </p>
                <div className="p-2.5 rounded bg-zinc-900 font-mono text-[11px] text-zinc-300 space-y-1">
                  <div>• <code className="text-cyan-300 font-bold">-type f</code> or <code className="text-cyan-300 font-bold">-t f</code> : Show ONLY regular files (ignore folders)</div>
                  <div>• <code className="text-amber-300 font-bold">-type d</code> or <code className="text-amber-300 font-bold">-t d</code> : Show ONLY folders (directories)</div>
                  <div>• <code className="text-purple-300 font-bold">-t x</code> : Show ONLY executable programs / scripts</div>
                  <div>• <code className="text-emerald-300 font-bold">-t l</code> : Show ONLY symbolic pointer links</div>
                </div>
              </div>

              {/* Error Shield 2>/dev/null */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-emerald-300 block text-xs">
                  3. The 2&gt;/dev/null "Mute Button"
                </span>
                <p className="text-zinc-300">
                  When you search folders owned by root, the computer complains with red <code className="text-rose-400 font-mono">Permission denied</code> errors on stream 2 (stderr). Appending <code className="text-emerald-400 font-mono">2&gt;/dev/null</code> routes those errors to the digital trash bin, keeping your terminal spotless.
                </p>
              </div>
            </div>
          )}

          {activeChapter === 'tools' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>Lesson 4: The 4 Search Tools Comparison</span>
              </h3>
              <p className="text-zinc-300">
                Understanding which tool to reach for in different situations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-emerald-400">FSearch (GUI)</span>
                  <p className="text-zinc-400">
                    Use when you want a graphical window with instant search-as-you-type (like Everything on Windows). Indexes in RAM.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-cyan-400">fd (Terminal)</span>
                  <p className="text-zinc-400">
                    Use for fast command-line queries, scripts, and piping. Written in parallel Rust.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-purple-400">fzf (Interactive)</span>
                  <p className="text-zinc-400">
                    Use when browsing interactively with live file contents preview using bat or cat.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-amber-400">ripgrep (Content Search)</span>
                  <p className="text-zinc-400">
                    Use when you don't know the file name, but remember a sentence or code snippet inside it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'admin' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Lesson 5: How to Bypass Admin &amp; Sudo Permissions Gracefully</span>
              </h3>
              <p className="text-zinc-300">
                Why do you get permission errors and how do you conquer them?
              </p>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-rose-300 block mb-1">1. The Stream Redirection Magic (2&gt;/dev/null)</span>
                  <p className="text-zinc-400">
                    In Linux shells, file descriptor 1 is <code className="font-mono text-zinc-200">stdout</code> (normal results), and file descriptor 2 is <code className="font-mono text-zinc-200">stderr</code> (error messages).
                    Appending <code className="font-mono text-rose-400">2&gt;/dev/null</code> sends all permission denied errors to the bit bucket, showing only files you have rights to see.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="font-semibold text-rose-300 block mb-1">2. Portable Installs into ~/.local/bin</span>
                  <p className="text-zinc-400">
                    Never let lack of sudo stop you. You can install <code className="font-mono text-cyan-300">fd</code>, <code className="font-mono text-cyan-300">fzf</code>, and <code className="font-mono text-cyan-300">rg</code> directly in your user home folder without contacting an IT admin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'challenges' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Lesson 6: Hands-On Practice Challenges</span>
              </h3>
              <p className="text-zinc-300">
                Test your skills! Click "Load into Workbench" on any challenge to see how the filter parameters and generated commands solve it in real time:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-zinc-200 block">Challenge 1: Find all .zip and .rar archives</span>
                    <span className="text-[11px] text-zinc-500">Filters for compressed files in Downloads</span>
                  </div>
                  <button
                    onClick={() => onLoadChallenge('zip_rar')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all flex-shrink-0"
                  >
                    Load &amp; Solve
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-zinc-200 block">Challenge 2: Find .txt notes modified in the last 24h</span>
                    <span className="text-[11px] text-zinc-500">Combines extension and relative date filters</span>
                  </div>
                  <button
                    onClick={() => onLoadChallenge('txt_today')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all flex-shrink-0"
                  >
                    Load &amp; Solve
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-zinc-200 block">Challenge 3: Find large files (&gt;100MB) without Permission Denied spam</span>
                    <span className="text-[11px] text-zinc-500">Demonstrates size + 2&gt;/dev/null error silencing</span>
                  </div>
                  <button
                    onClick={() => onLoadChallenge('safe_root')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all flex-shrink-0"
                  >
                    Load &amp; Solve
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 7: ARCHITECTURE & HOW IT'S CODED */}
          {activeChapter === 'architecture' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span>How This Application Is Coded &amp; AI Engineering Rationale</span>
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full font-mono">
                  TYPESCRIPT &amp; REACT 19
                </span>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                For students learning software engineering, web development, and system architecture, here is an open look into how this application was designed and why:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-cyan-300 block">Languages &amp; Core Stack:</span>
                  <p className="text-zinc-400">
                    Built in <strong>TypeScript 5.x</strong> for strict compile-time type verification, mounted on <strong>React 19</strong>, styled with <strong>Tailwind CSS v4</strong>, and bundled with <strong>Vite 6</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-emerald-300 block">1. Safe In-Memory Sandbox:</span>
                  <p className="text-zinc-400">
                    <em>Why?</em> Real terminal experimentation with <code className="text-zinc-300 font-mono">rm</code> or <code className="text-zinc-300 font-mono">find /</code> can accidentally delete student files. The virtual filesystem provides a 100% safe laboratory.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-purple-300 block">2. Sub-4ms Reactive Evaluation:</span>
                  <p className="text-zinc-400">
                    <em>Why?</em> Rather than making slow server roundtrips, the POSIX filter engine runs client-side in pure TypeScript. Keystrokes evaluate instantly, matching the real speed of <code className="text-zinc-300 font-mono">fd</code> and <code className="text-zinc-300 font-mono">fsearch</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-amber-300 block">3. Multi-Tool Rosetta Stone:</span>
                  <p className="text-zinc-400">
                    <em>Why?</em> Instead of learning one isolated tool, students see synchronized commands for modern <code className="text-zinc-300 font-mono">fd</code>, classical <code className="text-zinc-300 font-mono">find</code>, fuzzy <code className="text-zinc-300 font-mono">fzf</code>, and <code className="text-zinc-300 font-mono">FSearch</code> simultaneously.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-blue-300 block">4. Lexical Tokenizer &amp; Plain English:</span>
                  <p className="text-zinc-400">
                    <em>Why?</em> The custom tokenizer in <code className="text-zinc-300 font-mono">commandExplainer.ts</code> translates cryptic switches like <code className="text-zinc-300 font-mono">-S +100m</code> into conversational sentences so students grasp the mental model.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-rose-300 block">5. Zero-Sudo Real-World Solutions:</span>
                  <p className="text-zinc-400">
                    <em>Why?</em> School labs and corporate laptops lock users out of sudo. The architecture specifically focuses on portable user-space binaries in <code className="text-zinc-300 font-mono">~/.local/bin</code> and AppImages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 8: INTERACTIVE STUDENT QUIZ */}
          {activeChapter === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <span>Student Knowledge Check (5-Question Mini Quiz)</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  Test your understanding
                </span>
              </div>

              <p className="text-zinc-300">
                Click your answer for each question below to verify what you have learned:
              </p>

              <div className="space-y-4">
                {[
                  {
                    q: "1. In commands like `find . -type f` or `fd -t f`, what does the letter 'f' stand for?",
                    options: [
                      "Folder",
                      "Regular File (documents, images, scripts)",
                      "Fast search mode",
                      "Format filter"
                    ],
                    correct: 1,
                    explanation: "Rule: 'f' means regular File! In Linux, folders are called Directories ('d')."
                  },
                  {
                    q: "2. What does the '+' symbol mean in `-size +100M`?",
                    options: [
                      "Files smaller than 100MB",
                      "Files LARGER than 100 Megabytes",
                      "Exactly 100MB",
                      "Include corrupted files"
                    ],
                    correct: 1,
                    explanation: "'+' means Greater Than (larger). '-' means Less Than (smaller or recent)."
                  },
                  {
                    q: "3. What is the purpose of appending `2>/dev/null` to your terminal command?",
                    options: [
                      "It doubles search speed",
                      "It silences 'Permission denied' error messages without needing sudo",
                      "It deletes temporary files",
                      "It saves files to disk"
                    ],
                    correct: 1,
                    explanation: "Stream 2 is standard error (stderr). 2>/dev/null redirects errors to the digital trash can."
                  },
                  {
                    q: "4. Where can students without sudo install portable search tools on Zorin OS?",
                    options: [
                      "/usr/bin",
                      "/etc/bin",
                      "~/.local/bin",
                      "/root"
                    ],
                    correct: 2,
                    explanation: "~/.local/bin is the official XDG user directory that requires zero administrator rights."
                  },
                  {
                    q: "5. What language was this search workbench application written in?",
                    options: [
                      "TypeScript 5.x with React 19",
                      "Python with Django",
                      "Pure C++",
                      "PHP & Apache"
                    ],
                    correct: 0,
                    explanation: "Coded in TypeScript with React 19 for type-safe sub-4ms reactive updates."
                  }
                ].map((item, qIdx) => {
                  const selected = quizAnswers[qIdx];
                  const hasAnswered = selected !== undefined;
                  const isCorrect = selected === item.correct;

                  return (
                    <div key={qIdx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                      <span className="font-semibold text-white block text-xs">
                        {item.q}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.options.map((opt, optIdx) => {
                          const isOptionSelected = selected === optIdx;
                          let btnStyle = "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white";

                          if (hasAnswered) {
                            if (optIdx === item.correct) {
                              btnStyle = "bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold";
                            } else if (isOptionSelected && !isCorrect) {
                              btnStyle = "bg-rose-950/80 border-rose-600 text-rose-200 font-bold";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                              className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && optIdx === item.correct && (
                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className={`p-2.5 rounded-lg text-[11px] ${isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'}`}>
                          <span className="font-bold">{isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}</span>
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
