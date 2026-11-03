import { WebProjectState } from './types';

export const JS_DEFAULT_CODE = `// Welcome to JS Playground
const numbers = [1, 2, 3, 4, 5];
console.log("Original numbers:", numbers);

const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// Trailing expression evaluation (like Chrome DevTools / Node REPL)
doubled;`;

export const TS_DEFAULT_CODE = `// TypeScript Playground
interface User {
  id: number;
  name: string;
  role: string;
}

const user: User = {
  id: 1,
  name: "Alex",
  role: "Developer"
};

console.log("TypeScript User:", user);
user;`;

export const WEB_DEFAULT_PROJECT: WebProjectState = {
  html: '<div class="card">\n  <h1>Hello Web Playground</h1>\n  <p>Edit HTML, CSS, or JS below.</p>\n</div>',
  css: 'body {\n  font-family: system-ui, sans-serif;\n  background: #0b0d14;\n  color: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n.card {\n  background: #151922;\n  padding: 24px;\n  border-radius: 12px;\n  border: 1px solid #252a3a;\n}',
  js: 'console.log("Web Playground loaded successfully!");'
};
