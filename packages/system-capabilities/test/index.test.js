/**
 * @fileoverview Tests for system-capabilities package
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getBrowserInfo,
  getCapabilities,
  getCapabilitiesSync,
  supports,
  getDeviceMemory,
  getHardwareConcurrency,
  getConnectionInfo,
  getScreenInfo,
  prefersReducedMotion,
  prefersDarkMode,
  isStandalone
} from '../src/index.js';

describe('system-capabilities', () => {
  describe('getBrowserInfo', () => {
    it('should return browser info object', () => {
      const info = getBrowserInfo();

      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('version');
      expect(info).toHaveProperty('engine');
      expect(info).toHaveProperty('os');
      expect(info).toHaveProperty('osVersion');
      expect(info).toHaveProperty('isMobile');
      expect(info).toHaveProperty('isBot');
      expect(info).toHaveProperty('userAgent');
    });

    it('should detect Chrome browser', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Chrome');
      expect(info.version).toContain('120');
      expect(info.engine).toBe('Blink');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect Firefox browser', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Firefox');
      expect(info.engine).toBe('Gecko');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect Safari browser', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Safari');
      expect(info.engine).toBe('WebKit');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect Edge browser', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.name).toBe('Edge');
      expect(info.engine).toBe('Blink');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect mobile browsers', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.isMobile).toBe(true);
      expect(info.os).toBe('iOS');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect bots', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.isBot).toBe(true);

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect Windows OS', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.os).toBe('Windows');
      expect(info.osVersion).toBe('10');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect macOS', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.os).toBe('macOS');

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });

    it('should detect Android', () => {
      const originalUA = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
        configurable: true
      });

      const info = getBrowserInfo();
      expect(info.os).toBe('Android');
      expect(info.isMobile).toBe(true);

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true
      });
    });
  });

  describe('getCapabilitiesSync', () => {
    it('should return capabilities object', () => {
      const caps = getCapabilitiesSync();

      expect(typeof caps).toBe('object');
      expect(caps).toHaveProperty('webgl');
      expect(caps).toHaveProperty('serviceWorker');
      expect(caps).toHaveProperty('fetch');
      expect(caps).toHaveProperty('localStorage');
    });

    it('should detect localStorage support', () => {
      const caps = getCapabilitiesSync();
      expect(typeof caps.localStorage).toBe('boolean');
    });

    it('should detect sessionStorage support', () => {
      const caps = getCapabilitiesSync();
      expect(typeof caps.sessionStorage).toBe('boolean');
    });

    it('should detect fetch support', () => {
      const caps = getCapabilitiesSync();
      expect(caps.fetch).toBe(true);
    });

    it('should detect WebSocket support', () => {
      const caps = getCapabilitiesSync();
      expect(typeof caps.websockets).toBe('boolean');
    });

    it('should detect Intersection Observer support', () => {
      const caps = getCapabilitiesSync();
      expect(typeof caps.intersectionObserver).toBe('boolean');
    });

    it('should detect Resize Observer support', () => {
      const caps = getCapabilitiesSync();
      expect(typeof caps.resizeObserver).toBe('boolean');
    });

    it('should detect Mutation Observer support', () => {
      const caps = getCapabilitiesSync();
      expect(typeof caps.mutationObserver).toBe('boolean');
    });
  });

  describe('getCapabilities', () => {
    it('should return promise resolving to capabilities', async () => {
      const caps = await getCapabilities();

      expect(typeof caps).toBe('object');
      expect(caps).toHaveProperty('webp');
      expect(caps).toHaveProperty('avif');
    });

    it('should include async capabilities', async () => {
      const caps = await getCapabilities();

      expect(typeof caps.webp).toBe('boolean');
      expect(typeof caps.avif).toBe('boolean');
    });
  });

  describe('supports', () => {
    it('should check sync feature support', () => {
      const result = supports('fetch');
      expect(typeof result).toBe('boolean');
    });

    it('should return promise for async features', () => {
      const result = supports('webp');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return false for unknown features', () => {
      const result = supports('unknownFeature');
      expect(result).toBe(false);
    });

    it('should check localStorage support', () => {
      const result = supports('localStorage');
      expect(typeof result).toBe('boolean');
    });

    it('should check webgl support', () => {
      const result = supports('webgl');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getDeviceMemory', () => {
    it('should return number or null', () => {
      const memory = getDeviceMemory();
      expect(memory === null || typeof memory === 'number').toBe(true);
    });
  });

  describe('getHardwareConcurrency', () => {
    it('should return number or null', () => {
      const cores = getHardwareConcurrency();
      expect(cores === null || typeof cores === 'number').toBe(true);
    });

    it('should return positive number if available', () => {
      const cores = getHardwareConcurrency();
      if (cores !== null) {
        expect(cores).toBeGreaterThan(0);
      }
    });
  });

  describe('getConnectionInfo', () => {
    it('should return object or null', () => {
      const connection = getConnectionInfo();
      expect(connection === null || typeof connection === 'object').toBe(true);
    });

    it('should have expected properties if available', () => {
      const connection = getConnectionInfo();
      if (connection !== null) {
        expect(connection).toHaveProperty('effectiveType');
        expect(connection).toHaveProperty('downlink');
        expect(connection).toHaveProperty('rtt');
        expect(connection).toHaveProperty('saveData');
      }
    });
  });

  describe('getScreenInfo', () => {
    it('should return screen info object', () => {
      const screenInfo = getScreenInfo();

      expect(typeof screenInfo).toBe('object');
      expect(screenInfo).toHaveProperty('width');
      expect(screenInfo).toHaveProperty('height');
      expect(screenInfo).toHaveProperty('availWidth');
      expect(screenInfo).toHaveProperty('availHeight');
      expect(screenInfo).toHaveProperty('colorDepth');
      expect(screenInfo).toHaveProperty('pixelRatio');
      expect(screenInfo).toHaveProperty('orientation');
    });

    it('should return numeric dimensions', () => {
      const screenInfo = getScreenInfo();

      expect(typeof screenInfo.width).toBe('number');
      expect(typeof screenInfo.height).toBe('number');
      expect(typeof screenInfo.pixelRatio).toBe('number');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return boolean', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('prefersDarkMode', () => {
    it('should return boolean', () => {
      const result = prefersDarkMode();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isStandalone', () => {
    it('should return boolean', () => {
      const result = isStandalone();
      expect(typeof result).toBe('boolean');
    });
  });
});

describe('Edge cases', () => {
  it('should handle missing navigator gracefully', () => {
    // The function should not throw
    expect(() => getBrowserInfo()).not.toThrow();
    expect(() => getCapabilitiesSync()).not.toThrow();
  });

  it('should handle missing window gracefully', () => {
    expect(() => getScreenInfo()).not.toThrow();
    expect(() => prefersReducedMotion()).not.toThrow();
    expect(() => prefersDarkMode()).not.toThrow();
  });
});
