export interface ToolGuide {
  id: string;
  name: string;
  category: 'GUI (Graphic)' | 'CLI (Terminal)' | 'Interactive Fuzzy' | 'Content Search';
  tagline: string;
  speed: '10/10 (Instant)' | '9.5/10 (Blazing)' | '9/10 (Extreme)' | '6/10 (Moderate)';
  whyUseIt: string;
  bestFor: string;
  installWithoutAdmin: {
    methodName: string;
    command: string;
    notes: string;
  };
  installStandard: {
    zorinApt: string;
    flatpak?: string;
  };
  keyHotkeysOrUsage: string[];
}

export const TOOLS_DIRECTORY: ToolGuide[] = [
  {
    id: 'fsearch',
    name: 'FSearch',
    category: 'GUI (Graphic)',
    tagline: 'The "Everything" equivalent for Linux & Zorin OS. Millions of files indexed in milliseconds.',
    speed: '10/10 (Instant)',
    whyUseIt: 'Unlike Zorin OS’s default file manager (Nautilus/Files) which relies on slow tracker daemons, FSearch indexes the filesystem directly into RAM using high-performance C. It updates instantly and yields zero-latency results while typing.',
    bestFor: 'Users who want a fast, beautiful visual window with instant filters, wildcards, regex, and right-click actions without touching the terminal.',
    installWithoutAdmin: {
      methodName: 'Standalone AppImage (Zero sudo required)',
      command: `mkdir -p ~/.local/bin
curl -sL "https://github.com/cboxdoerfer/fsearch/releases/latest/download/FSearch-x86_64.AppImage" -o ~/.local/bin/fsearch
chmod +x ~/.local/bin/fsearch
~/.local/bin/fsearch &`,
      notes: 'No root/admin password needed! Runs anywhere on Zorin OS.'
    },
    installStandard: {
      zorinApt: 'sudo add-apt-repository ppa:christian-boxdoerfer/fsearch-stable && sudo apt update && sudo apt install fsearch',
      flatpak: 'flatpak install flathub io.github.cboxdoerfer.FSearch'
    },
    keyHotkeysOrUsage: [
      'Type "report" for instant search',
      'Filter extension: "ext:pdf,docx"',
      'Filter size: "size:>100mb"',
      'Regex mode: Toggle with Alt+R or from menu'
    ]
  },
  {
    id: 'fd',
    name: 'fd (fd-find)',
    category: 'CLI (Terminal)',
    tagline: 'A simple, fast, and user-friendly alternative to "find".',
    speed: '9.5/10 (Blazing)',
    whyUseIt: 'Find is famously clunky and unintuitive. "fd" is written in Rust, searches directories in parallel, outputs beautiful colorized results, uses sensible defaults (ignores .git and hidden files unless told otherwise), and never gets stuck on permission errors.',
    bestFor: 'Quick terminal searches, script automation, and piping into other commands or editors.',
    installWithoutAdmin: {
      methodName: 'GitHub Precompiled Static Binary',
      command: `mkdir -p ~/.local/bin
curl -sL https://github.com/sharkdp/fd/releases/latest/download/fd-v10.2.0-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ fd-v10.2.0-x86_64-unknown-linux-musl/fd
chmod +x ~/.local/bin/fd
# Ensure ~/.local/bin is in PATH (standard on Zorin OS)`,
      notes: 'Installs directly into your user home folder. Works even on locked university or work computers.'
    },
    installStandard: {
      zorinApt: 'sudo apt install fd-find\n# Note: Ubuntu/Zorin names the binary "fdfind". Create alias: alias fd="fdfind"',
    },
    keyHotkeysOrUsage: [
      'fd filename (smart case search)',
      'fd -e pdf (find all PDFs)',
      'fd -S +100m (find files > 100MB)',
      'fd -H (include hidden files)'
    ]
  },
  {
    id: 'fzf',
    name: 'fzf (Fuzzy Finder)',
    category: 'Interactive Fuzzy',
    tagline: 'Interactive command-line fuzzy finder with live file previews.',
    speed: '10/10 (Instant)',
    whyUseIt: 'Allows interactive searching as you type right in your terminal. You can preview file contents in real time before selecting or opening.',
    bestFor: 'Opening files in nano/VS Code, switching directories, and interactive fuzzy navigation.',
    installWithoutAdmin: {
      methodName: 'Official Git User Installer (Zero Admin)',
      command: `git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install --all
source ~/.bashrc`,
      notes: 'Completely unprivileged installation. Adds Ctrl+T (search file) and Alt+C (search folder) hotkeys to your Zorin OS terminal!'
    },
    installStandard: {
      zorinApt: 'sudo apt install fzf',
    },
    keyHotkeysOrUsage: [
      'Ctrl + T in terminal: Fuzzy find file and paste path',
      'Alt + C in terminal: Fuzzy find folder and cd into it',
      'Ctrl + R in terminal: Fuzzy search bash command history',
      'fzf --preview "cat {}" : Live file preview'
    ]
  },
  {
    id: 'ripgrep',
    name: 'ripgrep (rg)',
    category: 'Content Search',
    tagline: 'Recursively searches directories for a regex pattern at ridiculous speed.',
    speed: '9.5/10 (Blazing)',
    whyUseIt: 'When you do not remember the file name, but you remember words inside the document or code. Ripgrep outperforms grep, ag, and ack by an order of magnitude.',
    bestFor: 'Searching text inside source code, notes, logs, and configuration files.',
    installWithoutAdmin: {
      methodName: 'GitHub Precompiled Binary',
      command: `mkdir -p ~/.local/bin
curl -sL https://github.com/BurntSushi/ripgrep/releases/latest/download/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz | tar -xz --strip-components=1 -C ~/.local/bin/ ripgrep-14.1.1-x86_64-unknown-linux-musl/rg
chmod +x ~/.local/bin/rg`,
      notes: 'Installs in seconds without sudo.'
    },
    installStandard: {
      zorinApt: 'sudo apt install ripgrep',
    },
    keyHotkeysOrUsage: [
      'rg "error message" ~/Projects',
      'rg -i "todo" -t py (case-insensitive in Python files)',
      'rg --files (fast file lister without content search)'
    ]
  }
];

