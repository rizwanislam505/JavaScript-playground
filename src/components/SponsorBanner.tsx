import React from 'react';
import { sponsorConfig, SponsorConfig } from '../config/sponsorConfig';

interface SponsorBannerProps {
  theme?: 'dark' | 'light';
  config?: SponsorConfig;
}

export const SponsorBanner: React.FC<SponsorBannerProps> = ({ 
  theme = 'dark',
  config = sponsorConfig 
}) => {
  if (!config.enabled) return null;

  return (
    <aside 
      className={`w-full shrink-0 transition-colors duration-200 select-none font-sans z-20 ${
        theme === 'dark' 
          ? 'bg-[#090b10] text-zinc-100 border-t border-[#1a1f2c]' 
          : 'bg-white text-zinc-900 border-t border-zinc-200'
      }`}
      aria-label="Developer Sponsor Advertisement"
    >
      <div className="w-full px-3 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-[13px]">
        {/* Left: Dynamic Config Logo + Brand Name */}
        <div className="flex items-center gap-1.5 shrink-0">
          {config.logoUrl && (
            <img 
              src={config.logoUrl} 
              alt={`${config.name} Logo`} 
              className="w-5 h-5 sm:w-7 sm:h-7 object-contain shrink-0"
            />
          )}
          <span className="font-semibold text-xs sm:text-[15px] tracking-tight text-zinc-100 font-sans">
            {config.name}
          </span>
        </div>

        {/* Center: Dynamic Config Title / Headline */}
        <div className="text-[11px] sm:text-sm text-zinc-300 font-sans font-normal truncate max-w-[140px] xs:max-w-[220px] sm:max-w-xl">
          {config.title}
        </div>

        {/* Right: Dynamic Config Action Link */}
        <div className="flex items-center shrink-0">
          <a
            href={config.actionUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 font-semibold text-[#ff5722] hover:text-[#ff7043] transition-colors group underline-offset-4 hover:underline font-sans text-xs sm:text-sm"
          >
            <span>{config.actionText}</span>
            <svg 
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
};
