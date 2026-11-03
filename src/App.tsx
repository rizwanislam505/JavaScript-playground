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
import { safeStorageGet, safeStorageSet } from './utils/storage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  // Playground mode: 'js' | 'ts' | 'web'
  const [mode, setMode] = useState<PlaygroundMode>('js');

  // Raw code state for JavaScript
  const [jsCode, setJsCode] = useState<string>(() => {
    return safeStorageGet('js_playground_raw_code') ?? JS_DEFAULT_CODE;
  });

  // Raw code state for TypeScript
  const [tsCode, setTsCode] = useState<string>(() => {
    return safeStorageGet('ts_playground_raw_code') ?? '';
  });

  const [webProject, setWebProject] = useState<WebProjectState>(() => {
    const saved = safeStorageGet('web_playground_raw_project');
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
  const [tsLogs, setTsLogs] = useState<ConsoleLogEntry[]>([]);
  const [webLogs, setWebLogs] = useState<ConsoleLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [webRunTrigger, setWebRunTrigger] = useState(0);

  // Split Ratio
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const isDraggingRef = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // URL Routing: / , /typescript-playground , /about , /privacy-policy , /terms-of-service
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const path = (window.location.pathname || '').toLowerCase();
        const hash = (window.location.hash || '').toLowerCase();
        if (path.includes('typescript') || hash.includes('typescript')) return '/typescript-playground';
        if (path.includes('about') || hash.includes('about')) return '/about';
        if (path.includes('privacy') || hash.includes('privacy')) return '/privacy-policy';
        if (path.includes('terms') || hash.includes('terms')) return '/terms-of-service';
      }
    } catch (e) {}
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      try {
        if (typeof window === 'undefined' || !window.location) return;
        const path = (window.location.pathname || '').toLowerCase();
        const hash = (window.location.hash || '').toLowerCase();

        if (path.includes('typescript') || hash.includes('typescript')) {
          setCurrentRoute('/typescript-playground');
          setMode('ts');
        } else if (path.includes('about') || hash.includes('about')) {
          setCurrentRoute('/about');
        } else if (path.includes('privacy') || hash.includes('privacy')) {
          setCurrentRoute('/privacy-policy');
        } else if (path.includes('terms') || hash.includes('terms')) {
          setCurrentRoute('/terms-of-service');
        } else {
          setCurrentRoute('/');
        }
      } catch (e) {}
    };

    handleLocationChange();

    try {
      window.addEventListener('popstate', handleLocationChange);
      window.addEventListener('hashchange', handleLocationChange);
      return () => {
        window.removeEventListener('popstate', handleLocationChange);
        window.removeEventListener('hashchange', handleLocationChange);
      };
    } catch (e) {}
  }, []);

  // Sync document.title and meta description based on route & mode
  useEffect(() => {
    try {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }

      if (currentRoute === '/typescript-playground' || mode === 'ts') {
        document.title = 'TypeScript Playground – Online TypeScript Compiler';
        metaDesc.setAttribute('content', 'Run TypeScript online in your browser. Free online TypeScript compiler with real-time DevTools console, top-level await, and file drag-and-drop.');
      } else if (currentRoute === '/about') {
        document.title = 'About JS Playground – Free Online Code Editor';
        metaDesc.setAttribute('content', 'Learn about JS Playground, a zero-latency, privacy-first online JavaScript and TypeScript editor running 100% in your browser.');
      } else if (currentRoute === '/privacy-policy') {
        document.title = 'Privacy Policy – JS Playground';
        metaDesc.setAttribute('content', 'JS Playground Privacy Policy. Learn about our 100% client-side execution, zero code tracking, and local storage safety.');
      } else if (currentRoute === '/terms-of-service') {
        document.title = 'Terms of Service – JS Playground';
        metaDesc.setAttribute('content', 'JS Playground Terms of Service. Review user code ownership, platform disclaimers, and acceptable use guidelines.');
      } else {
        document.title = 'JS Playground – Online JavaScript & TypeScript Editor';
        metaDesc.setAttribute('content', 'Free online JavaScript & TypeScript playground. Run code instantly in your browser with a DevTools console, top-level await, and zero setup.');
      }
    } catch (e) {}
  }, [currentRoute, mode]);

  const navigate = (path: string) => {
    try {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', path);
      }
    } catch (e) {}
    setCurrentRoute(path);
    if (path.includes('typescript')) {
      setMode('ts');
    }
  };

  const handleModeChange = (newMode: PlaygroundMode) => {
    setMode(newMode);
    try {
      if (typeof window !== 'undefined' && window.history) {
        if (newMode === 'ts') {
          window.history.pushState({}, '', '/typescript-playground');
          setCurrentRoute('/typescript-playground');
        } else if (newMode === 'js') {
          window.history.pushState({}, '', '/');
          setCurrentRoute('/');
        } else if (newMode === 'web') {
          setActiveRightTab('output');
          window.history.pushState({}, '', '/');
          setCurrentRoute('/');
        }
      }
    } catch (e) {
      setCurrentRoute(newMode === 'ts' ? '/typescript-playground' : '/');
    }
  };

  // Persist code changes safely with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      safeStorageSet('js_playground_raw_code', jsCode);
    }, 400);
    return () => clearTimeout(handler);
  }, [jsCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      safeStorageSet('ts_playground_raw_code', tsCode);
    }, 400);
    return () => clearTimeout(handler);
  }, [tsCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      safeStorageSet('web_playground_raw_project', JSON.stringify(webProject));
    }, 400);
    return () => clearTimeout(handler);
  }, [webProject]);

  // Run JavaScript
  const handleRunJs = useCallback(async () => {
    if (!jsCode.trim()) return;
    setIsRunning(true);
    setJsLogs([]);
    try {
      await executeJavaScript(
        jsCode, 
        (entry) => setJsLogs((prev) => [...prev, entry]),
        () => setJsLogs([])
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

  // Run TypeScript
  const handleRunTs = useCallback(async () => {
    if (!tsCode.trim()) return;
    setIsRunning(true);
    setTsLogs([]);
    try {
      await executeJavaScript(
        tsCode, 
        (entry) => setTsLogs((prev) => [...prev, entry]),
        () => setTsLogs([])
      );
    } catch (err: any) {
      setTsLogs((prev) => [
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
  }, [tsCode]);

  // Run Web
  const handleRunWeb = useCallback(() => {
    setWebLogs([]);
    setWebRunTrigger((prev) => prev + 1);
  }, []);

  // Universal run handler
  const handleRun = useCallback(() => {
    if (mode === 'js') {
      handleRunJs();
    } else if (mode === 'ts') {
      handleRunTs();
    } else {
      handleRunWeb();
    }
  }, [mode, handleRunJs, handleRunTs, handleRunWeb]);

  // Clear Left Editor Card
  const handleClearEditor = () => {
    if (mode === 'js') {
      setJsCode('');
    } else if (mode === 'ts') {
      setTsCode('');
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
    } else if (mode === 'ts') {
      setTsLogs([]);
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
        (entry) => setJsLogs(prev => [...prev, entry]),
        () => setJsLogs([])
      );
    } else if (mode === 'ts') {
      setTsLogs(prev => [...prev, userPromptEntry]);
      await executeJavaScript(
        trimmed,
        (entry) => setTsLogs(prev => [...prev, entry]),
        () => setTsLogs([])
      );
    } else {
      setWebLogs(prev => [...prev, userPromptEntry]);
      await executeJavaScript(
        trimmed,
        (entry) => setWebLogs(prev => [...prev, entry]),
        () => setWebLogs([])
      );
    }
  };

  // Track reactive mobile state
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

  // Split divider drag handler
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
        const offset = clientY - rect.top;
        percentage = (offset / rect.height) * 100;
      } else {
        const offset = clientX - rect.left;
        percentage = (offset / rect.width) * 100;
      }
      
      if (percentage < 20) percentage = 20;
      if (percentage > 80) percentage = 80;
      setSplitRatio(percentage);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isMobile]);

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
    ? 'Paste your HTML or drop a file'
    : activeWebTab === 'css'
    ? 'Paste your CSS or drop a file'
    : 'Paste your JavaScript or drop a file';

  if (currentRoute === '/about') {
    return <AboutPage onNavigate={navigate} />;
  }

  if (currentRoute === '/privacy-policy' || currentRoute === '/privacy') {
    return <PrivacyPage onNavigate={navigate} />;
  }

  if (currentRoute === '/terms-of-service' || currentRoute === '/terms') {
    return <TermsPage onNavigate={navigate} />;
  }

  return (
    <div 
      className={`h-full w-full flex-1 flex flex-col overflow-hidden font-sans select-none ${
        theme === 'dark' ? 'bg-[#080a0f] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
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
              placeholder="Paste your JavaScript or drop a file"
              isRunning={isRunning}
            />
          ) : mode === 'ts' ? (
            <CodeEditor
              value={tsCode}
              onChange={setTsCode}
              language="javascript"
              onRun={handleRun}
              onClear={handleClearEditor}
              mode="ts"
              placeholder="Paste your TypeScript or drop a file"
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

        {/* Resizer Handle */}
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

        {/* Bottom (Mobile) / Right (Desktop) Card: Console / Output */}
        <div 
          className="flex flex-col overflow-hidden flex-1 transition-none shrink-0"
          style={
            isMobile 
              ? { height: `${100 - splitRatio}%`, width: '100%' }
              : { width: `${100 - splitRatio}%`, height: '100%' }
          }
        >
          {mode === 'js' || mode === 'ts' ? (
            <ConsoleView
              logs={mode === 'js' ? jsLogs : tsLogs}
              onClear={handleClearConsole}
              onExecuteRepl={handleExecuteRepl}
              mode={mode}
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

      {/* Developer Affiliate Sponsor Banner */}
      <SponsorBanner theme={theme} />

      {/* Semantic Content for Crawlers, Bots & Search Engines */}
      <article className="sr-only" aria-label="JS Playground and TypeScript Playground Documentation, Features, Guide, Keywords and FAQ">
        <header>
          <h1>JS Playground &amp; TypeScript Playground – Free Online JavaScript &amp; TypeScript Compiler</h1>
          <p>
            Welcome to JS Playground (jsplayground.js.org) and TypeScript Playground (jsplayground.js.org/typescript-playground).
            Designed for engineers, front-end developers, learners, and competitive programmers,
            this playground delivers zero-latency client-side JavaScript and TypeScript execution, an interactive
            DevTools-grade console, top-level await support, and full HTML5/CSS3/JavaScript dual-mode web sandbox.
          </p>
        </header>

        <section aria-labelledby="ts-section">
          <h2>TypeScript Playground Online</h2>
          <p>
            Run TypeScript code online without installation. Test TypeScript interfaces, type annotations, generics, enums, and functions with real-time console output.
          </p>
        </section>

        <nav aria-label="Legal and Documentation Pages">
          <h2>Important Links</h2>
          <ul>
            <li><a href="/typescript-playground" onClick={(e) => { e.preventDefault(); navigate('/typescript-playground'); }}>TypeScript Playground</a></li>
            <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a></li>
            <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}>Privacy Policy</a></li>
            <li><a href="/terms-of-service" onClick={(e) => { e.preventDefault(); navigate('/terms-of-service'); }}>Terms of Service</a></li>
          </ul>
        </nav>
      </article>
    </div>
  );
}
