import React, { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About JS Playground",
    "url": "https://jsplayground.js.org/about",
    "description": "JS Playground is a zero-latency, privacy-first online JavaScript and TypeScript editor running 100% in your browser."
  };

  return (
    <div className="min-h-screen w-full bg-[#080a0f] text-zinc-300 font-sans selection:bg-yellow-500/30 selection:text-white overflow-y-auto">
      <SEOHead
        title="About JS Playground – Free Online Code Editor"
        description="Learn about JS Playground, a zero-latency, privacy-first online JavaScript, TypeScript, Node.js, and Next.js editor running 100% in your browser."
        keywords="About JS Playground, JavaScript playground features, TypeScript playground online, Node.js playground, Next.js sandbox, online code editor, browser JS runner"
        canonicalPath="/about"
        jsonLd={aboutJsonLd}
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
          <span className="text-zinc-200 font-semibold">About</span>
        </nav>

        {/* Content Body */}
        <main className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <header className="space-y-3 border-b border-zinc-800/50 pb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              About JS Playground
            </h1>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              1. Platform Overview
            </h2>
            <p>
              JS Playground (hosted live at <strong>jsplayground.js.org</strong>) is a free, high-performance web-based JavaScript editor, instant REPL, and web component prototyping sandbox. Engineered specifically for software engineers, frontend developers, learners, educators, and competitive programmers, it provides a zero-latency coding environment with total data privacy.
            </p>
            <p>
              Unlike conventional online sandboxes that require server-side spin-ups or cloud containers, JS Playground executes code natively inside your local browser tab. This delivers true zero-latency performance while guaranteeing that your source code is never sent to, processed by, or stored on external servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              2. Core Modes &amp; Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#10141f] border border-zinc-800/80 space-y-2">
                <h3 className="font-bold text-white text-base">Node.js Playground</h3>
                <p className="text-zinc-400">
                  Run Node.js runtime code in your browser. Perfect for testing Node.js standard APIs, file system utilities, and server-side logic in a lightweight, interactive REPL.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#10141f] border border-zinc-800/80 space-y-2">
                <h3 className="font-bold text-white text-base">Next.js Playground</h3>
                <p className="text-zinc-400">
                  Experience Next.js component development instantly. Prototype React components, server actions, and App Router layouts within a high-performance, sandboxed environment.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#10141f] border border-zinc-800/80 space-y-2">
                <h3 className="font-bold text-white text-base">Web Component Sandbox</h3>
                <p className="text-zinc-400">
                  Provides dedicated tabs for HTML5, CSS3, and JavaScript alongside a real-time sandboxed live preview iframe. All script logs and unhandled errors are automatically captured in the console.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              3. Key Features &amp; Technical Highlights
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>
                <strong>Instant In-Browser Execution:</strong> Code runs immediately using asynchronous function scopes inside your browser engine (V8, SpiderMonkey, or JavaScriptCore) without server containers.
              </li>
              <li>
                <strong>Automatic Trailing Return Values (&lt;-):</strong> Trailing expressions (e.g. <code>[1, 2, 3].map(x =&gt; x * 2)</code>) automatically evaluate and output their return value in the console without needing <code>console.log()</code>.
              </li>
              <li>
                <strong>Native Top-Level Await:</strong> Use <code>await fetch('https://api.example.com')</code> directly at the root level without wrapping your code inside async IIFE blocks.
              </li>
              <li>
                <strong>Interactive Command-Line REPL:</strong> Execute statements on the fly using the interactive command prompt (<code>&gt;</code>) with arrow key command history navigation.
              </li>
              <li>
                <strong>File Drag &amp; Drop:</strong> Seamlessly drop local <code>.js</code>, <code>.ts</code>, <code>.json</code>, <code>.html</code>, or <code>.css</code> files directly onto the editor pane to load code instantly.
              </li>
              <li>
                <strong>Line &amp; Character Counter:</strong> Real-time indicator displaying active cursor line position, total lines, and total character counts.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              4. Open Source &amp; Repository
            </h2>
            <p>
              JS Playground is open for public inspection and developer feedback. You can access the official source repository, inspect release logs, or star the project on GitHub:
            </p>
            <p className="font-mono text-xs sm:text-sm text-yellow-400">
              <a
                href="https://github.com/rizwanislam505/JavaScript-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-yellow-400"
              >
                github.com/rizwanislam505/JavaScript-playground
              </a>
            </p>
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
