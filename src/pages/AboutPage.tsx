import React, { useEffect } from 'react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'About JS Playground – Free Online JavaScript & TypeScript Editor (jsplayground.js.org)';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Learn about JS Playground (jsplayground.js.org), a free, zero-latency online JavaScript and TypeScript editor, instant REPL, and web component sandbox.');
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
            <span className="text-white font-semibold">About</span>
            <span className="text-zinc-700">|</span>
            <a
              href="/privacy-policy"
              onClick={(e) => handleLink(e, '/privacy-policy')}
              className="text-zinc-400 hover:text-white transition-colors hover:underline"
            >
              Privacy Policy
            </a>
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
              About JS Playground &amp; TypeScript Playground
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Domain: jsplayground.js.org &bull; Platform: Client-Side Web Standards (V8 / SpiderMonkey)
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">
              1. Platform Overview
            </h2>
            <p>
              JS Playground (hosted live at <strong>jsplayground.js.org</strong>) is a free, high-performance web-based JavaScript and TypeScript editor, instant REPL, and web component prototyping sandbox. Engineered specifically for software engineers, frontend developers, learners, educators, and competitive programmers, it provides a zero-latency coding environment with total data privacy.
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
                <h3 className="font-bold text-white text-base">JS Playground Mode</h3>
                <p className="text-zinc-400">
                  Designed for testing pure JavaScript algorithms, data structures, utilities, regular expressions, and modern ECMAScript logic. Features a DevTools-grade interactive console with collapsible object inspection trees.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#10141f] border border-zinc-800/80 space-y-2">
                <h3 className="font-bold text-white text-base">TypeScript Playground</h3>
                <p className="text-zinc-400">
                  Run TypeScript online instantly. Test interfaces, type annotations, generics, enums, and modern TS syntax directly in your browser with zero build setup or server compilation delays.
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
              <a href="/typescript-playground" onClick={(e) => handleLink(e, '/typescript-playground')} className="text-zinc-400 hover:text-zinc-200 hover:underline">TypeScript Playground</a>
              <a href="/privacy-policy" onClick={(e) => handleLink(e, '/privacy-policy')} className="text-zinc-400 hover:text-zinc-200 hover:underline">Privacy Policy</a>
              <a href="/terms-of-service" onClick={(e) => handleLink(e, '/terms-of-service')} className="text-zinc-400 hover:text-zinc-200 hover:underline">Terms of Service</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
