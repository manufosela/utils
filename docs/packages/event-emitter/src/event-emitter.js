/**
 * Lightweight pub/sub event emitter
 *
 * @example
 * ```js
 * const emitter = new EventEmitter();
 *
 * // Subscribe
 * const unsubscribe = emitter.on('user:login', (user) => {
 *   console.log('User logged in:', user);
 * });
 *
 * // Emit
 * emitter.emit('user:login', { name: 'John' });
 *
 * // Unsubscribe
 * unsubscribe();
 * ```
 */
export class EventEmitter {
  /**
   * @param {Object} [options]
   * @param {number} [options.maxListeners=0] - Max listeners per event (0 = unlimited)
   * @param {boolean} [options.wildcard=false] - Enable wildcard matching
   * @param {string} [options.delimiter=':'] - Namespace delimiter
   */
  constructor(options = {}) {
    this._events = new Map();
    this._maxListeners = options.maxListeners || 0;
    this._wildcard = options.wildcard || false;
    this._delimiter = options.delimiter || ':';
  }

  /**
   * Register an event listener
   * @template T
   * @param {string} event - Event name
   * @param {function(T): void} callback - Event callback
   * @returns {function(): void} Unsubscribe function
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }

    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }

    const listeners = this._events.get(event);

    if (this._maxListeners > 0 && listeners.size >= this._maxListeners) {
      console.warn(
        `MaxListenersExceededWarning: Possible memory leak detected. ` +
        `${listeners.size + 1} listeners added to "${event}". ` +
        `Max is ${this._maxListeners}.`
      );
    }

    listeners.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Register a one-time event listener
   * @template T
   * @param {string} event - Event name
   * @param {function(T): void} callback - Event callback
   * @returns {function(): void} Unsubscribe function
   */
  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    wrapper._originalCallback = callback;
    return this.on(event, wrapper);
  }

  /**
   * Remove an event listener
   * @template T
   * @param {string} event - Event name
   * @param {function(T): void} callback - Callback to remove
   */
  off(event, callback) {
    const listeners = this._events.get(event);
    if (!listeners) return;

    // Check for direct match
    if (listeners.has(callback)) {
      listeners.delete(callback);
    } else {
      // Check for once wrapper
      for (const listener of listeners) {
        if (listener._originalCallback === callback) {
          listeners.delete(listener);
          break;
        }
      }
    }

    // Clean up empty event sets
    if (listeners.size === 0) {
      this._events.delete(event);
    }
  }

  /**
   * Emit an event
   * @template T
   * @param {string} event - Event name
   * @param {T} [data] - Event data
   */
  emit(event, data) {
    // Direct listeners
    const listeners = this._events.get(event);
    if (listeners) {
      for (const callback of listeners) {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      }
    }

    // Wildcard listeners
    if (this._wildcard) {
      this._emitWildcard(event, data);
    }
  }

  /**
   * Emit to wildcard listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  _emitWildcard(event, data) {
    for (const [pattern, listeners] of this._events) {
      if (pattern === event) continue; // Already handled

      if (this._matchWildcard(pattern, event)) {
        for (const callback of listeners) {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in wildcard listener for "${pattern}":`, error);
          }
        }
      }
    }
  }

  /**
   * Match wildcard pattern
   * @param {string} pattern - Pattern with wildcards
   * @param {string} event - Event name
   * @returns {boolean}
   * @private
   */
  _matchWildcard(pattern, event) {
    if (!pattern.includes('*')) return false;

    const patternParts = pattern.split(this._delimiter);
    const eventParts = event.split(this._delimiter);

    // ** matches any number of segments
    if (pattern === '**') return true;

    let patternIdx = 0;
    let eventIdx = 0;

    while (patternIdx < patternParts.length && eventIdx < eventParts.length) {
      const p = patternParts[patternIdx];

      if (p === '**') {
        // ** at end matches everything
        if (patternIdx === patternParts.length - 1) return true;
        // Skip segments until next pattern part matches
        patternIdx++;
        const nextPattern = patternParts[patternIdx];
        while (eventIdx < eventParts.length && eventParts[eventIdx] !== nextPattern) {
          eventIdx++;
        }
      } else if (p === '*') {
        // * matches single segment
        patternIdx++;
        eventIdx++;
      } else if (p === eventParts[eventIdx]) {
        patternIdx++;
        eventIdx++;
      } else {
        return false;
      }
    }

    return patternIdx === patternParts.length && eventIdx === eventParts.length;
  }

  /**
   * Remove all listeners for an event or all events
   * @param {string} [event] - Event name (optional)
   */
  removeAllListeners(event) {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    const listeners = this._events.get(event);
    return listeners ? listeners.size : 0;
  }

  /**
   * Get all registered event names
   * @returns {string[]}
   */
  eventNames() {
    return Array.from(this._events.keys());
  }

  /**
   * Check if event has listeners
   * @param {string} event - Event name
   * @returns {boolean}
   */
  hasListeners(event) {
    return this.listenerCount(event) > 0;
  }
}
