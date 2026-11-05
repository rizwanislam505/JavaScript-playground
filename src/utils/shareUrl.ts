import LZString from 'lz-string';

const MAX_URL_SAFE_CHAR_LIMIT = 2000;

export interface ShareResult {
  success: boolean;
  url?: string;
  isTooLarge?: boolean;
}

/**
 * Generates a compressed share URL or detects if code exceeds URL limits.
 */
export function generateShareUrl(code: string, mode: string): ShareResult {
  if (!code || !code.trim()) return { success: false };

  const compressed = LZString.compressToEncodedURIComponent(code.trim());
  if (compressed.length > MAX_URL_SAFE_CHAR_LIMIT) {
    return { success: false, isTooLarge: true };
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jsplayground.js.org';
  const path = mode === 'ts' ? '/typescript-playground' : '/';
  const url = `${origin}${path}#code=${compressed}`;

  return { success: true, url };
}

/**
 * Decodes compressed code from URL hash.
 */
export function decodeCodeFromHash(hashString: string): string | null {
  if (!hashString) return null;
  const cleanHash = hashString.replace(/^#\/?(code=)?/, '');
  if (!cleanHash) return null;
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);
    return decompressed || null;
  } catch (e) {
    return null;
  }
}