export const ADMIN_BYPASS_STRATEGIES = [
  {
    title: '1. Suppress "Permission Denied" Spam',
    problem: 'When running "find / -name filename", the terminal gets flooded with hundreds of "find: /etc/...: Permission denied" lines, burying the actual results.',
    solutionCommand: 'find /target/path -name "pattern" 2>/dev/null',
    explanation: '"2>/dev/null" redirects standard error (stream 2) to the bit-bucket /dev/null. All permission warnings vanish, showing only readable matches.'
  },
  {
    title: '2. The "-readable" Test in GNU Find',
    problem: 'You want GNU find to skip folders you do not own or cannot read without throwing errors.',
    solutionCommand: 'find / -readable -name "*.pdf" 2>/dev/null',
    explanation: 'The "-readable" predicate checks your current UID permissions before attempting to enter a directory or read a file.'
  },
  {
    title: '3. Portable Zero-Sudo Binary Install (~/.local/bin)',
    problem: 'On a managed machine, workplace laptop, or school computer running Zorin OS without sudo credentials, "sudo apt install" fails.',
    solutionCommand: 'mkdir -p ~/.local/bin && export PATH="$HOME/.local/bin:$PATH"',
    explanation: 'Linux standards (XDG) specify that any executable placed in ~/.local/bin can be run by the user. You can drop static binaries of "fd", "fzf", "rg", or "FSearch" there without asking an administrator.'
  },
  {
    title: '4. Why Zorin OS File Manager (Nautilus) Feels Broken',
    problem: 'Why is the search in Zorin OS Files so slow and misses files?',
    solutionCommand: 'tracker3 status   # or disable: systemctl --user mask tracker-miner-fs-3',
    explanation: 'Zorin OS uses GNOME Files (Nautilus) which relies on the Tracker indexing daemon. If Tracker is rebuilding, corrupted, paused for battery saver, or if you search an unindexed path (like external drives or system paths), it falls back to a single-threaded crawler that freezes the GUI. Using FSearch or fd completely bypasses Tracker.'
  }
];
