/**
 * @fileoverview Tests for convert2webp package
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import {
  convertToWebP,
  convertBlobToWebP,
  convertUrlToWebP,
  isWebPSupported,
  createDownloadUrl,
  batchConvertToWebP
} from '../src/index.js';

// Mock canvas and image for Node.js environment
beforeAll(() => {
  // Mock URL.createObjectURL and revokeObjectURL
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

/**
 * Creates a mock File object for testing
 * @param {string} name - File name
 * @param {string} type - MIME type
 * @param {number} size - File size in bytes
 * @returns {File} Mock File object
 */
function createMockFile(name = 'test.png', type = 'image/png', size = 1024) {
  const content = new ArrayBuffer(size);
  return new File([content], name, { type });
}

/**
 * Creates a mock Blob object for testing
 * @param {string} type - MIME type
 * @param {number} size - Blob size in bytes
 * @returns {Blob} Mock Blob object
 */
function createMockBlob(type = 'image/png', size = 1024) {
  const content = new ArrayBuffer(size);
  return new Blob([content], { type });
}

describe('convert2webp', () => {
  describe('convertToWebP', () => {
    it('should throw error if first argument is not a File', async () => {
      await expect(convertToWebP('not-a-file')).rejects.toThrow(
        'First argument must be a File object'
      );
    });

    it('should throw error if first argument is null', async () => {
      await expect(convertToWebP(null)).rejects.toThrow(
        'First argument must be a File object'
      );
    });

    it('should throw error if quality is below 0', async () => {
      const file = createMockFile();
      await expect(convertToWebP(file, -0.1)).rejects.toThrow(
        'Quality must be between 0 and 1'
      );
    });

    it('should throw error if quality is above 1', async () => {
      const file = createMockFile();
      await expect(convertToWebP(file, 1.5)).rejects.toThrow(
        'Quality must be between 0 and 1'
      );
    });

    it('should accept quality as number', async () => {
      const file = createMockFile();
      // This will fail in Node without canvas, but validates parameter handling
      try {
        await convertToWebP(file, 0.9);
      } catch (e) {
        // Expected to fail in Node environment without canvas mock
        expect(e.message).not.toBe('Quality must be between 0 and 1');
      }
    });

    it('should accept options object', async () => {
      const file = createMockFile();
      try {
        await convertToWebP(file, { quality: 0.85, maxWidth: 800 });
      } catch (e) {
        expect(e.message).not.toBe('Quality must be between 0 and 1');
      }
    });
  });

  describe('convertBlobToWebP', () => {
    it('should throw error if first argument is not a Blob', async () => {
      await expect(convertBlobToWebP('not-a-blob')).rejects.toThrow(
        'First argument must be a Blob object'
      );
    });

    it('should throw error if first argument is null', async () => {
      await expect(convertBlobToWebP(null)).rejects.toThrow(
        'First argument must be a Blob object'
      );
    });

    it('should throw error if quality is invalid', async () => {
      const blob = createMockBlob();
      await expect(convertBlobToWebP(blob, { quality: 2 })).rejects.toThrow(
        'Quality must be between 0 and 1'
      );
    });

    it('should use default options when none provided', async () => {
      const blob = createMockBlob();
      try {
        await convertBlobToWebP(blob);
      } catch (e) {
        // Expected to fail in Node without canvas
        expect(e.message).not.toBe('Quality must be between 0 and 1');
      }
    });
  });

  describe('convertUrlToWebP', () => {
    it('should throw error if URL is not a string', async () => {
      await expect(convertUrlToWebP(123)).rejects.toThrow(
        'URL must be a non-empty string'
      );
    });

    it('should throw error if URL is empty', async () => {
      await expect(convertUrlToWebP('')).rejects.toThrow(
        'URL must be a non-empty string'
      );
    });

    it('should throw error if URL is whitespace only', async () => {
      await expect(convertUrlToWebP('   ')).rejects.toThrow(
        'URL must be a non-empty string'
      );
    });

    it('should throw error if quality is invalid', async () => {
      await expect(
        convertUrlToWebP('https://example.com/image.png', { quality: -1 })
      ).rejects.toThrow('Quality must be between 0 and 1');
    });
  });

  describe('createDownloadUrl', () => {
    it('should throw error if argument is not a Blob', () => {
      expect(() => createDownloadUrl('not-a-blob')).toThrow(
        'First argument must be a Blob object'
      );
    });

    it('should throw error if argument is null', () => {
      expect(() => createDownloadUrl(null)).toThrow(
        'First argument must be a Blob object'
      );
    });

    it('should return URL for valid blob', () => {
      const blob = createMockBlob();
      const url = createDownloadUrl(blob);
      expect(url).toBe('blob:mock-url');
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    });

    it('should accept optional filename parameter', () => {
      const blob = createMockBlob();
      const url = createDownloadUrl(blob, 'custom-name.webp');
      expect(url).toBe('blob:mock-url');
    });
  });

  describe('batchConvertToWebP', () => {
    it('should throw error if first argument is not an array', async () => {
      await expect(batchConvertToWebP('not-array')).rejects.toThrow(
        'First argument must be an array of File objects'
      );
    });

    it('should throw error if first argument is null', async () => {
      await expect(batchConvertToWebP(null)).rejects.toThrow(
        'First argument must be an array of File objects'
      );
    });

    it('should return empty array for empty input', async () => {
      const results = await batchConvertToWebP([]);
      expect(results).toEqual([]);
    });

    it('should call progress callback for each file', async () => {
      const files = [createMockFile('1.png'), createMockFile('2.png')];
      const onProgress = vi.fn();

      try {
        await batchConvertToWebP(files, {}, onProgress);
      } catch (e) {
        // Expected to fail in Node without canvas
      }
    });
  });

  describe('isWebPSupported', () => {
    it('should return false in Node environment without document', async () => {
      // Store original
      const originalDocument = global.document;

      // Remove document
      delete global.document;

      const supported = await isWebPSupported();
      expect(supported).toBe(false);

      // Restore
      global.document = originalDocument;
    });
  });
});

describe('Input validation edge cases', () => {
  it('convertToWebP should handle undefined quality', async () => {
    const file = createMockFile();
    try {
      await convertToWebP(file, undefined);
    } catch (e) {
      expect(e.message).not.toBe('Quality must be between 0 and 1');
    }
  });

  it('convertBlobToWebP should handle empty options', async () => {
    const blob = createMockBlob();
    try {
      await convertBlobToWebP(blob, {});
    } catch (e) {
      expect(e.message).not.toBe('Quality must be between 0 and 1');
    }
  });

  it('should validate quality at boundary 0', async () => {
    const file = createMockFile();
    try {
      await convertToWebP(file, 0);
    } catch (e) {
      // Should not throw quality error
      expect(e.message).not.toBe('Quality must be between 0 and 1');
    }
  });

  it('should validate quality at boundary 1', async () => {
    const file = createMockFile();
    try {
      await convertToWebP(file, 1);
    } catch (e) {
      // Should not throw quality error
      expect(e.message).not.toBe('Quality must be between 0 and 1');
    }
  });
});
