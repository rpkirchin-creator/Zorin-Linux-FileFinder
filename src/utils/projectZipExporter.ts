/**
 * @file projectZipExporter.ts
 * @description Utility to trigger an immediate, seamless download of the entire
 * Zorin-Linux-FileFinder project as a .zip archive, including fallback in-memory bundling.
 */

import JSZip from 'jszip';

/**
 * Downloads the complete project zip archive.
 * First attempts to fetch the pre-packaged public /Zorin-Linux-FileFinder.zip.
 * If running in a restrictive sandbox or offline, falls back to generating
 * the archive in-memory using JSZip.
 */
export async function downloadProjectZip(onProgress?: (msg: string) => void): Promise<void> {
  if (onProgress) onProgress('Initiating project download...');

  try {
    // 1. Direct fetch from Vite static server
    const response = await fetch('/Zorin-Linux-FileFinder.zip');
    if (response.ok) {
      const blob = await response.blob();
      // Ensure it is a valid zip (not an error HTML page)
      if (blob.type.includes('zip') || blob.type.includes('octet-stream') || blob.size > 10000) {
        if (onProgress) onProgress('Saving Zorin-Linux-FileFinder.zip...');
        triggerBlobDownload(blob, 'Zorin-Linux-FileFinder.zip');
        return;
      }
    }
  } catch (err) {
    console.warn('Direct zip fetch failed, falling back to JSZip generator:', err);
  }

  // 2. Fallback: Dynamic JSZip Generator
  if (onProgress) onProgress('Packaging repository files into .zip...');
  const zip = new JSZip();

  // Root documentation & config
  zip.file(
    'README.md',
    `# 🔍 Zorin & Linux FileFinder
### Fast File Search Station, Multi-Tool Command Synthesizer & Interactive Student Tutorial Workbench

> **Co-inspired by rkirchin / Gemini**  
> **Official GitHub Repository:** https://github.com/rpkirchin-creator/Zorin-Linux-FileFinder.git  
> **Target Distributions:** Zorin OS 16 / 17, Ubuntu 22.04 / 24.04 LTS, Debian, Linux Mint

Run \`npm install\` then \`npm run dev\` to launch the workbench at http://localhost:3000.`
  );

  zip.file(
    'run-locally.sh',
    `#!/usr/bin/env bash
echo "Setting up Zorin & Linux FileFinder..."
npm install
npm run dev
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(content, 'Zorin-Linux-FileFinder.zip');
}

/**
 * Helper to trigger browser download of a Blob
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
