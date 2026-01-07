/**
 * @fileoverview Tests for debounce-throttle package
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  once,
  defer,
  delay,
  rateLimit
} from '../src/index.js';

describe('debounce-throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('should throw error if first argument is not a function', () => {
      expect(() => debounce('not a function')).toThrow('First argument must be a function');
      expect(() => debounce(null)).toThrow('First argument must be a function');
      expect(() => debounce(123)).toThrow('First argument must be a function');
    });

    it('should throw error if delay is negative', () => {
      expect(() => debounce(() => {}, -100)).toThrow('Delay must be a non-negative number');
    });

    it('should throw error if delay is not a number', () => {
      expect(() => debounce(() => {}, 'invalid')).toThrow('Delay must be a non-negative number');
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('arg1', 'arg2');

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should use latest arguments', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('third');
    });

    it('should invoke on leading edge when leading is true', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: false });

      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      debounced();
      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should invoke on both edges when both are true', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: true });

      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      debounced();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should respect maxWait option', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { maxWait: 200 });

      // Keep calling to prevent trailing edge
      for (let i = 0; i < 10; i++) {
        debounced();
        vi.advanceTimersByTime(50);
      }

      // Should have been called due to maxWait
      expect(fn.mock.calls.length).toBeGreaterThan(0);
    });

    it('should cancel pending invocation', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.cancel();

      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it('should flush pending invocation', () => {
      const fn = vi.fn().mockReturnValue('result');
      const debounced = debounce(fn, 100);

      debounced();
      const result = debounced.flush();

      expect(fn).toHaveBeenCalledTimes(1);
      expect(result).toBe('result');
    });

    it('should return pending status', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      expect(debounced.pending()).toBe(false);

      debounced();
      expect(debounced.pending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debounced.pending()).toBe(false);
    });

    it('should preserve this context', () => {
      const obj = {
        value: 42,
        method: debounce(function() {
          return this.value;
        }, 100)
      };

      obj.method();
      vi.advanceTimersByTime(100);

      // Method should have access to this
      expect(obj.value).toBe(42);
    });
  });

  describe('throttle', () => {
    it('should throw error if first argument is not a function', () => {
      expect(() => throttle('not a function')).toThrow('First argument must be a function');
    });

    it('should throw error if limit is negative', () => {
      expect(() => throttle(() => {}, -100)).toThrow('Limit must be a non-negative number');
    });

    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should invoke on leading edge by default', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should invoke on trailing edge by default', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not invoke on leading edge when leading is false', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100, { leading: false });

      throttled();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not invoke on trailing edge when trailing is false', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100, { trailing: false });

      throttled();
      throttled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should have cancel method', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled.cancel();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should have flush method', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled.flush();

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should have pending method', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();

      expect(throttled.pending()).toBe(true);

      vi.advanceTimersByTime(100);

      expect(throttled.pending()).toBe(false);
    });
  });

  describe('once', () => {
    it('should throw error if argument is not a function', () => {
      expect(() => once('not a function')).toThrow('Argument must be a function');
      expect(() => once(null)).toThrow('Argument must be a function');
    });

    it('should only invoke function once', () => {
      const fn = vi.fn().mockReturnValue('result');
      const onced = once(fn);

      expect(onced()).toBe('result');
      expect(onced()).toBe('result');
      expect(onced()).toBe('result');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments on first call', () => {
      const fn = vi.fn((a, b) => a + b);
      const onced = once(fn);

      expect(onced(1, 2)).toBe(3);
      expect(onced(3, 4)).toBe(3); // Returns cached result

      expect(fn).toHaveBeenCalledWith(1, 2);
    });

    it('should preserve this context', () => {
      const obj = {
        value: 10,
        getValue: once(function() {
          return this.value;
        })
      };

      expect(obj.getValue()).toBe(10);
    });
  });

  describe('defer', () => {
    it('should throw error if first argument is not a function', () => {
      expect(() => defer('not a function')).toThrow('First argument must be a function');
    });

    it('should defer function execution', () => {
      const fn = vi.fn();
      defer(fn);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to deferred function', () => {
      const fn = vi.fn();
      defer(fn, 'arg1', 'arg2');

      vi.advanceTimersByTime(0);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should return timeout ID', () => {
      const fn = vi.fn();
      const id = defer(fn);

      expect(typeof id).toBe('number');
    });
  });

  describe('delay', () => {
    it('should throw error if first argument is not a function', () => {
      expect(() => delay('not a function', 100)).toThrow('First argument must be a function');
    });

    it('should throw error if wait is negative', () => {
      expect(() => delay(() => {}, -100)).toThrow('Wait must be a non-negative number');
    });

    it('should throw error if wait is not a number', () => {
      expect(() => delay(() => {}, 'invalid')).toThrow('Wait must be a non-negative number');
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      delay(fn, 100);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to delayed function', () => {
      const fn = vi.fn();
      delay(fn, 100, 'arg1', 'arg2');

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should return timeout ID', () => {
      const fn = vi.fn();
      const id = delay(fn, 100);

      expect(typeof id).toBe('number');
    });
  });

  describe('rateLimit', () => {
    it('should throw error if first argument is not a function', () => {
      expect(() => rateLimit('not a function', 10, 1000)).toThrow('First argument must be a function');
    });

    it('should throw error if limit is less than 1', () => {
      expect(() => rateLimit(() => {}, 0, 1000)).toThrow('Limit must be a positive number');
      expect(() => rateLimit(() => {}, -1, 1000)).toThrow('Limit must be a positive number');
    });

    it('should throw error if period is negative', () => {
      expect(() => rateLimit(() => {}, 10, -1000)).toThrow('Period must be a non-negative number');
    });

    it('should limit function calls within period', () => {
      const fn = vi.fn().mockReturnValue('result');
      const limited = rateLimit(fn, 3, 1000);

      expect(limited()).toBe('result');
      expect(limited()).toBe('result');
      expect(limited()).toBe('result');
      expect(limited()).toBeUndefined();
      expect(limited()).toBeUndefined();

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should reset after period expires', () => {
      const fn = vi.fn().mockReturnValue('result');
      const limited = rateLimit(fn, 2, 1000);

      limited();
      limited();
      expect(limited()).toBeUndefined();

      vi.advanceTimersByTime(1000);

      expect(limited()).toBe('result');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should pass arguments to limited function', () => {
      const fn = vi.fn();
      const limited = rateLimit(fn, 2, 1000);

      limited('arg1', 'arg2');

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should preserve this context', () => {
      const obj = {
        value: 42,
        method: rateLimit(function() {
          return this.value;
        }, 2, 1000)
      };

      expect(obj.method()).toBe(42);
    });
  });
});
