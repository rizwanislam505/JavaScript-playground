import React from 'react';
import { PlaygroundMode } from '../types';

interface HeaderProps {
  mode: PlaygroundMode;
  onModeChange: (mode: PlaygroundMode) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <header 
      className="relative h-14 w-full bg-[#080a0f] border-b border-[#1a1f2e] px-4 sm:px-6 flex items-center justify-between select-none z-30 shrink-0"
      aria-label="JS Playground and JavaScript Playground Header"
    >
      {/* Left: JS logo + Playground title */}
      <div className="flex items-center gap-3 z-10">
        <div 
          className="flex items-center gap-2.5 select-none"
        >
          {/* Authentic JavaScript Logo recreated from attached image asset */}
          <div className="w-7 h-7 bg-[#F7DF1E] rounded-[3px] shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
            <img 
              src="/assets/images/logo.png" 
              alt="JS Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white font-sans">
            Playground
          </span>
        </div>
      </div>

      {/* Center: Mathematically centered Segmented Capsule [ JS  ·  Web ] */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
        role="group"
        aria-label="JS Playground and Web Playground Mode Switcher"
      >
        <div className="flex items-center bg-[#131722] border border-zinc-700/80 rounded-lg p-1 gap-1.5 shadow-inner">
          {/* JS Playground button */}
          <button
            onClick={() => onModeChange('js')}
            title="JS Playground Mode – Run pure JavaScript and modern ECMAScript"
            aria-label="JS Playground Mode"
            aria-pressed={mode === 'js'}
            className={`text-xs font-semibold px-3 py-1 rounded transition-all cursor-pointer ${
              mode === 'js'
                ? 'text-white bg-zinc-700 shadow-sm border border-zinc-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            JS
          </button>

          {/* Dot Separator */}
          <span className="text-zinc-500 text-xs font-bold select-none px-0.5">·</span>

          {/* Web Playground button */}
          <button
            onClick={() => onModeChange('web')}
            title="Web Playground Mode – HTML, CSS, and JavaScript with Live Preview"
            aria-label="Web Playground Mode"
            aria-pressed={mode === 'web'}
            className={`text-xs font-semibold px-3 py-1 rounded transition-all cursor-pointer ${
              mode === 'web'
                ? 'text-white bg-zinc-700 shadow-sm border border-zinc-500/50'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            Web
          </button>
        </div>
      </div>

      {/* Right spacer */}
      <div className="w-8" />
    </header>
  );
};
