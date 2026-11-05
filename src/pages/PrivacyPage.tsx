import React, { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy – JS Playground",
    "url": "https://jsplayground.js.org/privacy-policy",
    "description": "JS Playground Privacy Policy. Learn about our 100% client-side execution, zero code tracking, and local storage safety."
  };

  return (
    <div className="min-h-screen w-full bg-[#080a0f] text-zinc-300 font-sans selection:bg-yellow-500/30 selection:text-white overflow-y-auto">
      <SEOHead
        title="Privacy Policy – JS Playground"
        description="JS Playground Privacy Policy. Learn about our 100% client-side execution, zero code tracking, and local storage safety."
        keywords="JS Playground privacy policy, JavaScript playground privacy, zero tracking code editor, private client-side JS runner, local browser sandbox privacy"
        canonicalPath="/privacy-policy"
        jsonLd={privacyJsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Playground
          </a>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 font-semibold">Privacy Policy</span>
        </nav>

        {/* Content Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <header className="space-y-3 border-b border-zinc-800/50 pb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Last Updated: November 2026
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
              This Privacy Policy explains how information is handled when you use JS Playground.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              2. Zero Server-Side Code Collection
            </h2>
            <p>
              When you write, edit, compile, or execute code in JS Playground, <strong>no code is ever sent to our servers or any third-party backend</strong>. All parsing, evaluation, formatting, and execution occur strictly within your computer's local web browser memory using native ECMAScript engines (Google V8, Mozilla SpiderMonkey, or Apple JavaScriptCore).
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
              If you have any questions or concerns regarding this Privacy Policy, please open an issue on the official GitHub repository or contact us via email:
            </p>
            <div className="space-y-2 font-mono text-xs sm:text-sm">
              <p className="text-yellow-400">
                <span className="text-zinc-400">GitHub: </span>
                <a
                  href="https://github.com/rizwanislam505/JavaScript-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-yellow-400"
                >
                  github.com/rizwanislam505/JavaScript-playground
                </a>
              </p>
              <p className="text-yellow-400">
                <span className="text-zinc-400">Email: </span>
                <a
                  href="mailto:rizwanislam505@gmail.com"
                  className="hover:underline text-yellow-400"
                >
                  rizwanislam505@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Footer Navigation */}
          <footer className="mt-16 pt-8 border-t border-zinc-800/80 text-xs text-zinc-400 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-[4px] bg-[#F7DF1E] flex items-center justify-center font-bold text-black text-[10px]">
                JS
              </div>
              <span className="font-bold text-white text-xs">JS Playground</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-zinc-500">&copy; 2026 jsplayground.js.org. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-zinc-400 text-xs">
              <a href="/" onClick={(e) => handleLink(e, '/')} className="hover:text-white transition-colors">
                Playground
              </a>
              <a href="/about" onClick={(e) => handleLink(e, '/about')} className="hover:text-white transition-colors">
                About
              </a>
              <a href="/privacy-policy" onClick={(e) => handleLink(e, '/privacy-policy')} className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" onClick={(e) => handleLink(e, '/terms-of-service')} className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a
                href="https://github.com/rizwanislam505/JavaScript-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
