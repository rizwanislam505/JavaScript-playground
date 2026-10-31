import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and suppress external browser extension errors (e.g. frame_ant fetch wrapper)
window.addEventListener(
  'error',
  (event) => {
    if (
      event.filename?.includes('chrome-extension:') ||
      event.filename?.includes('moz-extension:') ||
      event.message?.includes('Cannot set property fetch') ||
      event.filename?.includes('frame_ant')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);

window.addEventListener(
  'unhandledrejection',
  (event) => {
    const reason = event.reason ? (event.reason.message || String(event.reason)) : '';
    if (
      reason.includes('chrome-extension:') ||
      reason.includes('moz-extension:') ||
      reason.includes('Cannot set property fetch') ||
      reason.includes('frame_ant')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);

createRoot(document.getElementById('root')!).render(<App />);
