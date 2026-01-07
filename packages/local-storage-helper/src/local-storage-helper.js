/**
 * LocalStorage wrapper with TTL support and JSON serialization
 *
 * @example
 * ```js
 * const storage = new LocalStorageHelper({ prefix: 'myapp_' });
 *
 * // Set with TTL (1 hour)
 * storage.set('user', { name: 'John' }, 60 * 60 * 1000);
 *
 * // Get (returns null if expired)
 * const user = storage.get('user');
 * ```
 */
export class LocalStorageHelper {
  /**
   * @param {Object} [options]
   * @param {string} [options.prefix=''] - Prefix for all keys
   * @param {number} [options.defaultTTL=0] - Default TTL in ms (0 = no expiration)
   * @param {boolean} [options.useSession=false] - Use sessionStorage instead
   */
  constructor(options = {}) {
    this._prefix = options.prefix || '';
    this._defaultTTL = options.defaultTTL || 0;
    this._storage = options.useSession ? sessionStorage : localStorage;
  }

  /**
   * Get prefixed key
   * @param {string} key
   * @returns {string}
   * @private
   */
  _getKey(key) {
    return `${this._prefix}${key}`;
  }

  /**
   * Set a value with optional TTL
   * @template T
   * @param {string} key - Storage key
   * @param {T} value - Value to store
   * @param {number} [ttl] - TTL in milliseconds
   */
  set(key, value, ttl) {
    const effectiveTTL = ttl !== undefined ? ttl : this._defaultTTL;

    const item = {
      value,
      createdAt: Date.now(),
      expiry: effectiveTTL > 0 ? Date.now() + effectiveTTL : null,
    };

    try {
      this._storage.setItem(this._getKey(key), JSON.stringify(item));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded');
        // Try to clean expired items
        this._cleanExpired();
        // Retry
        try {
          this._storage.setItem(this._getKey(key), JSON.stringify(item));
        } catch (retryError) {
          console.error('Failed to save to localStorage after cleanup:', retryError);
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Get a value
   * @template T
   * @param {string} key - Storage key
   * @param {T} [defaultValue=null] - Default if not found
   * @returns {T | null}
   */
  get(key, defaultValue = null) {
    const raw = this._storage.getItem(this._getKey(key));

    if (!raw) {
      return defaultValue;
    }

    try {
      const item = JSON.parse(raw);

      // Check expiration
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return defaultValue;
      }

      return item.value;
    } catch (error) {
      // Invalid JSON, remove and return default
      this.remove(key);
      return defaultValue;
    }
  }

  /**
   * Remove a value
   * @param {string} key - Storage key
   */
  remove(key) {
    this._storage.removeItem(this._getKey(key));
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    const value = this.get(key);
    return value !== null;
  }

  /**
   * Clear all items with prefix
   */
  clear() {
    const keys = this.keys();
    keys.forEach(key => this.remove(key));
  }

  /**
   * Get all keys with prefix
   * @returns {string[]}
   */
  keys() {
    const keys = [];
    for (let i = 0; i < this._storage.length; i++) {
      const key = this._storage.key(i);
      if (key && key.startsWith(this._prefix)) {
        keys.push(key.slice(this._prefix.length));
      }
    }
    return keys;
  }

  /**
   * Get remaining TTL in milliseconds
   * @param {string} key - Storage key
   * @returns {number | null}
   */
  getTTL(key) {
    const raw = this._storage.getItem(this._getKey(key));

    if (!raw) return null;

    try {
      const item = JSON.parse(raw);

      if (!item.expiry) return null;

      const remaining = item.expiry - Date.now();
      return remaining > 0 ? remaining : null;
    } catch {
      return null;
    }
  }

  /**
   * Update TTL for existing key
   * @param {string} key - Storage key
   * @param {number} ttl - New TTL in milliseconds
   * @returns {boolean} Success
   */
  setTTL(key, ttl) {
    const raw = this._storage.getItem(this._getKey(key));

    if (!raw) return false;

    try {
      const item = JSON.parse(raw);
      item.expiry = ttl > 0 ? Date.now() + ttl : null;
      this._storage.setItem(this._getKey(key), JSON.stringify(item));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage size info
   * @returns {{ used: number, available: number, items: number }}
   */
  getSize() {
    let used = 0;
    let items = 0;

    for (let i = 0; i < this._storage.length; i++) {
      const key = this._storage.key(i);
      if (key && key.startsWith(this._prefix)) {
        const value = this._storage.getItem(key);
        if (value) {
          used += key.length + value.length;
          items++;
        }
      }
    }

    // Approximate available (5MB typical limit)
    const available = 5 * 1024 * 1024 - used;

    return { used, available: Math.max(0, available), items };
  }

  /**
   * Clean expired items
   * @private
   */
  _cleanExpired() {
    const keys = this.keys();
    for (const key of keys) {
      const raw = this._storage.getItem(this._getKey(key));
      if (raw) {
        try {
          const item = JSON.parse(raw);
          if (item.expiry && Date.now() > item.expiry) {
            this.remove(key);
          }
        } catch {
          // Invalid JSON, remove
          this.remove(key);
        }
      }
    }
  }
}

/**
 * Create a namespaced storage instance
 * @param {string} namespace - Storage namespace
 * @param {Object} [options] - Additional options
 * @returns {LocalStorageHelper}
 */
export function createStorage(namespace, options = {}) {
  return new LocalStorageHelper({
    ...options,
    prefix: `${namespace}_`,
  });
}
