/**
 * @file SimulatedResultsView.tsx
 * @description Renders simulated filesystem search results with interactive file cards.
 * Clicking any file card opens the FileViewerModal to preview contents (text, photo, archive, PDF),
 * metadata, and Linux terminal commands.
 */

import React, { useState } from 'react';
import { SearchEvaluationResult } from '../utils/fileMatcher';
import { MockFile } from '../types/search';
import { formatBytes, formatTimeAgo } from '../data/simulatedFileSystem';
import { FileViewerModal } from './FileViewerModal';
import {
  File,
  Folder,
  FileText,
  FileCode,
  Image,
  Video,
  Archive,
  Terminal,
  AlertTriangle,
  Check,
  Copy,
  Clock,
  HardDrive,
  ShieldAlert,
  Zap,
  Eye,
} from 'lucide-react';

interface SimulatedResultsViewProps {
  evaluation: SearchEvaluationResult;
  onRunInTerminal?: (cmd: string) => void;
}

export const SimulatedResultsView: React.FC<SimulatedResultsViewProps> = ({
  evaluation,
  onRunInTerminal,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectingFile, setInspectingFile] = useState<MockFile | null>(null);

  const handleCopyPath = (e: React.MouseEvent, path: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getFileIcon = (ext: string, isExec?: boolean) => {
    if (isExec) return <Terminal className="w-4 h-4 text-emerald-400" />;
    switch (ext.toLowerCase()) {
      case 'pdf':
      case 'docx':
      case 'txt':
      case 'md':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'ts':
      case 'js':
      case 'py':
      case 'json':
      case 'bashrc':
      case 'conf':
        return <FileCode className="w-4 h-4 text-amber-400" />;
      case 'jpg':
      case 'png':
      case 'webp':
        return <Image className="w-4 h-4 text-emerald-400" />;
      case 'mp4':
      case 'mkv':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'zip':
      case 'rar':
      case 'tar.gz':
      case 'iso':
        return <Archive className="w-4 h-4 text-purple-400" />;
      default:
        return <File className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <>
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        {/* Header Stat Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Simulated Execution Results
            </h3>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              {evaluation.matches.length} matching item{evaluation.matches.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span>Scanned: {evaluation.totalScanned} files</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{evaluation.timeMs}ms runtime</span>
          </div>
        </div>

        {/* Permission Denied Warnings (Educational Callout!) */}
        {evaluation.permissionErrors.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs">
            <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Admin Permission Warnings Encountered ({evaluation.permissionErrors.length})</span>
            </div>
            <p className="text-rose-200/80 mb-2">
              This is the classic Linux issue where standard <code className="bg-rose-950 px-1 py-0.5 rounded font-mono text-rose-300">find</code> clutters your screen with permission denied errors for root-restricted directories:
            </p>
            <div className="bg-zinc-950/80 p-2.5 rounded-lg font-mono text-rose-400 space-y-1 text-[11px] border border-rose-900/30">
              {evaluation.permissionErrors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              👉 <strong>Fix:</strong> In Section 5 above, enable <strong>"Silence Admin Errors (2&gt;/dev/null)"</strong> or use <strong>"fd"</strong> which silently bypasses them automatically!
            </p>
          </div>
        )}

        {/* Click hint banner for students */}
        {evaluation.matches.length > 0 && (
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click on any file to open its <strong>Associated View &amp; Content</strong></span>
            </span>
            <span className="text-zinc-500 font-mono text-[10px]">
              Preview • Content • Permissions
            </span>
          </div>
        )}

        {/* Results List */}
        {evaluation.matches.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 space-y-2">
            <File className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-sm font-medium">No files match your current filters</p>
            <p className="text-xs text-zinc-600">
              Try broadening your search path, changing the extension group to "All", or adjusting size bounds.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {evaluation.matches.map(file => (
              <div
                key={file.id}
                onClick={() => setInspectingFile(file)}
                className="group p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-cyan-500/50 hover:bg-zinc-900/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer"
                title="Click to view file content and permissions"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-cyan-500/30 mt-0.5 transition-colors">
                    {getFileIcon(file.extension, file.isExecutable)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 font-mono truncate group-hover:text-cyan-300 transition-colors">
                        {file.name}
                      </span>
                      {file.isHidden && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-zinc-800 text-zinc-400 rounded font-mono">
                          hidden
                        </span>
                      )}
                      {file.isExecutable && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono font-bold">
                          +x
                        </span>
                      )}
                      {file.requiresRoot && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-amber-950 text-amber-400 border border-amber-800 rounded font-mono">
                          root
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-500 font-mono text-[11px] truncate mt-0.5">
                      {file.path}
                    </p>

                    {file.contentSnippet && (
                      <div className="mt-1.5 p-1.5 rounded bg-zinc-900/80 border border-zinc-800/60 font-mono text-[11px] text-zinc-300">
                        <span className="text-amber-400 font-bold">&gt; </span>
                        {file.contentSnippet}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0 text-zinc-400 font-mono text-[11px]">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-zinc-500" />
                    <span>{formatBytes(file.sizeBytes)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span>{formatTimeAgo(file.modifiedDate)}</span>
                  </div>

                  <button
                    onClick={(e) => handleCopyPath(e, file.path, file.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      copiedId === file.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                    }`}
                    title="Copy full path"
                  >
                    {copiedId === file.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive File Viewer Modal */}
      {inspectingFile && (
        <FileViewerModal
          file={inspectingFile}
          onClose={() => setInspectingFile(null)}
          onOpenInTerminal={(cmd) => {
            setInspectingFile(null);
            if (onRunInTerminal) {
              onRunInTerminal(cmd);
            }
          }}
        />
      )}
    </>
  );
};
