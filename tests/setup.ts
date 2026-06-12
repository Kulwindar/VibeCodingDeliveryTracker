import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from apps/web/.env.local
config({ path: resolve(__dirname, '../apps/web/.env.local') });

// Backup original fetch
const originalFetch = global.fetch;

// Patch fetch to handle relative URLs
global.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
  if (typeof input === 'string' && input.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return originalFetch(`${baseUrl}${input}`, init);
  }
  return originalFetch(input, init);
};
