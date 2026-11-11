/**
 * @file simulatedFileSystem.ts
 * @description In-memory mock Linux / Zorin OS filesystem representing realistic user files,
 * media, archives (.zip, .rar, .tar.gz), documents (.txt, .pdf), source code, and permission-restricted
 * system logs. Supports full interactive file viewing with simulated file content and metadata.
 */

import { MockFile } from '../types/search';

// Base simulated timestamp is November 11, 2026
const NOW = new Date('2026-11-11T09:40:00Z').getTime();

// Helper functions for realistic relative file ages
const hoursAgo = (h: number) => new Date(NOW - h * 3600 * 1000).toISOString();
const daysAgo = (d: number) => new Date(NOW - d * 24 * 3600 * 1000).toISOString();

/**
 * Rich mock dataset representing common desktop and server directories on Zorin OS / Ubuntu.
 * Includes normal user files, media, large archives, hidden configs, and root-restricted paths.
 */
export const SIMULATED_FILES: MockFile[] = [
  // --- Plain Text Files (.txt) ---
  {
    id: 'txt-1',
    path: '/home/zorin/Documents/Personal_Notes.txt',
    name: 'Personal_Notes.txt',
    extension: 'txt',
    sizeBytes: 45_200, // 45.2 KB
    modifiedDate: hoursAgo(6),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/plain; charset=utf-8',
    contentSnippet: 'TODO: Install fsearch on Zorin OS or use fd-find. Disable tracker-miner to speed up laptop.',
    previewContent: `=== PERSONAL WORKSPACE NOTES ===
Date: November 2026
Host: Zorin OS 17.2 LTS

1. Search Improvements:
   - Default Nautilus search is too sluggish for large projects.
   - Install FSearch for graphical instant search (like Everything on Windows).
   - Use 'fd' in terminal instead of 'find'.
   - Add alias ff="fd --type f --hidden" to ~/.bashrc.

2. System Maintenance:
   - Check tracker miner CPU consumption: tracker3 status
   - If CPU fan is spinning, pause indexing: tracker3 daemon pause
   - Free up /home disk space: fd -S +100m ~/Downloads`
  },
  {
    id: 'txt-2',
    path: '/home/zorin/Documents/Meeting_Notes_Nov2026.txt',
    name: 'Meeting_Notes_Nov2026.txt',
    extension: 'txt',
    sizeBytes: 18_400, // 18.4 KB
    modifiedDate: hoursAgo(22),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/plain; charset=utf-8',
    contentSnippet: 'Sprint retrospective: Migrate old servers to Linux. Standardize on fd and ripgrep for search.',
    previewContent: `MEETING NOTES - SPRINT RETROSPECTIVE
Attendees: Dev Team & DevOps
Topic: Developer Tooling on Linux Workstations

Key Decisions:
- Standardize developer workstations on Zorin OS & Ubuntu.
- Provide zero-sudo binary scripts for 'fd', 'ripgrep', and 'fzf' into ~/.local/bin.
- Teach new hires how to redirect stderr (2>/dev/null) to stop getting confused by Permission Denied output.`
  },
  {
    id: 'txt-3',
    path: '/home/zorin/Desktop/quick_ideas.txt',
    name: 'quick_ideas.txt',
    extension: 'txt',
    sizeBytes: 2_100,
    modifiedDate: daysAgo(3),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/plain',
    contentSnippet: 'Linux desktop tips tutorial outline. Cover .txt, .jpg, .zip, .rar default searches.',
    previewContent: `Ideas for Linux Search Tutorial Course:
1. Explain what flags/switches are (light switch analogy).
2. Teach the + and - rule for sizes (+100M vs -1M).
3. Teach 'f' is file, 'd' is directory.
4. Give students a 1-liner install script for ~/.local/bin.`
  },

  // --- Images & Photos (.jpg, .png, .webp) ---
  {
    id: 'img-1',
    path: '/home/zorin/Pictures/Desktop_Wallpaper_4K.jpg',
    name: 'Desktop_Wallpaper_4K.jpg',
    extension: 'jpg',
    sizeBytes: 7_900_000, // 7.9 MB
    modifiedDate: daysAgo(60),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'image/jpeg',
    imageDimensions: '3840 x 2160 px (4K UHD)',
    previewContent: 'High-resolution nature wallpaper. Sunset over mountain ridge with blue and amber ambient light.'
  },
  {
    id: 'img-2',
    path: '/home/zorin/Pictures/Vacation_Sunset_2026.jpg',
    name: 'Vacation_Sunset_2026.jpg',
    extension: 'jpg',
    sizeBytes: 12_400_000, // 12.4 MB (High-res photo)
    modifiedDate: daysAgo(14),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'image/jpeg',
    imageDimensions: '6000 x 4000 px (RAW Export)',
    previewContent: 'Travel photography export from trip to Mediterranean coast. ISO 100, f/2.8, 1/500s.'
  },
  {
    id: 'img-3',
    path: '/home/zorin/Pictures/Portfolio_Cover.jpg',
    name: 'Portfolio_Cover.jpg',
    extension: 'jpg',
    sizeBytes: 4_800_000, // 4.8 MB
    modifiedDate: daysAgo(2),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'image/jpeg',
    imageDimensions: '2560 x 1440 px',
    previewContent: 'Creative portfolio header artwork with typography overlay.'
  },
  {
    id: 'img-4',
    path: '/home/zorin/Pictures/Screenshots/Screenshot_Zorin_Menu.png',
    name: 'Screenshot_Zorin_Menu.png',
    extension: 'png',
    sizeBytes: 1_250_000,
    modifiedDate: hoursAgo(10),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'image/png',
    imageDimensions: '1920 x 1080 px',
    previewContent: 'Screenshot showing Zorin OS Start Menu and application launcher.'
  },

  // --- Compressed Archives (.zip, .rar, .tar.gz, .7z, .iso) ---
  {
    id: 'arc-1',
    path: '/home/zorin/Downloads/Client_Project_Backup.zip',
    name: 'Client_Project_Backup.zip',
    extension: 'zip',
    sizeBytes: 145_000_000, // 145 MB
    modifiedDate: daysAgo(1),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/zip',
    archiveContents: [
      'project_spec_v3.pdf',
      'source_code/main.ts',
      'source_code/styles.css',
      'assets/logo_vector.svg',
      'invoices/invoice_final.pdf'
    ],
    previewContent: 'Zip archive containing complete client project source tree and signed contract documents.'
  },
  {
    id: 'arc-2',
    path: '/home/zorin/Downloads/Family_Photos_Album.rar',
    name: 'Family_Photos_Album.rar',
    extension: 'rar',
    sizeBytes: 850_000_000, // 850 MB
    modifiedDate: daysAgo(5),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/x-rar-compressed',
    archiveContents: [
      '2026_reunion_01.jpg',
      '2026_reunion_02.jpg',
      '2026_reunion_03.jpg',
      'panoramic_beach.jpg',
      'video_toast.mp4'
    ],
    previewContent: 'RAR compressed photo and video archive from summer 2026 family reunion.'
  },
  {
    id: 'arc-3',
    path: '/home/zorin/Downloads/Old_Accounting_Receipts.rar',
    name: 'Old_Accounting_Receipts.rar',
    extension: 'rar',
    sizeBytes: 42_000_000, // 42 MB
    modifiedDate: daysAgo(90),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/x-rar-compressed',
    archiveContents: [
      'receipts_q1.pdf',
      'receipts_q2.pdf',
      'receipts_q3.pdf',
      'hardware_expenses.xlsx'
    ],
    previewContent: 'Compressed accounting records and scanned paper receipts for tax year 2025.'
  },
  {
    id: 'arc-4',
    path: '/home/zorin/Downloads/Website_Assets.zip',
    name: 'Website_Assets.zip',
    extension: 'zip',
    sizeBytes: 68_000_000, // 68 MB
    modifiedDate: daysAgo(8),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/zip',
    archiveContents: [
      'hero_banner.webp',
      'icons/search.svg',
      'icons/terminal.svg',
      'fonts/Inter-Variable.woff2',
      'fonts/FiraCode-Regular.woff2'
    ],
    previewContent: 'Static asset bundle for frontend web application.'
  },
  {
    id: 'arc-5',
    path: '/home/zorin/Downloads/dataset_backup_2026.tar.gz',
    name: 'dataset_backup_2026.tar.gz',
    extension: 'tar.gz',
    sizeBytes: 740_000_000, // 740 MB
    modifiedDate: daysAgo(18),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/gzip',
    archiveContents: [
      'dataset/train_features.csv',
      'dataset/labels.csv',
      'dataset/weights.bin'
    ],
    previewContent: 'Tarball archive with machine learning training dataset and precomputed embeddings.'
  },
  {
    id: 'arc-6',
    path: '/home/zorin/Downloads/zorin-os-17.2-pro-64.iso',
    name: 'zorin-os-17.2-pro-64.iso',
    extension: 'iso',
    sizeBytes: 3_200_000_000, // 3.2 GB
    modifiedDate: daysAgo(12),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/x-iso9660-image',
    previewContent: 'Bootable optical disc image for Zorin OS 17.2 Pro installation.'
  },

  // --- Documents (.pdf, .docx) ---
  {
    id: 'doc-1',
    path: '/home/zorin/Documents/Financial_Report_Q3_2026.pdf',
    name: 'Financial_Report_Q3_2026.pdf',
    extension: 'pdf',
    sizeBytes: 14_850_000, // 14.8 MB
    modifiedDate: daysAgo(2),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/pdf',
    pageCount: 28,
    contentSnippet: 'Quarterly financial report 2026. Net revenue target achieved. Summary of operational costs.',
    previewContent: `EXECUTIVE SUMMARY: FINANCIAL REPORT Q3 2026
Prepared for: Board of Directors
Period: July 1 - September 30, 2026

Highlights:
- Total Gross Revenue: $1,840,000 (18% YoY growth)
- Operating Margin: 24.2%
- Research & Infrastructure Investment: $310,000
- Recommended Action: Approve expansion budget for Q4.`
  },
  {
    id: 'doc-2',
    path: '/home/zorin/Documents/Project_Proposal_Draft.docx',
    name: 'Project_Proposal_Draft.docx',
    extension: 'docx',
    sizeBytes: 1_250_000,
    modifiedDate: daysAgo(5),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    contentSnippet: 'Zorin OS workspace optimization proposal. Eliminating slow file search with modern CLI tools.',
    previewContent: `Proposal for Upgrading File Search across Team Linux Desktops
Author: IT Infrastructure Committee

Problem Statement:
Default file manager search in GNOME/Zorin causes employee downtime.

Proposed Solution:
Deploy FSearch GUI and 'fd' command-line tools into ~/.local/bin across all machines.`
  },
  {
    id: 'doc-3',
    path: '/home/zorin/Documents/Taxes_2025_Receipts.pdf',
    name: 'Taxes_2025_Receipts.pdf',
    extension: 'pdf',
    sizeBytes: 8_400_000,
    modifiedDate: daysAgo(240),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/pdf',
    pageCount: 16,
    contentSnippet: 'Tax year 2025 statements, deductible business receipts and hardware purchases.',
    previewContent: 'Tax documentation package for 2025 filing. Contains 1099s, W-2s, and hardware deductible items.'
  },
  {
    id: 'doc-4',
    path: '/home/zorin/Downloads/client_invoice_1092.pdf',
    name: 'client_invoice_1092.pdf',
    extension: 'pdf',
    sizeBytes: 320_000,
    modifiedDate: hoursAgo(14),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'application/pdf',
    pageCount: 2,
    contentSnippet: 'Invoice 1092 for client consulting services. Total balance due: $1,450.00.',
    previewContent: `INVOICE #1092
Date: November 10, 2026
Client: Acme Software Inc.

Item 1: Linux System Administration & Search Optimization (10 hrs @ $120) = $1,200
Item 2: Scripting & Automation Training (2 hrs @ $125) = $250
TOTAL BALANCE DUE: $1,450.00`
  },

  // --- Video Files (.mp4) ---
  {
    id: 'vid-1',
    path: '/home/zorin/Videos/Screen_Recording_Zorin_Bug.mp4',
    name: 'Screen_Recording_Zorin_Bug.mp4',
    extension: 'mp4',
    sizeBytes: 145_000_000, // 145 MB
    modifiedDate: daysAgo(4),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'video/mp4',
    previewContent: 'H.264 1080p screen capture showing file manager search freezing during background indexing.'
  },
  {
    id: 'vid-2',
    path: '/home/zorin/Videos/Linux_Tutorial_Lesson1.mp4',
    name: 'Linux_Tutorial_Lesson1.mp4',
    extension: 'mp4',
    sizeBytes: 420_000_000, // 420 MB
    modifiedDate: daysAgo(1),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'video/mp4',
    previewContent: 'Video lesson demonstrating fd, fzf preview, and FSearch on Zorin OS.'
  },

  // --- Portable Applications & Standalone Binaries ---
  {
    id: 'app-1',
    path: '/home/zorin/Downloads/FSearch-x86_64.AppImage',
    name: 'FSearch-x86_64.AppImage',
    extension: 'appimage',
    sizeBytes: 28_400_000, // 28.4 MB
    modifiedDate: daysAgo(1),
    isDirectory: false,
    isExecutable: true,
    permissions: '-rwxr-xr-x',
    owner: 'zorin:zorin',
    mimeType: 'application/x-executable',
    previewContent: 'ELF 64-bit LSB executable, x86-64, dynamically linked. Ready to run without installation.'
  },
  {
    id: 'app-2',
    path: '/home/zorin/.local/bin/fd',
    name: 'fd',
    extension: '',
    sizeBytes: 3_800_000,
    modifiedDate: daysAgo(40),
    isDirectory: false,
    isExecutable: true,
    isHidden: true,
    permissions: '-rwxr-xr-x',
    owner: 'zorin:zorin',
    mimeType: 'application/x-executable',
    previewContent: 'fd-find binary version 10.2.0 (compiled for x86_64-unknown-linux-musl).'
  },
  {
    id: 'app-3',
    path: '/home/zorin/.local/bin/fzf',
    name: 'fzf',
    extension: '',
    sizeBytes: 2_900_000,
    modifiedDate: daysAgo(40),
    isDirectory: false,
    isExecutable: true,
    isHidden: true,
    permissions: '-rwxr-xr-x',
    owner: 'zorin:zorin',
    mimeType: 'application/x-executable',
    previewContent: 'fzf interactive fuzzy finder standalone binary (v0.56.0).'
  },
  {
    id: 'app-4',
    path: '/home/zorin/.local/bin/rg',
    name: 'rg',
    extension: '',
    sizeBytes: 5_200_000,
    modifiedDate: daysAgo(40),
    isDirectory: false,
    isExecutable: true,
    isHidden: true,
    permissions: '-rwxr-xr-x',
    owner: 'zorin:zorin',
    mimeType: 'application/x-executable',
    previewContent: 'ripgrep binary version 14.1.1 (Rust SIMD acceleration enabled).'
  },

  // --- Code & Configuration Files ---
  {
    id: 'code-1',
    path: '/home/zorin/Projects/web-app/src/index.ts',
    name: 'index.ts',
    extension: 'ts',
    sizeBytes: 12_800,
    modifiedDate: hoursAgo(2),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/typescript',
    contentSnippet: 'import express from "express"; const app = express(); app.listen(3000);',
    previewContent: `import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', os: 'Zorin OS 17', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`
  },
  {
    id: 'code-2',
    path: '/home/zorin/Projects/ai-pipeline/train_model.py',
    name: 'train_model.py',
    extension: 'py',
    sizeBytes: 24_500,
    modifiedDate: daysAgo(8),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/x-python',
    contentSnippet: 'import torch\nimport numpy as np\ndef train():\n    print("Training model...")',
    previewContent: `#!/usr/bin/env python3
"""PyTorch Model Training Routine."""
import torch
import torch.nn as nn

class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(512, 10)
        
    def forward(self, x):
        return self.fc(x)

def main():
    print("Initializing weights on CUDA device...")

if __name__ == '__main__':
    main()`
  },
  {
    id: 'code-3',
    path: '/home/zorin/Projects/web-app/debug_run.log',
    name: 'debug_run.log',
    extension: 'log',
    sizeBytes: 85_000_000, // 85 MB log file
    modifiedDate: hoursAgo(1),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/plain',
    contentSnippet: '[ERROR] 2026-11-11 09:12:04 - Connection timed out to database worker pool.',
    previewContent: `[INFO]  2026-11-11 09:11:58 - Web server worker spawned (PID: 4912)
[INFO]  2026-11-11 09:12:00 - Checking cache connectivity to redis://127.0.0.1:6379
[WARN]  2026-11-11 09:12:02 - High latency detected on worker pool thread #3
[ERROR] 2026-11-11 09:12:04 - Connection timed out to database worker pool.
[DEBUG] 2026-11-11 09:12:05 - Retry #1 scheduled in 500ms...`
  },
  {
    id: 'code-4',
    path: '/home/zorin/Projects/scripts/backup_helper.sh',
    name: 'backup_helper.sh',
    extension: 'sh',
    sizeBytes: 3_200,
    modifiedDate: daysAgo(6),
    isDirectory: false,
    isExecutable: true,
    permissions: '-rwxr-xr-x',
    owner: 'zorin:zorin',
    mimeType: 'text/x-shellscript',
    contentSnippet: '#!/usr/bin/env bash\nfd -e zip -e rar . ~/Downloads -X mv -t ~/Backup',
    previewContent: `#!/usr/bin/env bash
# Automated housekeeping script for Zorin OS
set -euo pipefail

BACKUP_DIR="$HOME/Archive_Backup"
mkdir -p "$BACKUP_DIR"

echo "Searching for downloaded archives over 50MB..."
fd -e zip -e rar -S +50m . "$HOME/Downloads" -X cp -v -t "$BACKUP_DIR"

echo "Done! Backup complete."`
  },

  // --- Hidden Files (.bashrc, .config) ---
  {
    id: 'hid-1',
    path: '/home/zorin/.bashrc',
    name: '.bashrc',
    extension: 'bashrc',
    sizeBytes: 4_200,
    modifiedDate: daysAgo(4),
    isDirectory: false,
    isHidden: true,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/plain',
    contentSnippet: 'alias ff="fd --type f --hidden"\nalias fif="rg --hidden --files | fzf"\nexport PATH="$HOME/.local/bin:$PATH"',
    previewContent: `# ~/.bashrc: executed by bash(1) for non-login shells.
export PATH="$HOME/.local/bin:$PATH"

# User Search Superchargers
alias ff="fd --type f --hidden"
alias fdir="fd --type d --hidden"
alias ftoday="fd --changed-within 24h"
alias fbig="fd -S +100m --exec ls -lh {} 2>/dev/null | sort -k5 -hr"

fif() {
  rg --files --hidden --no-ignore-vcs 2>/dev/null | fzf --preview 'bat --color=always {} 2>/dev/null || cat {}'
}`
  },
  {
    id: 'hid-2',
    path: '/home/zorin/.config/fsearch/fsearch.conf',
    name: 'fsearch.conf',
    extension: 'conf',
    sizeBytes: 1_200,
    modifiedDate: daysAgo(10),
    isDirectory: false,
    isHidden: true,
    permissions: '-rw-r--r--',
    owner: 'zorin:zorin',
    mimeType: 'text/plain',
    contentSnippet: '[General]\nindex_hidden=true\nupdate_database_on_start=true\ncase_sensitive=false',
    previewContent: `[General]
index_hidden=true
update_database_on_start=true
case_sensitive=false
include_paths=/home/zorin;/media/external
exclude_paths=/proc;/sys;/dev`
  },

  // --- System Paths Requiring Root/Admin Privileges ---
  // When a user searches '/' or '/var' without 2>/dev/null, these trigger simulated 'Permission denied'!
  {
    id: 'sys-1',
    path: '/var/log/syslog',
    name: 'syslog',
    extension: 'log',
    sizeBytes: 120_000_000, // 120 MB
    modifiedDate: hoursAgo(1),
    isDirectory: false,
    requiresRoot: true,
    permissions: '-rw-r-----',
    owner: 'syslog:adm',
    mimeType: 'text/plain',
    contentSnippet: 'systemd[1]: Started User Manager for UID 1000.',
    previewContent: `Nov 11 08:30:01 zorin-laptop systemd[1]: Starting Daily apt download activities...
Nov 11 08:30:15 zorin-laptop systemd[1]: Started User Manager for UID 1000.
Nov 11 08:45:22 zorin-laptop kernel: [  142.109283] wlp2s0: Limiting TX power to 20 dBm.`
  },
  {
    id: 'sys-2',
    path: '/var/log/auth.log',
    name: 'auth.log',
    extension: 'log',
    sizeBytes: 2_400_000,
    modifiedDate: hoursAgo(3),
    isDirectory: false,
    requiresRoot: true,
    permissions: '-rw-r-----',
    owner: 'syslog:adm',
    mimeType: 'text/plain',
    contentSnippet: 'CRON[12948]: (root) CMD (test -x /usr/sbin/anacron ||)',
    previewContent: `Nov 11 07:17:01 zorin-laptop CRON[12948]: (root) CMD (test -x /usr/sbin/anacron ||)
Nov 11 08:00:21 zorin-laptop sudo:    zorin : TTY=pts/0 ; PWD=/home/zorin ; USER=root ; COMMAND=/usr/bin/apt update`
  },
  {
    id: 'sys-3',
    path: '/etc/shadow',
    name: 'shadow',
    extension: '',
    sizeBytes: 1_400,
    modifiedDate: daysAgo(120),
    isDirectory: false,
    requiresRoot: true,
    permissions: '-rw-r-----',
    owner: 'root:shadow',
    mimeType: 'text/plain',
    previewContent: '[PROTECTED SYSTEM FILE - Requires root / sudo privileges. Contains salted password hashes.]'
  },
  {
    id: 'sys-4',
    path: '/etc/environment',
    name: 'environment',
    extension: '',
    sizeBytes: 84,
    modifiedDate: daysAgo(300),
    isDirectory: false,
    permissions: '-rw-r--r--',
    owner: 'root:root',
    mimeType: 'text/plain',
    contentSnippet: 'PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"',
    previewContent: `PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"`
  },
  {
    id: 'sys-5',
    path: '/root/.bashrc',
    name: '.bashrc',
    extension: 'bashrc',
    sizeBytes: 3_100,
    modifiedDate: daysAgo(500),
    isDirectory: false,
    isHidden: true,
    requiresRoot: true,
    permissions: '-rw-r--r--',
    owner: 'root:root',
    mimeType: 'text/plain',
    previewContent: `# Root user environment config\nexport PS1='\\[\\033[01;31m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '`
  }
];

/**
 * Format raw byte counts into human-readable strings (e.g., 45.2 KB, 14.8 MB, 3.2 GB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Formats ISO timestamps into relative user-friendly strings (e.g., 2h ago, Yesterday, 5d ago)
 */
export function formatTimeAgo(isoString: string): string {
  const diffMs = NOW - new Date(isoString).getTime();
  const diffHours = Math.floor(diffMs / (3600 * 1000));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
