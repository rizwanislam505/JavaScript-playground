import React, { useState, useRef, useEffect } from 'react';
import { ConsoleLogEntry, ActiveRightTab, PlaygroundMode } from '../types';
import { 
  Trash2, 
  CornerDownLeft, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  XCircle, 
  Info,
  CornerDownRight
} from 'lucide-react';

interface ConsoleViewProps {
  logs: ConsoleLogEntry[];
  onClear: () => void;
  onExecuteRepl?: (expression: string) => void;
  mode: PlaygroundMode;
  activeRightTab?: ActiveRightTab;
  onSelectRightTab?: (tab: ActiveRightTab) => void;
}

// Collapsible Object/Array Inspector Node
const ValueInspector: React.FC<{ value: any; depth?: number; maxDepth?: number }> = ({ 
  value, 
  depth = 0, 
  maxDepth = 3 
}) => {
  const [expanded, setExpanded] = useState(depth === 0);

  if (value === null) {
    return <span className="text-zinc-500 font-mono italic">null</span>;
  }
  if (value === undefined) {
    return <span className="text-zinc-500 font-mono italic">undefined</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="text-purple-400 font-mono">{value ? 'true' : 'false'}</span>;
  }
  if (typeof value === 'number') {
    return <span className="text-cyan-400 font-mono">{value}</span>;
  }
  if (typeof value === 'string') {
    if (depth === 0) {
      return <span className="text-emerald-300 font-mono whitespace-pre-wrap break-all">{value}</span>;
    }
    return <span className="text-emerald-400 font-mono">"{value}"</span>;
  }
  if (typeof value === 'symbol') {
    return <span className="text-amber-400 font-mono">{value.toString()}</span>;
  }
  if (typeof value === 'bigint') {
    return <span className="text-cyan-300 font-mono">{value.toString()}n</span>;
  }
  if (typeof value === 'function') {
    return <span className="text-blue-400 font-mono italic">ƒ {value.name || 'anonymous'}()</span>;
  }

  if (value instanceof Error || (value && typeof value === 'object' && value.name && value.message && (value.stack || String(value.name).endsWith('Error')))) {
    return (
      <div className="font-mono text-xs text-rose-400">
        <div className="font-semibold">{value.name}: {value.message}</div>
        {value.stack && (
          <pre className="text-[11px] text-rose-300/70 whitespace-pre-wrap mt-1 overflow-x-auto pl-2 border-l border-rose-500/30">
            {value.stack}
          </pre>
        )}
      </div>
    );
  }

  const isArray = Array.isArray(value);

  if (typeof value === 'object') {
    const keys = Object.keys(value);

    if (depth >= maxDepth && !expanded) {
      return (
        <span 
          onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          className="text-zinc-400 font-mono cursor-pointer hover:text-white"
        >
          {isArray ? `Array(${value.length}) [...]` : '{...}'}
        </span>
      );
    }

    return (
      <div className="inline-block text-xs font-mono">
        <span
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="inline-flex items-center gap-1 cursor-pointer select-none text-zinc-400 hover:text-zinc-200"
        >
          {expanded ? <ChevronDown className="w-3 h-3 text-zinc-400" /> : <ChevronRight className="w-3 h-3 text-zinc-400" />}
          <span className="font-semibold text-zinc-300">
            {isArray ? `Array(${value.length})` : (value.constructor ? value.constructor.name : 'Object')}
          </span>
          {!expanded && (
            <span className="text-zinc-500 text-[11px] ml-1">
              {isArray ? `[${keys.slice(0, 3).map(k => String((value as any)[k])).join(', ')}${keys.length > 3 ? ', ...' : ''}]` : `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ', ...' : ''}}`}
            </span>
          )}
        </span>

        {expanded && (
          <div className="pl-4 border-l border-zinc-800 my-1 flex flex-col gap-0.5">
            {keys.map((k) => (
              <div key={k} className="flex items-start gap-1">
                <span className="text-zinc-400 text-xs shrink-0 select-none">
                  {isArray ? <span className="text-zinc-500 font-mono">{k}:</span> : <span className="text-indigo-300">{k}:</span>}
                </span>
                <ValueInspector value={(value as any)[k]} depth={depth + 1} maxDepth={maxDepth} />
              </div>
            ))}
            {isArray && (
              <div className="text-zinc-500 text-[11px] select-none">length: {value.length}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return <span className="text-zinc-300 font-mono">{String(value)}</span>;
};

// Console.table visual renderer
const TableRenderer: React.FC<{ data: any }> = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return <ValueInspector value={data} />;
  }

  const isArr = Array.isArray(data);
  const rows: any[] = isArr 
    ? data 
    : Object.entries(data).map(([k, v]) => ({ '(index)': k, ...(typeof v === 'object' && v !== null ? v : { value: v }) }));

  // Collect all unique column headers
  const columnsSet = new Set<string>();
  columnsSet.add('(index)');
  rows.forEach((row, idx) => {
    if (row && typeof row === 'object') {
      Object.keys(row).forEach(k => columnsSet.add(k));
    } else {
      columnsSet.add('Values');
    }
  });

  const columns = Array.from(columnsSet);

  return (
    <div className="my-1.5 overflow-x-auto rounded border border-zinc-800 bg-[#07090e]">
      <table className="min-w-full text-left font-mono text-[11px] divide-y divide-zinc-800">
        <thead className="bg-[#11141f] text-zinc-300 font-semibold select-none">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-2.5 py-1.5 border-r border-zinc-800/80">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
          {rows.map((row: any, idx: number) => (
            <tr key={idx} className="hover:bg-zinc-800/30">
              <td className="px-2.5 py-1 text-zinc-500 border-r border-zinc-800/60 select-none font-bold">
                {isArr ? idx : (row['(index)'] ?? idx)}
              </td>
              {columns.slice(1).map(col => {
                const cellVal = typeof row === 'object' && row !== null ? row[col] : (col === 'Values' ? row : undefined);
                return (
                  <td key={col} className="px-2.5 py-1 border-r border-zinc-800/60 whitespace-nowrap">
                    <ValueInspector value={cellVal} depth={1} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  logs,
  onClear,
  onExecuteRepl,
  mode,
  activeRightTab = 'console',
  onSelectRightTab
}) => {
  const [replInput, setReplInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedLogs, setCopiedLogs] = useState<boolean>(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = replInput.trim();
      if (!trimmed) return;
      setHistory(prev => [...prev, trimmed]);
      setHistoryIndex(-1);
      if (onExecuteRepl) {
        onExecuteRepl(trimmed);
      }
      setReplInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setReplInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setReplInput('');
      } else {
        setHistoryIndex(nextIndex);
        setReplInput(history[nextIndex]);
      }
    }
  };

  const errorCount = logs.filter(l => l.type === 'error').length;

  return (
    <div className="flex flex-col h-full w-full bg-[#0b0d14] rounded-xl border border-[#1e2333] shadow-2xl overflow-hidden font-sans select-text">
      {/* Card Header matching reference screenshot */}
      <div className="h-11 bg-[#11141f] border-b border-[#1e2333] px-4 flex items-center justify-between select-none shrink-0">
        {/* Left: Tab / Title */}
        <div className="flex items-center gap-4">
          {mode === 'js' || mode === 'ts' ? (
            <span className="text-sm font-medium text-white tracking-tight flex items-center gap-2">
              Console
            </span>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onSelectRightTab?.('output')}
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  activeRightTab === 'output'
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Output
              </button>
              <button
                onClick={() => onSelectRightTab?.('console')}
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  activeRightTab === 'console'
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Console
                {errorCount > 0 && (
                  <span className="ml-1.5 px-1 py-0.2 bg-rose-500/20 text-rose-400 text-[10px] rounded">
                    {errorCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Copy & Delete / Trash */}
        <div className="flex items-center gap-1.5">

          {logs.length > 0 && (
            <button
              onClick={() => {
                const text = logs.map(l => l.items.map(it => typeof it === 'object' ? JSON.stringify(it, null, 2) : String(it)).join(' ')).join('\n');
                navigator.clipboard.writeText(text);
                setCopiedLogs(true);
                setTimeout(() => setCopiedLogs(false), 1500);
              }}
              className="text-zinc-300 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              title={copiedLogs ? "Copied logs!" : "Copy logs to clipboard"}
            >
              {copiedLogs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {logs.length > 0 && (
            <button
              onClick={onClear}
              className="text-zinc-300 hover:text-rose-400 p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Clear console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Console Logs Display Area */}
      <div 
        ref={logsContainerRef}
        className="flex-1 overflow-y-auto bg-[#090b10] p-3 text-[12px] leading-relaxed cursor-text relative"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.length === 0 ? (
          /* When console is clear, show a clean prompt line '>' exactly like the screenshot */
          <div className="font-mono text-zinc-600 select-none">
            &gt;
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full">
            {logs.map((log) => {
              const isError = log.type === 'error';
              const isWarn = log.type === 'warn';
              const isInfo = log.type === 'info';
              const isReturn = log.type === 'return';
              const isCommand = log.type === 'command';
              const isTable = log.type === 'table';

              return (
                <div
                  key={log.id}
                  className={`group flex items-start gap-2.5 py-1 px-2 rounded font-mono text-[12px] border transition-colors ${
                    isError
                      ? 'bg-rose-950/25 border-rose-900/40 text-rose-300'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-900/30 text-amber-300'
                      : isInfo
                      ? 'bg-blue-950/20 border-blue-900/30 text-blue-300'
                      : isReturn
                      ? 'bg-zinc-900/30 border-transparent text-zinc-400 italic'
                      : isCommand
                      ? 'bg-zinc-900/50 border-zinc-800/60 text-slate-100 font-semibold'
                      : 'border-transparent text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="shrink-0 mt-0.5 select-none">
                    {isError && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                    {isWarn && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {isInfo && <Info className="w-3.5 h-3.5 text-blue-400" />}
                    {isCommand && <span className="text-zinc-500 font-bold">&gt;</span>}
                    {isReturn && <CornerDownRight className="w-3.5 h-3.5 text-zinc-500" />}
                    {!isError && !isWarn && !isInfo && !isCommand && !isReturn && (
                      <span className="text-zinc-600 text-xs">•</span>
                    )}
                  </div>

                  {/* Log Items / Content */}
                  <div className="flex-1 min-w-0 overflow-x-auto">
                    {isTable ? (
                      <TableRenderer data={log.items[0]} />
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {log.items.map((item, idx) => (
                          <ValueInspector key={idx} value={item} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="shrink-0 text-[10px] text-zinc-600 select-none opacity-40 group-hover:opacity-100 transition-opacity">
                    {log.timestamp}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REPL Interactive Prompt Line (e.g. > evaluate...) */}
      <div className="border-t border-[#1a1f2e] bg-[#0c0f18] px-3 py-2 flex items-center gap-2 shrink-0">
        <span className="text-zinc-400 font-bold select-none text-xs">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={replInput}
          onChange={(e) => setReplInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Evaluate JavaScript expression... (e.g. 2 + 2, [1, 2, 3].reverse())"
          className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-zinc-600 text-xs font-mono"
        />
        {replInput.trim() && (
          <button
            onClick={() => {
              if (onExecuteRepl && replInput.trim()) {
                onExecuteRepl(replInput.trim());
                setHistory(prev => [...prev, replInput.trim()]);
                setReplInput('');
              }
            }}
            className="text-zinc-300 hover:text-white p-1 rounded hover:bg-zinc-800 cursor-pointer"
            title="Evaluate (Enter)"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Card Footer: clean, tabular-nums */}
      <div className="h-7 bg-[#11141f] border-t border-[#1e2333] px-4 flex items-center justify-between select-none shrink-0">
        <span className="text-[10px] text-zinc-500 font-mono">
          Console
        </span>
        <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
          {logs.length} {logs.length === 1 ? 'log' : 'logs'}
          {errorCount > 0 ? `, ${errorCount} ${errorCount === 1 ? 'error' : 'errors'}` : ''}
        </span>
      </div>
    </div>
  );
};
