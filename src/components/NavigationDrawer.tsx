import React from 'react';
import { X } from 'lucide-react';
import { PlaygroundMode } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: PlaygroundMode;
  currentRoute: string;
  onNavigate: (path: string) => void;
  onModeChange: (mode: PlaygroundMode) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  onModeChange
}) => {
  if (!isOpen) return null;

  const handleSelectPlayground = (mode: PlaygroundMode, path: string) => {
    onModeChange(mode);
    onNavigate(path);
    onClose();
  };

  const handleRouteClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer: Background same as main app #080a0f */}
      <div className="relative w-80 max-w-[85vw] bg-[#080a0f] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#1a1f2e]">
          <span className="font-bold text-sm text-white tracking-tight">More Playgrounds</span>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Main */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <nav className="space-y-1">
              <button
                onClick={() => handleSelectPlayground('js', '/')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#0c0f17] transition-colors cursor-pointer"
              >
                JavaScript Playground
              </button>
              <button
                onClick={() => handleSelectPlayground('ts', '/typescript-playground')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#0c0f17] transition-colors cursor-pointer"
              >
                TypeScript Playground
              </button>
              <button
                onClick={() => handleSelectPlayground('node', '/nodejs-playground')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#0c0f17] transition-colors cursor-pointer"
              >
                Node.js Playground
              </button>
              <button
                onClick={() => handleSelectPlayground('next', '/nextjs-playground')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#0c0f17] transition-colors cursor-pointer"
              >
                Next.js Playground
              </button>
              <button
                onClick={() => handleSelectPlayground('web', '/')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#0c0f17] transition-colors cursor-pointer"
              >
                Website Playground
              </button>
            </nav>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-[#1a1f2e] text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-zinc-400">
            <button onClick={() => handleRouteClick('/about')} className="hover:text-white transition-colors cursor-pointer">
              About
            </button>
            <span className="text-zinc-600 font-bold select-none">•</span>
            <button onClick={() => handleRouteClick('/privacy-policy')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-zinc-600 font-bold select-none">•</span>
            <button onClick={() => handleRouteClick('/terms-of-service')} className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
