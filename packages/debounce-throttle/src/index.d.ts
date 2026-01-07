/**
 * Debounce and throttle utility functions
 * @module @manufosela/debounce-throttle
 */

/**
 * Options for debounce function
 */
export interface DebounceOptions {
  /** Invoke on the leading edge of the timeout. Default: false */
  leading?: boolean;
  /** Invoke on the trailing edge of the timeout. Default: true */
  trailing?: boolean;
  /** Maximum time to wait before forcing invocation */
  maxWait?: number;
}

/**
 * Options for throttle function
 */
export interface ThrottleOptions {
  /** Invoke on the leading edge. Default: true */
  leading?: boolean;
  /** Invoke on the trailing edge. Default: true */
  trailing?: boolean;
}

/**
 * Interface for debounced/throttled function methods
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancels any pending invocation */
  cancel(): void;
  /** Immediately invokes any pending function */
  flush(): ReturnType<T> | undefined;
  /** Returns true if there is a pending invocation */
  pending(): boolean;
}

/**
 * Creates a debounced function that delays invoking func until after delay
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 0)
 * @param options - Configuration options
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay?: number,
  options?: DebounceOptions
): DebouncedFunction<T>;

/**
 * Creates a throttled function that only invokes func at most once per
 * every limit milliseconds.
 *
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle invocations to (default: 0)
 * @param options - Configuration options
 * @returns The throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit?: number,
  options?: ThrottleOptions
): DebouncedFunction<T>;

/**
 * Creates a function that is restricted to invoking func once.
 * Repeat calls return the value of the first invocation.
 *
 * @param func - The function to restrict
 * @returns The restricted function
 */
export function once<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T>;

/**
 * Creates a function that delays invocation until the current call stack has cleared.
 *
 * @param func - The function to defer
 * @param args - Arguments to pass to the function
 * @returns The timeout ID
 */
export function defer<T extends (...args: any[]) => any>(
  func: T,
  ...args: Parameters<T>
): number;

/**
 * Creates a function that invokes func after wait milliseconds.
 *
 * @param func - The function to delay
 * @param wait - The number of milliseconds to delay
 * @param args - Arguments to pass to the function
 * @returns The timeout ID (can be used with clearTimeout)
 */
export function delay<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  ...args: Parameters<T>
): number;

/**
 * Creates a rate-limited function that can only be called n times in a given period.
 *
 * @param func - The function to rate limit
 * @param limit - Maximum number of calls allowed
 * @param period - Time period in milliseconds
 * @returns The rate-limited function
 */
export function rateLimit<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  period: number
): (...args: Parameters<T>) => ReturnType<T> | undefined;

declare const _default: {
  debounce: typeof debounce;
  throttle: typeof throttle;
  once: typeof once;
  defer: typeof defer;
  delay: typeof delay;
  rateLimit: typeof rateLimit;
};

export default _default;
