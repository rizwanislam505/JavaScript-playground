export type PlaygroundMode = 'js' | 'ts' | 'web';
export type ActiveWebEditorTab = 'html' | 'css' | 'js';
export type ActiveRightTab = 'output' | 'console';

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug' | 'table' | 'command' | 'result' | 'return' | 'dir';

export interface ConsoleLogEntry {
  id: string;
  type: LogLevel;
  items: any[];
  timestamp: string;
  count?: number;
  sourceLine?: number;
}

export interface WebProjectState {
  html: string;
  css: string;
  js: string;
}
