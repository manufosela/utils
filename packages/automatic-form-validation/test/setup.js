import { vi } from 'vitest';

globalThis.scrollTo = vi.fn();
if (globalThis.window) {
  globalThis.window.scrollTo = vi.fn();
}
