import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#080a0f] border-t border-[#1a1f2e] py-2 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 select-none z-20 shrink-0 gap-1.5 font-sans">
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} JS Playground.</span>
        <span>·</span>
        <a
          href="https://github.com/rizwanislam505"
          onClick={(e) => {
            e.preventDefault();
            window.open('https://github.com/rizwanislam505', '_blank', 'noopener,noreferrer');
          }}
          className="text-white hover:underline font-medium cursor-pointer"
        >
          Made by Rezwan Islam
        </a>
      </div>

      <div className="flex items-center gap-3 text-zinc-400">
        <button
          onClick={() => onNavigate('/about')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          About
        </button>
        <span>·</span>
        <button
          onClick={() => onNavigate('/privacy-policy')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
        <span>·</span>
        <button
          onClick={() => onNavigate('/terms-of-service')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Terms of Service
        </button>
      </div>
    </footer>
  );
};
