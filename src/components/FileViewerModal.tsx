/**
 * @file FileViewerModal.tsx
 * @description Interactive file inspector and preview modal.
 * Opens when a student clicks on any search result file to inspect its content,
 * associated viewer (text, photo, archive list, PDF document), file metadata,
 * and command-line instructions on how to open it in Linux.
 */

import React, { useState } from 'react';
import { MockFile } from '../types/search';
import { formatBytes, formatTimeAgo } from '../data/simulatedFileSystem';
import {
  X,
  FileText,
  FileCode,
  Image as ImageIcon,
  Archive,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  HardDrive,
  Clock,
  User,
  Key,
  FolderOpen,
  Info,
  Layers,
} from 'lucide-react';

interface FileViewerModalProps {
  file: MockFile | null;
  onClose: () => void;
  onOpenInTerminal: (cmd: string) => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  file,
  onClose,
  onOpenInTerminal,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'terminal_cmds'>('preview');
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getViewerTitle = () => {
    switch (file.extension.toLowerCase()) {
      case 'txt':
      case 'log':
      case 'conf':
      case 'bashrc':
        return 'Text Document Viewer';
      case 'ts':
      case 'py':
      case 'sh':
      case 'json':
        return 'Source Code & Script Viewer';
      case 'jpg':
      case 'png':
      case 'webp':
        return 'Image & Photo Viewer';
      case 'zip':
      case 'rar':
      case 'tar.gz':
      case '7z':
        return 'Archive Manager (Uncompressed Contents)';
      case 'pdf':
      case 'docx':
        return 'Document Reader Preview';
      case 'iso':
      case 'appimage':
      case 'deb':
        return 'Binary & Package Inspector';
      default:
        return 'File Inspector';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-zinc-950 px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
              {file.extension === 'jpg' || file.extension === 'png' ? (
                <ImageIcon className="w-4 h-4 text-emerald-400" />
              ) : file.extension === 'zip' || file.extension === 'rar' ? (
                <Archive className="w-4 h-4 text-purple-400" />
              ) : (
                <FileText className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate font-mono">
                {file.name}
              </h3>
              <p className="text-[11px] text-zinc-400">{getViewerTitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPath}
              className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title="Copy path to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Path'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50 px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2 px-2 font-medium transition-all border-b-2 text-xs flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Associated View &amp; Content</span>
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={`pb-2 px-2 font-medium transition-all border-b-2 text-xs flex items-center gap-1.5 ${
              activeTab === 'metadata'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Linux Permissions &amp; Metadata</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal_cmds')}
            className={`pb-2 px-2 font-medium transition-all border-b-2 text-xs flex items-center gap-1.5 ${
              activeTab === 'terminal_cmds'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>How to Open in Terminal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin scrollbar-thumb-zinc-800">
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Image Preview */}
              {(file.extension === 'jpg' || file.extension === 'png' || file.extension === 'webp') && (
                <div className="space-y-3">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 border border-zinc-700 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="text-zinc-200 font-semibold">{file.name}</span>
                    <span className="text-[11px] text-zinc-400 mt-0.5">{file.imageDimensions}</span>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1">{file.mimeType} • {formatBytes(file.sizeBytes)}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    {file.previewContent}
                  </p>
                </div>
              )}

              {/* Archive Preview (ZIP, RAR, TAR.GZ) */}
              {(file.extension === 'zip' || file.extension === 'rar' || file.extension === 'tar.gz' || file.extension === '7z') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                      <Archive className="w-4 h-4 text-purple-400" />
                      <span>Archive Contents List ({file.archiveContents?.length || 0} files inside):</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Format: {file.extension.toUpperCase()}
                    </span>
                  </div>

                  {file.archiveContents && file.archiveContents.length > 0 ? (
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-[11px] space-y-1.5 divide-y divide-zinc-900">
                      {file.archiveContents.map((inner, idx) => (
                        <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-zinc-300">
                          <span className="text-zinc-200">📄 {inner}</span>
                          <span className="text-zinc-600 text-[10px]">Ready to extract</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                      {file.previewContent}
                    </p>
                  )}

                  <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
                    💡 <strong>Terminal Tip:</strong> To view contents of a zip without extracting in Linux, run: <code className="font-mono text-purple-300">unzip -l &quot;{file.name}&quot;</code>
                  </div>
                </div>
              )}

              {/* Text Document / Source Code Preview */}
              {(file.extension === 'txt' || file.extension === 'log' || file.extension === 'ts' || file.extension === 'py' || file.extension === 'sh' || file.extension === 'conf' || file.extension === 'bashrc') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>File Content View</span>
                    <span>{file.mimeType}</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
                    {file.previewContent || file.contentSnippet || '(Empty file content)'}
                  </pre>
                </div>
              )}

              {/* PDF Document Preview */}
              {file.extension === 'pdf' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <span className="font-bold text-blue-300">PDF Document Info</span>
                      <span className="text-[11px] font-mono text-zinc-400">{file.pageCount || 1} Pages</span>
                    </div>
                    <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed pt-1">
                      {file.previewContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Protected System File */}
              {file.requiresRoot && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Root / Administrator Protected File</span>
                  </div>
                  <p className="text-zinc-300">
                    This file is owned by root and has restricted read permissions. Attempting to open it as a standard user without sudo fails.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: METADATA & PERMISSIONS */}
          {activeTab === 'metadata' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between py-1 border-b border-zinc-850">
                  <span className="text-zinc-500">Absolute Path:</span>
                  <span className="text-cyan-300 font-semibold truncate max-w-xs">{file.path}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-850">
                  <span className="text-zinc-500">Linux Permissions:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {file.permissions || '-rw-r--r--'}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      {file.isExecutable ? '(Executable)' : '(Read/Write)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-850">
                  <span className="text-zinc-500">Owner &amp; Group:</span>
                  <span className="text-zinc-300">{file.owner || 'zorin:zorin'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-850">
                  <span className="text-zinc-500">File Size:</span>
                  <span className="text-zinc-300">{formatBytes(file.sizeBytes)} ({file.sizeBytes.toLocaleString()} bytes)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-850">
                  <span className="text-zinc-500">Last Modified:</span>
                  <span className="text-zinc-300">{formatTimeAgo(file.modifiedDate)} ({new Date(file.modifiedDate).toLocaleString()})</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-500">MIME Type:</span>
                  <span className="text-zinc-400">{file.mimeType || 'application/octet-stream'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TERMINAL COMMANDS */}
          {activeTab === 'terminal_cmds' && (
            <div className="space-y-3">
              <span className="text-zinc-300 font-semibold block">
                How to open or inspect this file in Zorin OS / Linux terminal:
              </span>

              <div className="space-y-2">
                {/* xdg-open */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-white font-mono font-semibold block">
                      xdg-open &quot;{file.path}&quot;
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Opens with Zorin OS default graphical viewer (PDF reader, Image viewer, etc.)
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenInTerminal(`xdg-open "${file.path}"`)}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium text-xs flex items-center gap-1 flex-shrink-0"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </button>
                </div>

                {/* cat / head */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-white font-mono font-semibold block">
                      cat &quot;{file.path}&quot;
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Prints the file contents directly into your terminal window
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenInTerminal(`cat "${file.path}"`)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg font-medium text-xs flex items-center gap-1 flex-shrink-0"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </button>
                </div>

                {/* nano */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-white font-mono font-semibold block">
                      nano &quot;{file.path}&quot;
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Opens in nano text editor inside the terminal
                    </span>
                  </div>
                </div>

                {/* ls -lh */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-white font-mono font-semibold block">
                      ls -lh &quot;{file.path}&quot;
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Shows exact file permissions, size, and date in terminal
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenInTerminal(`ls -lh "${file.path}"`)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg font-medium text-xs flex items-center gap-1 flex-shrink-0"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-950 px-5 py-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono truncate max-w-sm">
            {file.path}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
