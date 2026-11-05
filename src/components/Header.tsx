import React from 'react';
import { Menu } from 'lucide-react';
import { PlaygroundMode } from '../types';

interface HeaderProps {
  mode: PlaygroundMode;
  onModeChange: (mode: PlaygroundMode) => void;
  onToggleDrawer?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const LOGOS: Record<PlaygroundMode, { src: string; alt: string; label: string; bg?: string }> = {
  js: {
    src: 'https://cdn.worldvectorlogo.com/logos/javascript-1.svg',
    alt: 'JavaScript Logo',
    label: 'Playground',
    bg: '#F7DF1E'
  },
  ts: {
    src: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png',
    alt: 'TypeScript Logo',
    label: 'Playground',
    bg: '#3178C6'
  },
  node: {
    src: '/assets/images/nodejs-logo.svg',
    alt: 'Node.js Logo',
    label: 'Playground',
    bg: 'transparent'
  },
  next: {
    src: '/public/assets/aistudio/image_5d8acb78.png',
    alt: 'Next.js Logo',
    label: 'Playground',
    bg: '#000000'
  },
  web: {
    src: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png',
    alt: 'Web Logo',
    label: 'Playground',
    bg: '#E44D26'
  }
};

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onToggleDrawer
}) => {
  const currentLogo = LOGOS[mode] || LOGOS.js;
  const showJsWebToggle = mode === 'js' || mode === 'web';

  return (
    <header 
      className="w-full px-3 py-2 sm:px-5 sm:py-2.5 bg-[#080a0f] border-b border-[#1a1f2e] flex items-center justify-between select-none z-30 shrink-0 relative"
      aria-label="Playground Header"
    >
      {/* Left: Dynamic Logo matching active mode + "Playground" */}
      <div className="flex items-center gap-2.5 shrink-0 z-10">
        <div 
          className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center ${
            currentLogo.bg === 'transparent' ? '' : 'rounded-[5px] overflow-hidden shadow-xs'
          }`}
          style={currentLogo.bg === 'transparent' ? undefined : { backgroundColor: currentLogo.bg }}
        >
          <img 
            src={currentLogo.src} 
            alt={currentLogo.alt} 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-bold text-[15px] sm:text-[17px] tracking-tight text-white font-sans shrink-0">
          Playground
        </span>
      </div>

      {/* Center: JS & Web Toggle */}
      {showJsWebToggle && (
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
          role="group"
          aria-label="Mode Switcher"
        >
          <div className="flex items-center bg-[#11141e] border border-zinc-800 rounded-md p-0.5 gap-0.5 shadow-inner">
            <button
              onClick={() => onModeChange('js')}
              title="JS Playground Mode"
              aria-label="JS Playground Mode"
              className={`w-11 sm:w-12 py-0.5 text-center text-[10px] sm:text-[11px] font-semibold rounded transition-all cursor-pointer ${
                mode === 'js'
                  ? 'text-white bg-zinc-700/90 shadow-xs border border-zinc-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              JS
            </button>

            <span className="text-zinc-600 text-[9px] font-bold select-none px-0.5">·</span>

            <button
              onClick={() => onModeChange('web')}
              title="Web Playground Mode"
              aria-label="Web Playground Mode"
              className={`w-11 sm:w-12 py-0.5 text-center text-[10px] sm:text-[11px] font-semibold rounded transition-all cursor-pointer ${
                mode === 'web'
                  ? 'text-white bg-zinc-700/90 shadow-xs border border-zinc-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              Web
            </button>
          </div>
        </div>
      )}

      {/* Right: GitHub repository link icon & Three-line hamburger menu */}
      <div className="flex items-center justify-end gap-2.5 z-10 shrink-0">
        <a
          href="https://github.com/rizwanislam505/JavaScript-playground"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub (rizwanislam505/JavaScript-playground)"
          className="text-zinc-400 hover:text-white p-2 rounded-md hover:bg-zinc-800/60 transition-colors cursor-pointer flex items-center justify-center"
          aria-label="GitHub Repository"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        {onToggleDrawer && (
          <button
            onClick={onToggleDrawer}
            className="p-1 text-zinc-400 hover:text-white rounded-md transition-colors cursor-pointer flex items-center justify-center"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
