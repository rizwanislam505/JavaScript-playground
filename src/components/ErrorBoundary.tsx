import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#080a0f] text-zinc-200 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#10141f] border border-zinc-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-xs text-zinc-400 font-mono">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Reset Playground &amp; Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
