import React, { useEffect, useRef, useState } from 'react';
import { WebProjectState, ConsoleLogEntry, LogLevel, ActiveRightTab } from '../types';
import { RotateCw, ExternalLink } from 'lucide-react';

interface WebPreviewProps {
  project: WebProjectState;
  onConsoleMessage: (entry: ConsoleLogEntry) => void;
  runTrigger: number;
  activeRightTab: ActiveRightTab;
  onSelectRightTab: (tab: ActiveRightTab) => void;
}

export const WebPreview: React.FC<WebPreviewProps> = ({
  project,
  onConsoleMessage,
  runTrigger,
  activeRightTab,
  onSelectRightTab
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const generatedDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${project.css}
  </style>
  <script>
    (function() {
      try {
        var _nativeFetch = window.fetch ? window.fetch.bind(window) : undefined;
        var _customFetch = _nativeFetch;

        if (typeof Window !== 'undefined' && Window.prototype) {
          try {
            Object.defineProperty(Window.prototype, 'fetch', {
              get: function() { return _customFetch; },
              set: function(fn) { _customFetch = fn; },
              configurable: true,
              enumerable: true
            });
          } catch(e) {}
        }

        try {
          Object.defineProperty(window, 'fetch', {
            get: function() { return _customFetch; },
            set: function(fn) { _customFetch = fn; },
            configurable: true,
            enumerable: true
          });
        } catch(e) {}
      } catch(e) {}

      window.addEventListener('error', function(event) {
        if (!event) return;
        var filename = event.filename || '';
        var message = (event.message || '') + (event.error ? ' ' + (event.error.stack || event.error.message) : '');
        if (
          filename.indexOf('chrome-extension:') !== -1 ||
          filename.indexOf('moz-extension:') !== -1 ||
          filename.indexOf('frame_ant') !== -1 ||
          message.indexOf('Cannot set property fetch') !== -1 ||
          message.indexOf('frame_ant') !== -1
        ) {
          if (event.preventDefault) event.preventDefault();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return true;
        }
      }, true);

      function serialize(val, depth = 0) {
        if (depth > 4) return '[...]';
        if (val === null || val === undefined) return val;
        if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') return val;
        if (typeof val === 'function') return val.toString();
        if (val instanceof Error) return { name: val.name, message: val.message, stack: val.stack };
        if (typeof val === 'object') {
          if (Array.isArray(val)) {
            return val.slice(0, 50).map(function(it) { return serialize(it, depth + 1); });
          }
          var out = {};
          try {
            var keys = Object.keys(val).slice(0, 50);
            for (var i = 0; i < keys.length; i++) {
              out[keys[i]] = serialize(val[keys[i]], depth + 1);
            }
          } catch(e) {}
          return out;
        }
        return String(val);
      }

      function sendToParent(type, args, line) {
        try {
          window.parent.postMessage({
            source: 'web-playground-preview',
            type: type,
            payload: args.map(serialize),
            sourceLine: line
          }, '*');
        } catch(e) {}
      }

      const origLog = console.log;
      const origInfo = console.info;
      const origWarn = console.warn;
      const origError = console.error;
      const origTable = console.table;
      const origDebug = console.debug;

      console.log = function(...args) { sendToParent('log', args); origLog.apply(console, args); };
      console.info = function(...args) { sendToParent('info', args); origInfo.apply(console, args); };
      console.warn = function(...args) { sendToParent('warn', args); origWarn.apply(console, args); };
      console.error = function(...args) { sendToParent('error', args); origError.apply(console, args); };
      console.table = function(...args) { sendToParent('table', args); if (origTable) origTable.apply(console, args); };
      console.debug = function(...args) { sendToParent('debug', args); if (origDebug) origDebug.apply(console, args); };

      window.onerror = function(msg, src, line) {
        if (
          (typeof src === 'string' && (src.includes('chrome-extension:') || src.includes('moz-extension:') || src.includes('extension'))) ||
          (typeof msg === 'string' && (msg.includes('Cannot set property fetch') || msg.includes('chrome-extension:')))
        ) {
          return true;
        }
        sendToParent('error', [msg], line);
        return false;
      };

      window.onunhandledrejection = function(e) {
        const reasonStr = e.reason ? (e.reason.message || String(e.reason)) : '';
        if (reasonStr.includes('chrome-extension:') || reasonStr.includes('Cannot set property fetch')) {
          e.preventDefault();
          return;
        }
        sendToParent('error', ['Unhandled Promise Rejection: ' + reasonStr]);
      };
    })();
  </script>
</head>
<body>
  ${project.html}
  <script>
    try {
      ${project.js}
    } catch (err) {
      console.error(err);
    }
  </script>
</body>
</html>`;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || e.data.source !== 'web-playground-preview') return;
      const { type, payload, sourceLine } = e.data;
      if (type && payload) {
        const entry: ConsoleLogEntry = {
          id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
          type: type as LogLevel,
          items: payload,
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          sourceLine
        };
        onConsoleMessage(entry);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleMessage]);

  const handleOpenNewTab = () => {
    const blob = new Blob([generatedDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0b0d14] rounded-xl border border-[#1e2333] shadow-2xl overflow-hidden">
      {/* Card Header matching screenshot */}
      <div className="h-11 bg-[#11141f] border-b border-[#1e2333] px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectRightTab('output')}
            className={`text-xs font-medium transition-colors cursor-pointer ${
              activeRightTab === 'output'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Output
          </button>
          <button
            onClick={() => onSelectRightTab('console')}
            className={`text-xs font-medium transition-colors cursor-pointer ${
              activeRightTab === 'console'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Console
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setReloadKey(k => k + 1)}
            className="text-zinc-300 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Reload output preview"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenNewTab}
            className="text-zinc-300 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Pop out in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="relative flex-1 h-full w-full bg-white overflow-hidden">
        <iframe
          key={`${runTrigger}-${reloadKey}`}
          ref={iframeRef}
          title="Website Output"
          sandbox="allow-scripts allow-modals allow-same-origin"
          srcDoc={generatedDoc}
          className="w-full h-full border-none bg-white"
        />
      </div>

      {/* Card Footer */}
      <div className="h-7 bg-[#11141f] border-t border-[#1e2333] px-4 flex items-center justify-end select-none shrink-0">
        <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
          Live website output
        </span>
      </div>
    </div>
  );
};
