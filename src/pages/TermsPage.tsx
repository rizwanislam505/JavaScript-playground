import React, { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const termsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service – JS Playground",
    "url": "https://jsplayground.js.org/terms-of-service",
    "description": "JS Playground Terms of Service. Review user code ownership, platform disclaimers, and acceptable use guidelines."
  };

  return (
    <div className="min-h-screen w-full bg-[#080a0f] text-zinc-300 font-sans selection:bg-yellow-500/30 selection:text-white overflow-y-auto">
      <SEOHead
        title="Terms of Service – JS Playground"
        description="JS Playground Terms of Service. Review user code ownership, platform disclaimers, and acceptable use guidelines."
        keywords="JS Playground terms of service, JavaScript playground terms, code ownership terms, open source playground legal guidelines"
        canonicalPath="/terms-of-service"
        jsonLd={termsJsonLd}
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
          <span className="text-zinc-200 font-semibold">Terms of Service</span>
        </nav>

        {/* Content Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <header className="space-y-3 border-b border-zinc-800/50 pb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Last Updated: November 2026
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using JS Playground (hosted at <strong>jsplayground.js.org</strong>), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
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
              For developer issues, pull requests, legal inquiries, or questions regarding these terms, visit our official GitHub repository or contact us directly via email:
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
