import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PlaygroundMode, 
  ActiveWebEditorTab, 
  ActiveRightTab, 
  ConsoleLogEntry, 
  WebProjectState 
} from './types';
import { 
  JS_DEFAULT_CODE, 
  TS_DEFAULT_CODE, 
  NODE_DEFAULT_CODE, 
  NEXT_DEFAULT_CODE, 
  WEB_DEFAULT_PROJECT 
} from './templates';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SponsorBanner } from './components/SponsorBanner';
import { CodeEditor } from './components/CodeEditor';
import { ConsoleView } from './components/ConsoleView';
import { WebPreview } from './components/WebPreview';
import { executeJavaScript } from './utils/codeRunner';
import { safeStorageGet, safeStorageSet } from './utils/storage';
import { generateShareUrl, decodeCodeFromHash } from './utils/shareUrl';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SEOHead } from './components/SEOHead';

export default function App() {
  // Navigation Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Playground mode: 'js' | 'ts' | 'node' | 'next' | 'web'
  const [mode, setMode] = useState<PlaygroundMode>('js');

  // Code state per environment
  const [jsCode, setJsCode] = useState<string>(() => {
    return safeStorageGet('js_playground_raw_code') ?? JS_DEFAULT_CODE;
  });

  const [tsCode, setTsCode] = useState<string>(() => {
    return safeStorageGet('ts_playground_raw_code') ?? TS_DEFAULT_CODE;
  });

  const [nodeCode, setNodeCode] = useState<string>(() => {
    return safeStorageGet('node_playground_raw_code') ?? NODE_DEFAULT_CODE;
  });

  const [nextCode, setNextCode] = useState<string>(() => {
    return safeStorageGet('next_playground_raw_code') ?? NEXT_DEFAULT_CODE;
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
  const [nodeLogs, setNodeLogs] = useState<ConsoleLogEntry[]>([]);
  const [nextLogs, setNextLogs] = useState<ConsoleLogEntry[]>([]);
  const [webLogs, setWebLogs] = useState<ConsoleLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [webRunTrigger, setWebRunTrigger] = useState(0);

  // Split Ratio
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const isDraggingRef = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Theme & Share state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'too_large'>('idle');

  // Decompress shared snippet from URL hash on load
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location.hash) {
        const decompressed = decodeCodeFromHash(window.location.hash);
        if (decompressed) {
          const path = window.location.pathname.toLowerCase();
          if (path.includes('typescript')) {
            setTsCode(decompressed);
          } else if (path.includes('nodejs')) {
            setNodeCode(decompressed);
          } else if (path.includes('nextjs')) {
            setNextCode(decompressed);
          } else {
            setJsCode(decompressed);
          }
        }
      }
    } catch (e) {}
  }, []);

  // Handle Share Code Action with URL length safety check
  const handleShareCode = useCallback(() => {
    try {
      const activeCode = mode === 'js'
        ? jsCode
        : mode === 'ts'
        ? tsCode
        : mode === 'node'
        ? nodeCode
        : mode === 'next'
        ? nextCode
        : JSON.stringify(webProject);

      const result = generateShareUrl(activeCode, mode);

      if (result.isTooLarge) {
        setShareState('too_large');
        setTimeout(() => setShareState('idle'), 3000);
        return;
      }

      if (result.success && result.url) {
        navigator.clipboard.writeText(result.url);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch (e) {}
  }, [mode, jsCode, tsCode, nodeCode, nextCode, webProject]);

  // URL Routing: / , /typescript-playground , /nodejs-playground , /nextjs-playground , /about , /privacy-policy , /terms-of-service
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const path = (window.location.pathname || '').toLowerCase();
        const hash = (window.location.hash || '').toLowerCase();
        if (path.includes('typescript') || hash.includes('typescript')) return '/typescript-playground';
        if (path.includes('nodejs') || hash.includes('nodejs')) return '/nodejs-playground';
        if (path.includes('nextjs') || hash.includes('nextjs')) return '/nextjs-playground';
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
        } else if (path.includes('nodejs') || hash.includes('nodejs')) {
          setCurrentRoute('/nodejs-playground');
          setMode('node');
        } else if (path.includes('nextjs') || hash.includes('nextjs')) {
          setCurrentRoute('/nextjs-playground');
          setMode('next');
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

  const navigate = (path: string) => {
    try {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', path);
      }
    } catch (e) {}
    setCurrentRoute(path);
    if (path.includes('typescript')) {
      setMode('ts');
    } else if (path.includes('nodejs')) {
      setMode('node');
    } else if (path.includes('nextjs')) {
      setMode('next');
    } else if (path === '/') {
      setMode('js');
    }
  };

  const handleModeChange = (newMode: PlaygroundMode) => {
    setMode(newMode);
    try {
      if (typeof window !== 'undefined' && window.history) {
        if (newMode === 'ts') {
          window.history.pushState({}, '', '/typescript-playground');
          setCurrentRoute('/typescript-playground');
        } else if (newMode === 'node') {
          window.history.pushState({}, '', '/nodejs-playground');
          setCurrentRoute('/nodejs-playground');
        } else if (newMode === 'next') {
          window.history.pushState({}, '', '/nextjs-playground');
          setCurrentRoute('/nextjs-playground');
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
      safeStorageSet('node_playground_raw_code', nodeCode);
    }, 400);
    return () => clearTimeout(handler);
  }, [nodeCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      safeStorageSet('next_playground_raw_code', nextCode);
    }, 400);
    return () => clearTimeout(handler);
  }, [nextCode]);

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

  // Run Node.js
  const handleRunNode = useCallback(async () => {
    if (!nodeCode.trim()) return;
    setIsRunning(true);
    setNodeLogs([]);
    try {
      await executeJavaScript(
        nodeCode, 
        (entry) => setNodeLogs((prev) => [...prev, entry]),
        () => setNodeLogs([])
      );
    } catch (err: any) {
      setNodeLogs((prev) => [
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
  }, [nodeCode]);

  // Run Next.js
  const handleRunNext = useCallback(async () => {
    if (!nextCode.trim()) return;
    setIsRunning(true);
    setNextLogs([]);
    try {
      await executeJavaScript(
        nextCode, 
        (entry) => setNextLogs((prev) => [...prev, entry]),
        () => setNextLogs([])
      );
    } catch (err: any) {
      setNextLogs((prev) => [
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
  }, [nextCode]);

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
    } else if (mode === 'node') {
      handleRunNode();
    } else if (mode === 'next') {
      handleRunNext();
    } else {
      handleRunWeb();
    }
  }, [mode, handleRunJs, handleRunTs, handleRunNode, handleRunNext, handleRunWeb]);

  // Clear Left Editor Card
  const handleClearEditor = () => {
    if (mode === 'js') {
      setJsCode('');
    } else if (mode === 'ts') {
      setTsCode('');
    } else if (mode === 'node') {
      setNodeCode('');
    } else if (mode === 'next') {
      setNextCode('');
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
    } else if (mode === 'node') {
      setNodeLogs([]);
    } else if (mode === 'next') {
      setNextLogs([]);
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
    } else if (mode === 'node') {
      setNodeLogs(prev => [...prev, userPromptEntry]);
      await executeJavaScript(
        trimmed,
        (entry) => setNodeLogs(prev => [...prev, entry]),
        () => setNodeLogs([])
      );
    } else if (mode === 'next') {
      setNextLogs(prev => [...prev, userPromptEntry]);
      await executeJavaScript(
        trimmed,
        (entry) => setNextLogs(prev => [...prev, entry]),
        () => setNextLogs([])
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

  const isTsRoute = currentRoute === '/typescript-playground' || mode === 'ts';
  const isNodeRoute = currentRoute === '/nodejs-playground' || mode === 'node';
  const isNextRoute = currentRoute === '/nextjs-playground' || mode === 'next';

  const currentTitle = isTsRoute
    ? 'TypeScript Playground – Online TypeScript Compiler'
    : isNodeRoute
    ? 'Node.js Playground – Online Node.js REPL & Runtime'
    : isNextRoute
    ? 'Next.js Playground – Online React & Next.js Sandbox'
    : 'JS Playground – Online JavaScript & TypeScript Editor';

  const currentDesc = isTsRoute
    ? 'Run TypeScript online in your browser. Free online TypeScript compiler with real-time DevTools console, top-level await, and file drag-and-drop.'
    : isNodeRoute
    ? 'Run Node.js online instantly. Zero-setup Node.js REPL with interactive DevTools console, object inspectors, and top-level await.'
    : isNextRoute
    ? 'Run Next.js and React components online. High-performance browser sandbox for React and Next.js.'
    : 'Free online JavaScript & TypeScript playground. Run code instantly in your browser with a DevTools console, top-level await, and zero setup.';

  const currentCanonical = isTsRoute
    ? '/typescript-playground'
    : isNodeRoute
    ? '/nodejs-playground'
    : isNextRoute
    ? '/nextjs-playground'
    : '';

  const currentKeywords = isTsRoute
    ? 'TypeScript playground, online TypeScript compiler, run TypeScript online, TS playground online, test TypeScript online, TypeScript sandbox, browser TypeScript runner, jsplayground.js.org'
    : isNodeRoute
    ? 'Node.js playground, run Node.js online, online Node.js compiler, Node.js REPL online, test Node code online, Node.js editor online, nodejs playground online, jsplayground.js.org'
    : isNextRoute
    ? 'Next.js playground, run Next.js online, online Next.js editor, Next.js sandbox, React playground, test React components online, nextjs playground online, jsplayground.js.org'
    : 'JavaScript playground, JS playground, online JavaScript editor, run JavaScript online, JavaScript compiler online, js playground online, javascript playground online, online javascript compiler, run js online, javascript editor online, run js code online, online javascript runner, test javascript online, javascript sandbox online, js repl, html css js sandbox, jsfiddle alternative, in-browser javascript compiler, free javascript compiler, devtools console, TypeScript playground, Node.js playground, Next.js playground, jsplayground.js.org';

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "JS Playground",
      "url": "https://jsplayground.js.org/",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All modern web browsers",
      "description": currentDesc,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
  ];

  return (
    <div 
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none ${
        theme === 'dark' ? 'bg-[#080a0f] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <SEOHead
        title={currentTitle}
        description={currentDesc}
        keywords={currentKeywords}
        canonicalPath={currentCanonical}
        jsonLd={jsonLdData}
      />

      {/* Sliding Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeMode={mode}
        currentRoute={currentRoute}
        onNavigate={navigate}
        onModeChange={handleModeChange}
      />

      {/* Top Header Bar with dynamic mode logo */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onToggleDrawer={() => setIsDrawerOpen(true)}
        isFullscreen={false}
        onToggleFullscreen={() => {}}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Playground Workspace */}
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
              onShare={handleShareCode}
              shareState={shareState}
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
              onShare={handleShareCode}
              shareState={shareState}
              mode="ts"
              placeholder="Paste your TypeScript or drop a file"
              isRunning={isRunning}
            />
          ) : mode === 'node' ? (
            <CodeEditor
              value={nodeCode}
              onChange={setNodeCode}
              language="javascript"
              onRun={handleRun}
              onClear={handleClearEditor}
              onShare={handleShareCode}
              shareState={shareState}
              mode="node"
              placeholder="Paste your Node.js code or drop a file"
              isRunning={isRunning}
            />
          ) : mode === 'next' ? (
            <CodeEditor
              value={nextCode}
              onChange={setNextCode}
              language="javascript"
              onRun={handleRun}
              onClear={handleClearEditor}
              onShare={handleShareCode}
              shareState={shareState}
              mode="next"
              placeholder="Paste your Next.js / React component code"
              isRunning={isRunning}
            />
          ) : (
            <CodeEditor
              value={currentWebCode}
              onChange={handleWebCodeChange}
              language={currentWebLanguage}
              onRun={handleRun}
              onClear={handleClearEditor}
              onShare={handleShareCode}
              shareState={shareState}
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
          {mode === 'js' || mode === 'ts' || mode === 'node' || mode === 'next' ? (
            <ConsoleView
              logs={
                mode === 'js'
                  ? jsLogs
                  : mode === 'ts'
                  ? tsLogs
                  : mode === 'node'
                  ? nodeLogs
                  : nextLogs
              }
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
    </div>
  );
}
