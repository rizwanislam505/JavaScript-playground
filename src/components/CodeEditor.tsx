import React, { useRef, useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import { Trash2, Play, Copy, Check, Download, Share2, AlertCircle } from 'lucide-react';
import { PlaygroundMode, ActiveWebEditorTab } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: 'javascript' | 'html' | 'css';
  onRun?: () => void;
  onClear: () => void;
  onShare?: () => void;
  shareState?: 'idle' | 'copied' | 'too_large';
  mode: PlaygroundMode;
  activeWebTab?: ActiveWebEditorTab;
  onSelectWebTab?: (tab: ActiveWebEditorTab) => void;
  placeholder?: string;
  isRunning?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  onRun,
  onClear,
  onShare,
  shareState = 'idle',
  mode,
  activeWebTab = 'html',
  onSelectWebTab,
  placeholder = 'Paste your JavaScript or drop a file',
  isRunning = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [activeLine, setActiveLine] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Line and character count calculation
  const lines = useMemo(() => {
    if (!value) return [''];
    return value.split('\n');
  }, [value]);

  const lineCount = value.length === 0 ? 0 : lines.length;
  const charCount = value.length;

  // Syntax highlighted code
  const highlightedCode = useMemo(() => {
    if (!value) return '';
    const prismLang =
      language === 'html'
        ? Prism.languages.markup
        : language === 'css'
        ? Prism.languages.css
        : Prism.languages.javascript;

    return Prism.highlight(value, prismLang || Prism.languages.javascript, language);
  }, [value, language]);

  // Track cursor position to highlight active line
  const updateActiveLine = () => {
    if (!textareaRef.current) return;
    const selectionStart = textareaRef.current.selectionStart;
    const textBeforeCursor = value.substring(0, selectionStart);
    const lineNumber = textBeforeCursor.split('\n').length;
    setActiveLine(lineNumber);
  };

  // Synchronize scroll
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  // Drag and drop file handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    // Tab indenting
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (!e.shiftKey) {
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateActiveLine();
        }, 0);
      } else {
        const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
        if (value.substring(currentLineStart, currentLineStart + 2) === '  ') {
          const newValue = value.substring(0, currentLineStart) + value.substring(currentLineStart + 2);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(currentLineStart, start - 2);
            updateActiveLine();
          }, 0);
        }
      }
      return;
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(currentLineStart, start);
      const match = currentLine.match(/^(\s+)/);
      const indentation = match ? match[1] : '';
      const extraIndent = /[{\[(]\s*$/.test(currentLine) ? '  ' : '';

      e.preventDefault();
      const insertText = '\n' + indentation + extraIndent;
      const newValue = value.substring(0, start) + insertText + value.substring(start);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
        updateActiveLine();
      }, 0);
      return;
    }

    // Auto-close brackets/quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (pairs[e.key]) {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start !== end) {
        e.preventDefault();
        const selected = value.substring(start, end);
        const wrapped = e.key + selected + pairs[e.key];
        const newValue = value.substring(0, start) + wrapped + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }, 0);
        return;
      }
    }
  };

  const playButtonColor = useMemo(() => {
    switch (mode) {
      case 'js':
        return 'text-[#F7DF1E] hover:text-[#ffe833] hover:drop-shadow-[0_0_8px_rgba(247,223,30,0.6)]';
      case 'ts':
        return 'text-[#3178C6] hover:text-[#4b97fa] hover:drop-shadow-[0_0_8px_rgba(49,120,198,0.6)]';
      case 'node':
        return 'text-[#5FA04E] hover:text-[#74c460] hover:drop-shadow-[0_0_8px_rgba(95,160,78,0.6)]';
      case 'next':
        return 'text-white hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]';
      case 'web':
        return 'text-[#E44D26] hover:text-[#ff6138] hover:drop-shadow-[0_0_8px_rgba(228,77,38,0.6)]';
      default:
        return 'text-[#F7DF1E] hover:text-[#ffe833]';
    }
  }, [mode]);

  return (
    <div 
      className="flex flex-col h-full w-full bg-[#0b0d14] rounded-xl border border-[#1e2333] shadow-2xl overflow-hidden relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Clean Drag & Drop Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-30 bg-[#090b10]/95 border-2 border-dashed border-zinc-500 rounded-xl flex items-center justify-center pointer-events-none">
          <span className="text-sm font-medium text-zinc-300 font-mono tracking-wide px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg">
            Drop file to load code
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="h-11 bg-[#11141f] border-b border-[#1e2333] px-4 flex items-center justify-between select-none shrink-0">
        {/* Left: Tab / Title */}
        <div className="flex items-center gap-4">
          {mode === 'js' ? (
            <span className="text-sm font-medium text-slate-100 tracking-tight">
              JavaScript
            </span>
          ) : mode === 'ts' ? (
            <span className="text-sm font-medium text-slate-100 tracking-tight">
              TypeScript
            </span>
          ) : mode === 'node' ? (
            <span className="text-sm font-medium text-slate-100 tracking-tight">
              Node.js
            </span>
          ) : mode === 'next' ? (
            <span className="text-sm font-medium text-slate-100 tracking-tight">
              Next.js
            </span>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onSelectWebTab?.('html')}
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  activeWebTab === 'html'
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => onSelectWebTab?.('css')}
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  activeWebTab === 'css'
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => onSelectWebTab?.('js')}
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  activeWebTab === 'js'
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                JavaScript
              </button>
            </div>
          )}
        </div>

        {/* Right: Run, Copy, Download, Clear */}
        <div className="flex items-center gap-1.5">
          {/* Run button with primary playground brand color */}
          {onRun && (
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`p-1.5 rounded-md transition-all cursor-pointer hover:bg-zinc-800/80 active:scale-95 mr-0.5 ${
                isRunning
                  ? 'opacity-50 animate-pulse text-amber-300'
                  : playButtonColor
              }`}
              title="Run code (Ctrl + Enter)"
            >
              <Play className="w-4 h-4 fill-none stroke-current stroke-2" />
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={() => {
              if (!value) return;
              navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="text-zinc-300 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          {onShare && (
            <button
              onClick={onShare}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                shareState === 'copied'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : shareState === 'too_large'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
              title={
                shareState === 'copied'
                  ? 'Snippet link copied!'
                  : shareState === 'too_large'
                  ? 'Code is too large for URL sharing'
                  : 'Share code snippet link'
              }
            >
              {shareState === 'copied' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : shareState === 'too_large' ? (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={() => {
              if (!value) return;
              const ext = mode === 'js'
                ? 'js'
                : mode === 'ts'
                ? 'ts'
                : activeWebTab === 'html'
                ? 'html'
                : activeWebTab === 'css'
                ? 'css'
                : 'js';
              const filename = mode === 'js' ? 'script.js' : mode === 'ts' ? 'main.ts' : `index.${ext}`;
              const mimeType = ext === 'html' ? 'text/html' : ext === 'css' ? 'text/css' : 'text/javascript';
              const blob = new Blob([value], { type: mimeType });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="text-zinc-300 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear / Trash Button */}
          <button
            onClick={onClear}
            className="text-zinc-300 hover:text-rose-400 p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div 
        className="relative flex-1 w-full flex overflow-hidden bg-[#090b10] text-slate-100 font-mono text-[13px] leading-6 cursor-text"
        onClick={() => textareaRef.current?.focus()}
      >
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="w-12 shrink-0 select-none overflow-hidden bg-[#090b10] border-r border-[#1a1f2e] py-3 text-right pr-3 font-mono text-xs text-zinc-500"
        >
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isActive = lineNum === activeLine;
            return (
              <div
                key={lineNum}
                className={`h-6 leading-6 transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-500'
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Editor Container with Placeholder */}
        <div className="relative flex-1 h-full overflow-hidden">
          {/* Placeholder when empty */}
          {!value && (
            <div className="absolute top-3 left-3 text-zinc-500 font-mono text-[13px] pointer-events-none select-none">
              {placeholder}
            </div>
          )}

          {/* Active Line Highlight Strip */}
          <div
            className="absolute left-0 right-0 pointer-events-none bg-zinc-800/20 border-y border-zinc-700/10 transition-all duration-75"
            style={{
              top: `${(activeLine - 1) * 24 + 12}px`,
              height: '24px',
              transform: `translateY(-${textareaRef.current?.scrollTop || 0}px)`
            }}
          />

          {/* Syntax Highlighted Overlay */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 m-0 p-3 pointer-events-none overflow-hidden whitespace-pre font-mono text-[13px] leading-6"
            dangerouslySetInnerHTML={{
              __html: highlightedCode + (value.endsWith('\n') ? ' ' : '')
            }}
          />

          {/* Real Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateActiveLine();
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={updateActiveLine}
            onClick={updateActiveLine}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full p-3 m-0 bg-transparent text-transparent caret-zinc-200 font-mono text-[13px] leading-6 resize-none outline-none overflow-auto whitespace-pre selection:bg-yellow-500/30 selection:text-transparent z-10"
          />
        </div>
      </div>

      {/* Card Footer: Line & Character Counter */}
      <div className="h-7 bg-[#11141f] border-t border-[#1e2333] px-4 flex items-center justify-between select-none shrink-0">
        <span className="text-[10px] text-zinc-500 font-mono">
          Ln {activeLine}
        </span>
        <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}, {charCount} {charCount === 1 ? 'character' : 'characters'}
        </span>
      </div>
    </div>
  );
};
