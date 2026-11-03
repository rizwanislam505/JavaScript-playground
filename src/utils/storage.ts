// Safe localStorage wrapper that handles iframe sandboxes & third-party storage blocks gracefully

const memoryStorage: Record<string, string> = {};

export function safeStorageGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    // Fallback to in-memory storage if localStorage is blocked by iframe or browser privacy settings
  }
  return memoryStorage[key] ?? null;
}

export function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    // Fallback to in-memory storage
  }
  memoryStorage[key] = value;
}

export function safeStorageClear(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  } catch (e) {
    // Ignore storage restriction errors
  }
  Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
}
