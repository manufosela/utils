/**
 * @fileoverview Debounce and throttle utility functions
 * @module @manufosela/debounce-throttle
 * @author manufosela
 * @license MIT
 */

/**
 * @typedef {Object} DebounceOptions
 * @property {boolean} [leading=false] - Invoke on the leading edge of the timeout
 * @property {boolean} [trailing=true] - Invoke on the trailing edge of the timeout
 * @property {number} [maxWait] - Maximum time to wait before forcing invocation
 */

/**
 * @typedef {Object} ThrottleOptions
 * @property {boolean} [leading=true] - Invoke on the leading edge
 * @property {boolean} [trailing=true] - Invoke on the trailing edge
 */

/**
 * @typedef {Object} DebouncedFunction
 * @property {Function} cancel - Cancels any pending invocation
 * @property {Function} flush - Immediately invokes any pending function
 * @property {Function} pending - Returns true if there is a pending invocation
 */

/**
 * Creates a debounced function that delays invoking func until after delay
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} [delay=0] - The number of milliseconds to delay
 * @param {DebounceOptions} [options={}] - Configuration options
 * @returns {Function & DebouncedFunction} The debounced function
 * @throws {Error} If func is not a function
 * @throws {Error} If delay is negative
 *
 * @example
 * // Basic usage
 * const debouncedSearch = debounce(search, 300);
 * input.addEventListener('input', debouncedSearch);
 *
 * @example
 * // With leading edge
 * const debouncedClick = debounce(handleClick, 500, { leading: true, trailing: false });
 *
 * @example
 * // With maxWait
 * const debouncedScroll = debounce(handleScroll, 100, { maxWait: 500 });
 */
export function debounce(func, delay = 0, options = {}) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }

  if (typeof delay !== 'number' || delay < 0) {
    throw new Error('Delay must be a non-negative number');
  }

  const {
    leading = false,
    trailing = true,
    maxWait
  } = options;

  let timerId = null;
  let maxTimerId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = null;
  let lastInvokeTime = 0;
  let result = null;

  // Validate maxWait
  const hasMaxWait = maxWait !== undefined;
  const maxWaitMs = hasMaxWait ? Math.max(maxWait, delay) : 0;

  /**
   * Invokes the function with stored context and arguments
   * @private
   */
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  /**
   * Checks if the function should be invoked
   * @private
   */
  function shouldInvoke(time) {
    const timeSinceLastCall = lastCallTime === null ? 0 : time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // First call, or delay has passed, or system time went backwards
    return (
      lastCallTime === null ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (hasMaxWait && timeSinceLastInvoke >= maxWaitMs)
    );
  }

  /**
   * Handles the trailing edge invocation
   * @private
   */
  function trailingEdge(time) {
    timerId = null;

    // Only invoke if we have lastArgs, meaning func was called at least once
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = null;
    lastThis = null;
    return result;
  }

  /**
   * Calculates remaining time until next invocation
   * @private
   */
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;

    return hasMaxWait
      ? Math.min(timeWaiting, maxWaitMs - timeSinceLastInvoke)
      : timeWaiting;
  }

  /**
   * Timer callback
   * @private
   */
  function timerExpired() {
    const time = Date.now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    // Restart the timer
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  /**
   * Handles the leading edge invocation
   * @private
   */
  function leadingEdge(time) {
    lastInvokeTime = time;

    // Start the timer for trailing edge
    timerId = setTimeout(timerExpired, delay);

    // Invoke immediately if leading is true
    return leading ? invokeFunc(time) : result;
  }

  /**
   * The debounced function
   */
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === null) {
        return leadingEdge(time);
      }

      if (hasMaxWait) {
        // Handle maxWait case
        timerId = setTimeout(timerExpired, delay);
        return invokeFunc(time);
      }
    }

    if (timerId === null) {
      timerId = setTimeout(timerExpired, delay);
    }

    return result;
  }

  /**
   * Cancels any pending invocation
   */
  debounced.cancel = function cancel() {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    if (maxTimerId !== null) {
      clearTimeout(maxTimerId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = null;
    lastThis = null;
    timerId = null;
    maxTimerId = null;
  };

  /**
   * Immediately invokes any pending function
   * @returns {*} The result of the function invocation
   */
  debounced.flush = function flush() {
    if (timerId === null) {
      return result;
    }
    return trailingEdge(Date.now());
  };

  /**
   * Returns true if there is a pending invocation
   * @returns {boolean}
   */
  debounced.pending = function pending() {
    return timerId !== null;
  };

  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per
 * every limit milliseconds.
 *
 * @param {Function} func - The function to throttle
 * @param {number} [limit=0] - The number of milliseconds to throttle invocations to
 * @param {ThrottleOptions} [options={}] - Configuration options
 * @returns {Function & DebouncedFunction} The throttled function
 * @throws {Error} If func is not a function
 * @throws {Error} If limit is negative
 *
 * @example
 * // Basic usage
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 *
 * @example
 * // Only trailing edge
 * const throttledResize = throttle(handleResize, 200, { leading: false });
 *
 * @example
 * // Only leading edge
 * const throttledClick = throttle(handleClick, 1000, { trailing: false });
 */
export function throttle(func, limit = 0, options = {}) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }

  if (typeof limit !== 'number' || limit < 0) {
    throw new Error('Limit must be a non-negative number');
  }

  const {
    leading = true,
    trailing = true
  } = options;

  return debounce(func, limit, {
    leading,
    trailing,
    maxWait: limit
  });
}

