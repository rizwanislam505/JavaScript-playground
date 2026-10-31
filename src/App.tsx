import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PlaygroundMode, 
  ActiveWebEditorTab, 
  ActiveRightTab, 
  ConsoleLogEntry, 
  WebProjectState 
} from './types';
import { JS_DEFAULT_CODE, WEB_DEFAULT_PROJECT } from './templates';
import { Header } from './components/Header';
import { SponsorBanner } from './components/SponsorBanner';
import { CodeEditor } from './components/CodeEditor';
import { ConsoleView } from './components/ConsoleView';
import { WebPreview } from './components/WebPreview';
import { executeJavaScript } from './utils/codeRunner';

export default function App() {
  // Playground mode: 'js' or 'web'
  const [mode, setMode] = useState<PlaygroundMode>('js');

  // Raw code state with no template
  const [jsCode, setJsCode] = useState<string>(() => {
    return localStorage.getItem('js_playground_raw_code') ?? JS_DEFAULT_CODE;
  });

  const [webProject, setWebProject] = useState<WebProjectState>(() => {
    const saved = localStorage.getItem('web_playground_raw_project');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return WEB_DEFAULT_PROJECT;
  });

  // Active tabs
  const [activeWebTab, setActiveWebTab] = useState<ActiveWebEditorTab>('html');
  const [activeRightTab, setActiveRightTab] = useState<ActiveRightTab>('output');

  // Console log state
  const [jsLogs, setJsLogs] = useState<ConsoleLogEntry[]>([]);
  const [webLogs, setWebLogs] = useState<ConsoleLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [webRunTrigger, setWebRunTrigger] = useState(0);

  // Split Ratio
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const isDraggingRef = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Persist code changes
  useEffect(() => {
    localStorage.setItem('js_playground_raw_code', jsCode);
  }, [jsCode]);

  useEffect(() => {
    localStorage.setItem('web_playground_raw_project', JSON.stringify(webProject));
  }, [webProject]);

  // Run JavaScript
  const handleRunJs = useCallback(async () => {
    if (!jsCode.trim()) {
      return;
    }

    setIsRunning(true);
    setJsLogs([]);
    try {
      await executeJavaScript(
        jsCode, 
        (entry) => {
          setJsLogs((prev) => [...prev, entry]);
        },
        () => {
          setJsLogs([]);
        }
      );
    } catch (err: any) {
      setJsLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          type: 'error',
          items: [err.message || 'Execution error'],
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [jsCode]);

  // Run Web
  const handleRunWeb = useCallback(() => {
    setWebLogs([]);
    setWebRunTrigger((prev) => prev + 1);
  }, []);

  // Universal run handler
  const handleRun = useCallback(() => {
    if (mode === 'js') {
      handleRunJs();
    } else {
      handleRunWeb();
    }
  }, [mode, handleRunJs, handleRunWeb]);

  // Clear Left Editor Card
  const handleClearEditor = () => {
    if (mode === 'js') {
      setJsCode('');
    } else {
      setWebProject(prev => ({
        ...prev,
        [activeWebTab]: ''
      }));
    }
  };

  // Clear Right Console Card
  const handleClearConsole = () => {
    if (mode === 'js') {
      setJsLogs([]);
    } else {
      setWebLogs([]);
    }
  };

  // REPL evaluator
  const handleExecuteRepl = async (expression: string) => {
    const trimmed = expression.trim();
    if (!trimmed) return;

    const userPromptEntry: ConsoleLogEntry = {
      id: Math.random().toString(36),
      type: 'command',
      items: [trimmed],
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    if (mode === 'js') {
      setJsLogs(prev => [...prev, userPromptEntry]);
      await executeJavaScript(
        trimmed,
        (entry) => {
          setJsLogs(prev => [...prev, entry]);
        },
        () => {
          setJsLogs([]);
        }
      );
    } else {
      setWebLogs(prev => [...prev, userPromptEntry]);
      await executeJavaScript(
        trimmed,
        (entry) => {
          setWebLogs(prev => [...prev, entry]);
        },
        () => {
          setWebLogs([]);
        }
      );
    }
  };

  // Track reactive mobile state for responsive layout
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Split divider drag handler (Mouse & Touch for Desktop & Mobile)
  const handleStartDrag = useCallback(() => {
    isDraggingRef.current = true;
    document.body.style.cursor = isMobile ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, [isMobile]);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      
      let percentage = 50;
      if (isMobile) {
        // Vertical split on mobile
        const offset = clientY - rect.top;
        percentage = (offset / rect.height) * 100;
      } else {
        // Horizontal split on desktop
        const offset = clientX - rect.left;
        percentage = (offset / rect.width) * 100;
      }

      // Clamped strictly between 20% and 80% (Limited bounds so panes never collapse)
      const clamped = Math.min(Math.max(percentage, 20), 80);
      setSplitRatio(clamped);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEndDrag = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEndDrag);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEndDrag);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [isMobile]);

  // Web mode active code helper
  const currentWebCode = activeWebTab === 'html'
    ? webProject.html
    : activeWebTab === 'css'
    ? webProject.css
    : webProject.js;

  const handleWebCodeChange = (newCode: string) => {
    setWebProject(prev => ({
      ...prev,
      [activeWebTab]: newCode
    }));
  };

  const currentWebLanguage = activeWebTab === 'html'
    ? 'html'
    : activeWebTab === 'css'
    ? 'css'
    : 'javascript';

  const webPlaceholder = activeWebTab === 'html'
    ? 'Paste your HTML or upload a file...'
    : activeWebTab === 'css'
    ? 'Paste your CSS or upload a file...'
    : 'Paste your JavaScript or upload a file...';

  return (
    <div 
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none ${
        theme === 'dark' ? 'bg-[#080a0f] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <Header
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          if (newMode === 'web') setActiveRightTab('output');
        }}
        isFullscreen={false}
        onToggleFullscreen={() => {}}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Playground Workspace: Vertical split on mobile; Resizable horizontal split on desktop */}
      <main 
        ref={splitContainerRef}
        className="flex-1 w-full p-2 sm:p-3 md:p-4 flex flex-col md:flex-row gap-1 sm:gap-2 md:gap-3 overflow-hidden relative select-none"
      >
        {/* Top (Mobile) / Left (Desktop) Card: Code Editor */}
        <div 
          className="flex flex-col overflow-hidden transition-none shrink-0"
          style={
            isMobile 
              ? { height: `${splitRatio}%`, width: '100%' }
              : { width: `${splitRatio}%`, height: '100%' }
          }
        >
          {mode === 'js' ? (
            <CodeEditor
              value={jsCode}
              onChange={setJsCode}
              language="javascript"
              onRun={handleRun}
              onClear={handleClearEditor}
              mode="js"
              placeholder="Paste your JavaScript or upload a file..."
              isRunning={isRunning}
            />
          ) : (
            <CodeEditor
              value={currentWebCode}
              onChange={handleWebCodeChange}
              language={currentWebLanguage}
              onRun={handleRun}
              onClear={handleClearEditor}
              mode="web"
              activeWebTab={activeWebTab}
              onSelectWebTab={setActiveWebTab}
              placeholder={webPlaceholder}
              isRunning={isRunning}
            />
          )}
        </div>

        {/* Resizer Handle: Touch & Mouse Draggable on Mobile & Desktop */}
        {isMobile ? (
          <div
            onMouseDown={handleStartDrag}
            onTouchStart={handleStartDrag}
            className="w-full h-3 py-1 flex items-center justify-center cursor-row-resize z-20 shrink-0 touch-none group"
            title="Drag vertically to resize editor and console"
          >
            <div className="h-1 w-12 bg-zinc-700/80 group-hover:bg-[#ff5722] rounded-full transition-colors shadow-sm" />
          </div>
        ) : (
          <div
            onMouseDown={handleStartDrag}
            className="w-2 hover:w-2.5 bg-transparent hover:bg-zinc-600/50 cursor-col-resize transition-all z-20 shrink-0 self-stretch rounded-full"
            title="Drag horizontally to resize editor and console"
          />
        )}

        {/* Bottom (Mobile) / Right (Desktop) Card: Terminal / Console / Output */}
        <div 
          className="flex flex-col overflow-hidden flex-1 transition-none shrink-0"
          style={
            isMobile 
              ? { height: `${100 - splitRatio}%`, width: '100%' }
              : { width: `${100 - splitRatio}%`, height: '100%' }
          }
        >
          {mode === 'js' ? (
            <ConsoleView
              logs={jsLogs}
              onClear={handleClearConsole}
              onExecuteRepl={handleExecuteRepl}
              mode="js"
            />
          ) : (
            <div className="h-full w-full relative flex flex-col">
              <div 
                className={`h-full w-full ${activeRightTab === 'output' ? 'flex flex-col' : 'hidden'}`}
              >
                <WebPreview
                  project={webProject}
                  onConsoleMessage={(entry) => setWebLogs(prev => [...prev, entry])}
                  runTrigger={webRunTrigger}
                  activeRightTab={activeRightTab}
                  onSelectRightTab={setActiveRightTab}
                />
              </div>
              <div 
                className={`h-full w-full ${activeRightTab === 'console' ? 'flex flex-col' : 'hidden'}`}
              >
                <ConsoleView
                  logs={webLogs}
                  onClear={handleClearConsole}
                  onExecuteRepl={handleExecuteRepl}
                  mode="web"
                  activeRightTab={activeRightTab}
                  onSelectRightTab={setActiveRightTab}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Developer Affiliate Sponsor Banner - Controlled via src/config/sponsorConfig.ts */}
      <SponsorBanner theme={theme} />

      {/* Semantic Content for Crawlers, Bots & Search Engines (Accessible in code, invisible to user) */}
      {/* Semantic Content for Crawlers, Bots & Search Engines (Accessible in code, invisible to user) */}
      <article className="sr-only" aria-label="JS Playground and JavaScript Playground Documentation, Features, Guide, Keywords and FAQ">
        <header>
          <h1>JS Playground &amp; JavaScript Playground – Free Online JavaScript Compiler, REPL &amp; Web Sandbox</h1>
          <p>
            Welcome to the ultimate JS playground and JavaScript playground (available at playground.js.org).
            Designed for engineers, front-end developers, learners, and competitive programmers,
            this JS playground delivers zero-latency client-side JavaScript execution, an interactive
            DevTools-grade console, top-level await support, native fetch API capabilities, and a full
            HTML5/CSS3/JavaScript dual-mode web sandbox. Test algorithms, prototype ideas, evaluate modern
            ECMAScript syntax in our JavaScript playground with 100% privacy and zero server overhead.
          </p>
        </header>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading">Key Features of JS Playground &amp; JavaScript Playground</h2>
          <ul>
            <li>
              <strong>Instant JS Playground In-Browser Execution:</strong> Run code in your browser runtime with no build step, no Node.js installation, and zero latency.
            </li>
            <li>
              <strong>Real-Time DevTools Console &amp; Object Inspector:</strong> Interactive console with nested object exploration, array length badges, console.table() visualizer, warning highlights, and stack traces.
            </li>
            <li>
              <strong>Automatic Trailing Expression Evaluation:</strong> No need to type console.log(); expressions at the end of your code automatically display return values with a distinct indicator in this JavaScript playground.
            </li>
            <li>
              <strong>Modern ECMAScript &amp; Top-Level Await:</strong> First-class support for ES2020 through modern standards, async/await at root level, Promises, and native browser APIs like fetch() and setTimeout().
            </li>
            <li>
              <strong>Built-In Interactive REPL Command Line:</strong> Execute one-off statements directly inside the JS playground console prompt with up and down arrow command history navigation.
            </li>
            <li>
              <strong>Full Web Sandbox Mode (HTML5, CSS3, JavaScript):</strong> Toggle seamlessly between pure JS playground mode and full-stack web component prototyping with live preview iframe and unified console logging.
            </li>
            <li>
              <strong>File Upload &amp; Format Beautifier:</strong> Upload .js, .ts, .json, and .html files directly with one-click code formatting and syntax highlighting.
            </li>
            <li>
              <strong>100% Client-Side Privacy:</strong> Code is processed entirely in your browser memory. No data is stored, tracked, or sent to external servers.
            </li>
          </ul>
        </section>

        <section aria-labelledby="guide-heading">
          <h2 id="guide-heading">JS Playground Developer Guide &amp; JavaScript Cheat Sheet</h2>
          <div>
            <h3>1. Automatic Return Values vs. console.log</h3>
            <p>
              Just like Chrome DevTools Console and Node.js REPL, any trailing expression in your code automatically outputs its evaluation result in the console. For example, ending your script with <code>[1, 2, 3].map(n =&gt; n * 2)</code> or <code>Math.max(10, 25, 5)</code> displays the result immediately in this JavaScript playground without needing <code>console.log()</code>.
            </p>
          </div>
          <div>
            <h3>2. Top-Level Asynchronous Code &amp; fetch API</h3>
            <p>
              Use <code>const data = await fetch('https://api.example.com/data').then(res =&gt; res.json());</code> directly in the JS playground editor. Top-level await is enabled by default without needing an Immediately Invoked Async Function Expression (IIFE).
            </p>
          </div>
          <div>
            <h3>3. Exploring Complex Objects and Tables</h3>
            <p>
              Log complex objects with <code>{"console.log({ user: 'Alex', stats: [10, 20, 30] })"}</code> to inspect interactive collapsible trees. Use <code>{"console.table(arrayOfObjects)"}</code> to render clean tabular data.
            </p>
          </div>
          <div>
            <h3>4. Essential Keyboard Shortcuts</h3>
            <p>
              Execute code: <strong>Ctrl + Enter</strong> (Windows/Linux) or <strong>Cmd + Enter</strong> (macOS).<br />
              Smart indentation: <strong>Tab</strong> to indent 2 spaces, <strong>Shift + Tab</strong> to unindent.<br />
              Auto-closing: Brackets, parentheses, and quotes automatically close when typed.
            </p>
          </div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently Asked Questions (FAQ) – JS Playground &amp; JavaScript Playground</h2>
          <dl>
            <dt>What is the JS playground and JavaScript playground?</dt>
            <dd>
              JavaScript Playground (also known as JS playground, hosted at playground.js.org) is a free, instant online JavaScript compiler, REPL, and web coding sandbox. It enables developers, learners, and engineers to write, run, test, and debug JavaScript snippets directly in their browser without installing Node.js or configuring build tools.
            </dd>

            <dt>How does this online JavaScript playground compare to JSFiddle or CodePen?</dt>
            <dd>
              Unlike traditional web sandboxes that focus primarily on full websites, this JS playground offers both dedicated pure JavaScript execution (ideal for testing algorithms, data structures, and utilities) and a full Web mode (HTML/CSS/JS), combined with a dedicated DevTools-grade interactive console.
            </dd>

            <dt>Is code sent to a remote server for execution?</dt>
            <dd>
              No. 100% of the code execution in this JS playground occurs locally within your browser using your machine's JavaScript engine (V8, SpiderMonkey, or JavaScriptCore). This provides instant execution with zero latency and guarantees complete code privacy.
            </dd>

            <dt>Can I test asynchronous code and make network requests?</dt>
            <dd>
              Yes. In our JavaScript playground, you can use top-level await, native fetch(), Promises, async/await, setTimeout, and setInterval. You can fetch data from any public CORS-enabled REST or GraphQL API directly.
            </dd>

            <dt>Do I need to type console.log() to see expression results?</dt>
            <dd>
              No. Trailing expressions (such as math calculations, function calls, or object literals) automatically print their evaluated return value in the JS playground console with a return arrow indicator (&lt;-).
            </dd>

            <dt>How does Web mode work in the JavaScript playground?</dt>
            <dd>
              Web mode provides separate tabs for HTML, CSS, and JavaScript. An isolated, secure iframe executes your code with live preview, while all logs, errors, and warnings from your scripts are forwarded directly into the unified Console.
            </dd>

            <dt>Does the playground support TypeScript or JSON?</dt>
            <dd>
              You can upload and edit .ts, .js, and .json files. Code formatting automatically beautifies and validates JSON syntax with one click.
            </dd>

            <dt>Is this JS playground completely free?</dt>
            <dd>
              Yes, our JS playground and JavaScript playground is completely free with no registration, no subscription, and no usage limits.
            </dd>
          </dl>
        </section>

        <section aria-labelledby="keywords-index">
          <h2 id="keywords-index">Primary Keywords &amp; Related Topics</h2>
          <p>
            JavaScript playground, JS playground, online JavaScript editor, run JavaScript online, JavaScript compiler online, js playground online, javascript playground online, online javascript compiler, run js online, javascript editor online, run js code online, online javascript runner, test javascript online, javascript sandbox online, js repl, html css js sandbox, JSFiddle alternative, CodePen alternative, test JavaScript snippet, real-time DevTools console, top-level await tester, client-side JavaScript runner, web development sandbox, free online code runner.
          </p>
        </section>
      </article>
    </div>
  );
}
