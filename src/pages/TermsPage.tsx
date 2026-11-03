import React, { useEffect } from 'react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Terms of Service – JS Playground';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'JS Playground Terms of Service. Review user code ownership, platform disclaimers, and acceptable use guidelines.');
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
            <a
              href="/privacy-policy"
              onClick={(e) => handleLink(e, '/privacy-policy')}
              className="text-zinc-400 hover:text-white transition-colors hover:underline"
            >
              Privacy Policy
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-white font-semibold">Terms of Service</span>
          </div>
        </nav>

        {/* Content Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <header className="space-y-3 border-b border-zinc-800/50 pb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Last Revised: November 2026 &bull; Domain: jsplayground.js.org
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using JS Playground (hosted at <strong>jsplayground.js.org</strong>) or TypeScript Playground, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              2. Description of Service
            </h2>
            <p>
              JS Playground provides a free browser-based developer utility that enables users to write, execute, format, test, and debug JavaScript, TypeScript, HTML, and CSS code directly in their client browser. The platform is provided without charge on an "as-is" and "as-available" basis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              3. User Code Ownership &amp; Intellectual Property
            </h2>
            <p>
              <strong>You retain 100% full, exclusive ownership</strong> of all source code, algorithms, logic, and content created or imported into JS Playground. JS Playground claims zero ownership, license, or right over user-authored code.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              4. Acceptable Conduct
            </h2>
            <p>
              You agree not to use JS Playground to construct or distribute malicious scripts, phishing attacks, or destructive software designed to compromise user security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              5. Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p className="uppercase text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono bg-[#10141f] p-4 rounded-xl border border-zinc-800">
              THE SERVICE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY ARISING FROM THE USE OF THE SERVICE.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              6. Repository &amp; Contact
            </h2>
            <p>
              For developer issues, pull requests, or questions regarding these terms, visit the repository on GitHub:
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
              <a href="/privacy-policy" onClick={(e) => handleLink(e, '/privacy-policy')} className="text-zinc-400 hover:text-zinc-200 hover:underline">Privacy Policy</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
