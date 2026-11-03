import React, { useEffect } from 'react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Privacy Policy – JS Playground (jsplayground.js.org)';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Read the Privacy Policy for JS Playground (jsplayground.js.org). Learn about our 100% client-side privacy, zero code tracking, and local storage usage.');
    window.scrollTo(0, 0);
  }, []);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-[#080a0f] text-zinc-300 font-sans selection:bg-yellow-500/30 selection:text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Navigation Bar */}
        <nav className="mb-10 pb-4 border-b border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm">
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className="text-zinc-400 hover:text-white font-medium transition-colors hover:underline"
          >
            &larr; Back to Playground
          </a>
          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="/about"
              onClick={(e) => handleLink(e, '/about')}
              className="text-zinc-400 hover:text-white transition-colors hover:underline"
            >
              About
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-white font-semibold">Privacy Policy</span>
            <span className="text-zinc-700">|</span>
            <a
              href="/terms-of-service"
              onClick={(e) => handleLink(e, '/terms-of-service')}
              className="text-zinc-400 hover:text-white transition-colors hover:underline"
            >
              Terms of Service
            </a>
          </div>
        </nav>

        {/* Content Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <header className="space-y-3 border-b border-zinc-800/50 pb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Last Revised: November 2026 &bull; Domain: jsplayground.js.org
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              1. Overview &amp; Privacy First Design
            </h2>
            <p>
              JS Playground (<strong>jsplayground.js.org</strong>) is engineered around a core principle: <strong>100% client-side privacy</strong>. We believe developers should be able to experiment with code, algorithms, and web components without worrying about remote code telemetry, server monitoring, or hidden data collection.
            </p>
            <p>
              This Privacy Policy explains how information is handled when you use JS Playground or TypeScript Playground.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              2. Zero Server-Side Code Collection
            </h2>
            <p>
              When you write, edit, compile, or execute code in JS Playground or TypeScript Playground, <strong>no code is ever sent to our servers or any third-party backend</strong>. All parsing, evaluation, formatting, and execution occur strictly within your computer's local web browser memory using native ECMAScript engines (Google V8, Mozilla SpiderMonkey, or Apple JavaScriptCore).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              3. Local Storage Usage (localStorage)
            </h2>
            <p>
              To prevent accidental data loss when refreshing or closing your browser tab, JS Playground uses your browser's native <code>localStorage</code> mechanism to save your active code snippet locally. This data remains physically stored on your own device and is never transmitted over the network. You can clear this stored state at any time by clearing your browser's site data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              4. Cookies, Tracking &amp; Analytics
            </h2>
            <p>
              JS Playground does not use analytics tracking scripts, tracking cookies, session recording software, or telemetry. We do not track your IP address, browsing behavior, or user identity across sessions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              5. Third-Party Links &amp; Sponsor Advertisements
            </h2>
            <p>
              JS Playground may display developer sponsor banners or links (e.g. Adsterra or partner developer tools). Clicking these links redirects you to external websites governed by their own respective privacy policies and terms. We recommend reviewing the privacy practices of any third-party site you visit.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              6. Contact Information
            </h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please open an issue on the official GitHub repository at:
            </p>
            <p className="font-mono text-xs sm:text-sm text-yellow-400">
              <a
                href="https://github.com/rizwanislam505/JavaScript-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                https://github.com/rizwanislam505/JavaScript-playground
              </a>
            </p>
          </section>

          {/* Footer Navigation */}
          <footer className="pt-8 border-t border-zinc-800 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-4">
            <span>&copy; 2026 JS Playground (jsplayground.js.org). All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/" onClick={(e) => handleLink(e, '/')} className="text-zinc-400 hover:text-zinc-200 hover:underline">Playground</a>
              <a href="/about" onClick={(e) => handleLink(e, '/about')} className="text-zinc-400 hover:text-zinc-200 hover:underline">About</a>
              <a href="/terms-of-service" onClick={(e) => handleLink(e, '/terms-of-service')} className="text-zinc-400 hover:text-zinc-200 hover:underline">Terms of Service</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
