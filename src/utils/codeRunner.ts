import { ConsoleLogEntry, LogLevel } from '../types';

export interface RunResult {
  logs: ConsoleLogEntry[];
  executionTimeMs: number;
  returnValue?: any;
  hasError?: boolean;
}

/**
 * Prepares user code so that:
 * 1. Top-level await is supported.
 * 2. If the last statement is an expression (e.g. 2 + 2, a + b, [1, 2, 3]),
 *    its value is automatically returned and printed in the console (like Chrome DevTools / Node REPL).
 * 3. Statements like loops, functions, variable declarations continue to work normally.
 */
function prepareExecutableCode(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) return '';

  // If code explicitly begins with return, return as-is
  if (/^return\b/.test(trimmed)) {
    return trimmed;
  }

  // Split into lines to inspect the last non-empty statement
  const lines = trimmed.split('\n');
  let lastNonEmptyIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().length > 0) {
      lastNonEmptyIndex = i;
      break;
    }
  }

  if (lastNonEmptyIndex !== -1) {
    const lastLine = lines[lastNonEmptyIndex].trim();
    const cleanLastLine = lastLine.replace(/;+\s*$/, '');

    // Check if the last statement is a declaration or block/control structure
    const isDeclOrControl = /^(const|let|var|function|class|if|for|while|do|switch|try|catch|finally|import|export|debugger|throw|return)\b/.test(cleanLastLine);

    if (!isDeclOrControl && !cleanLastLine.endsWith('{') && !cleanLastLine.endsWith('}')) {
      const candidateLines = [...lines];
      candidateLines[lastNonEmptyIndex] = `return (${cleanLastLine});`;
      const candidateCode = candidateLines.join('\n');

      try {
        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
        // Verify candidate compiles without syntax error
        new AsyncFunction('console', 'alert', 'prompt', 'confirm', candidateCode);
        return candidateCode;
      } catch {
        // Fall back to original code if candidate was invalid syntax
      }
    }
  }

  return code;
}

/**
 * Executes JavaScript code reliably and sends real-time logs to the playground console.
 */
export async function executeJavaScript(
  code: string,
  onLog: (entry: ConsoleLogEntry) => void,
  onClear?: () => void
): Promise<RunResult> {
  const startTime = performance.now();
  const collectedLogs: ConsoleLogEntry[] = [];

  const sendEntry = (type: LogLevel, items: any[], sourceLine?: number) => {
    const entry: ConsoleLogEntry = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      type,
      items: items.length === 0 ? [''] : items,
      timestamp: new Date().toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      sourceLine,
    };
    collectedLogs.push(entry);
    onLog(entry);
  };

  // Custom scoped console
  const scopedConsole = {
    log: (...args: any[]) => sendEntry('log', args),
    info: (...args: any[]) => sendEntry('info', args),
    warn: (...args: any[]) => sendEntry('warn', args),
    error: (...args: any[]) => sendEntry('error', args),
    debug: (...args: any[]) => sendEntry('debug', args),
    dir: (...args: any[]) => sendEntry('dir', args),
    table: (...args: any[]) => sendEntry('table', args),
    clear: () => {
      if (onClear) onClear();
    },
  };

  // Safe browser dialog mocks so alert/prompt/confirm log cleanly instead of throwing sandbox errors
  const mockAlert = (msg?: any) => {
    sendEntry('info', [`[Alert]: ${msg !== undefined ? String(msg) : ''}`]);
  };
  const mockPrompt = (msg?: any, defaultVal?: any) => {
    sendEntry('info', [`[Prompt]: ${msg !== undefined ? String(msg) : ''}`]);
    return defaultVal || null;
  };
  const mockConfirm = (msg?: any) => {
    sendEntry('info', [`[Confirm]: ${msg !== undefined ? String(msg) : ''}`]);
    return true;
  };

  // Intercept window.console methods temporarily for direct global calls
  const origLog = window.console.log;
  const origInfo = window.console.info;
  const origWarn = window.console.warn;
  const origError = window.console.error;
  const origDebug = window.console.debug;
  const origDir = window.console.dir;
  const origTable = window.console.table;
  const origClear = window.console.clear;

  window.console.log = scopedConsole.log;
  window.console.info = scopedConsole.info;
  window.console.warn = scopedConsole.warn;
  window.console.error = scopedConsole.error;
  window.console.debug = scopedConsole.debug;
  window.console.dir = scopedConsole.dir;
  window.console.table = scopedConsole.table;
  window.console.clear = scopedConsole.clear;

  let hasError = false;
  let returnedValue: any = undefined;

  try {
    const trimmed = code.trim();
    if (!trimmed) {
      return {
        logs: [],
        executionTimeMs: 0,
        returnValue: undefined,
        hasError: false,
      };
    }

    const codeToRun = prepareExecutableCode(trimmed);
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const runnerFn = new AsyncFunction('console', 'alert', 'prompt', 'confirm', codeToRun);

    const executionPromise = runnerFn(scopedConsole, mockAlert, mockPrompt, mockConfirm);
    returnedValue = await executionPromise;

    // Show completion/return value if not undefined (e.g. 2 + 2, expressions, returned objects)
    if (returnedValue !== undefined) {
      sendEntry('return', [returnedValue]);
    }
  } catch (err: any) {
    hasError = true;
    const errorMsg = err instanceof Error ? err.stack || err.message : String(err);
    sendEntry('error', [errorMsg]);
  } finally {
    // Restore window.console
    window.console.log = origLog;
    window.console.info = origInfo;
    window.console.warn = origWarn;
    window.console.error = origError;
    window.console.debug = origDebug;
    window.console.dir = origDir;
    window.console.table = origTable;
    window.console.clear = origClear;
  }

  const endTime = performance.now();
  return {
    logs: collectedLogs,
    executionTimeMs: Math.round(endTime - startTime),
    returnValue: returnedValue,
    hasError,
  };
}