/**
 * Creates a function that is restricted to invoking func once.
 * Repeat calls return the value of the first invocation.
 *
 * @param {Function} func - The function to restrict
 * @returns {Function} The restricted function
 * @throws {Error} If func is not a function
 *
 * @example
 * const initialize = once(() => {
 *   console.log('Initialized!');
 *   return { ready: true };
 * });
 *
 * initialize(); // logs 'Initialized!', returns { ready: true }
 * initialize(); // returns { ready: true } without logging
 */
export function once(func) {
  if (typeof func !== 'function') {
    throw new Error('Argument must be a function');
  }

  let called = false;
  let result;

  return function onced(...args) {
    if (!called) {
      called = true;
      result = func.apply(this, args);
    }
    return result;
  };
}

/**
 * Creates a function that delays invocation until the current call stack has cleared.
 *
 * @param {Function} func - The function to defer
 * @param {...*} args - Arguments to pass to the function
 * @returns {number} The timeout ID
 * @throws {Error} If func is not a function
 *
 * @example
 * defer(() => console.log('deferred'));
 * console.log('immediate');
 * // Logs: 'immediate', then 'deferred'
 */
export function defer(func, ...args) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }

  return setTimeout(() => func(...args), 0);
}

/**
 * Creates a function that invokes func after wait milliseconds.
 *
 * @param {Function} func - The function to delay
 * @param {number} wait - The number of milliseconds to delay
 * @param {...*} args - Arguments to pass to the function
 * @returns {number} The timeout ID (can be used with clearTimeout)
 * @throws {Error} If func is not a function
 * @throws {Error} If wait is negative
 *
 * @example
 * const timerId = delay(() => console.log('delayed'), 1000);
 * // Logs 'delayed' after 1 second
 *
 * // Cancel if needed
 * clearTimeout(timerId);
 */
export function delay(func, wait, ...args) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }

  if (typeof wait !== 'number' || wait < 0) {
    throw new Error('Wait must be a non-negative number');
  }

  return setTimeout(() => func(...args), wait);
}

/**
 * Creates a rate-limited function that can only be called n times in a given period.
 *
 * @param {Function} func - The function to rate limit
 * @param {number} limit - Maximum number of calls allowed
 * @param {number} period - Time period in milliseconds
 * @returns {Function} The rate-limited function
 * @throws {Error} If func is not a function
 * @throws {Error} If limit or period is invalid
 *
 * @example
 * const rateLimitedApi = rateLimit(callApi, 10, 60000);
 * // Can only call callApi 10 times per minute
 */
export function rateLimit(func, limit, period) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }

  if (typeof limit !== 'number' || limit < 1) {
    throw new Error('Limit must be a positive number');
  }

  if (typeof period !== 'number' || period < 0) {
    throw new Error('Period must be a non-negative number');
  }

  const calls = [];

  return function rateLimited(...args) {
    const now = Date.now();

    // Remove calls outside the period
    while (calls.length > 0 && calls[0] <= now - period) {
      calls.shift();
    }

    if (calls.length < limit) {
      calls.push(now);
      return func.apply(this, args);
    }

    // Return undefined when rate limited
    return undefined;
  };
}

export default {
  debounce,
  throttle,
  once,
  defer,
  delay,
  rateLimit
};
