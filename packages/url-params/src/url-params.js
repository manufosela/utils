/**
 * URL parameter management utility
 *
 * @example
 * ```js
 * // Get current URL params
 * const userId = getParam('userId');
 *
 * // Set params and update URL
 * setParams({ page: 2, sort: 'name' });
 *
 * // Using class for custom URLs
 * const params = new UrlParams('https://example.com?a=1');
 * params.set('b', 2).remove('a');
 * console.log(params.toURL());
 * ```
 */

export class UrlParams {
  /**
   * @param {string | URL} [url] - URL to parse (defaults to current)
   * @param {Object} [options]
   * @param {boolean} [options.useHash=false] - Use hash params
   * @param {boolean} [options.autoUpdate=false] - Auto-update browser URL
   * @param {'bracket' | 'index' | 'comma' | 'repeat'} [options.arrayFormat='repeat']
   */
  constructor(url, options = {}) {
    this._options = {
      useHash: false,
      autoUpdate: false,
      arrayFormat: 'repeat',
      ...options,
    };

    if (url) {
      this._url = typeof url === 'string' ? new URL(url, 'http://localhost') : new URL(url.href);
    } else if (typeof window !== 'undefined') {
      this._url = new URL(window.location.href);
    } else {
      this._url = new URL('http://localhost');
    }

    this._params = this._options.useHash
      ? new URLSearchParams(this._url.hash.slice(1))
      : new URLSearchParams(this._url.search);
  }

  /**
   * Get a parameter value
   * @param {string} key
   * @param {string} [defaultValue=null]
   * @returns {string | null}
   */
  get(key, defaultValue = null) {
    const value = this._params.get(key);
    return value !== null ? value : defaultValue;
  }

  /**
   * Get all values for a parameter
   * @param {string} key
   * @returns {string[]}
   */
  getAll(key) {
    return this._params.getAll(key);
  }

  /**
   * Get all parameters as object
   * @returns {Object}
   */
  getObject() {
    const obj = {};
    for (const key of this._params.keys()) {
      const values = this._params.getAll(key);
      obj[key] = values.length > 1 ? values : values[0];
    }
    return obj;
  }

  /**
   * Set a parameter
   * @param {string} key
   * @param {*} value
   * @returns {this}
   */
  set(key, value) {
    if (value === null || value === undefined) {
      this._params.delete(key);
    } else if (Array.isArray(value)) {
      this._params.delete(key);
      value.forEach(v => this._params.append(key, String(v)));
    } else {
      this._params.set(key, String(value));
    }

    if (this._options.autoUpdate) {
      this.apply();
    }

    return this;
  }

  /**
   * Set multiple parameters
   * @param {Object} params
   * @returns {this}
   */
  setAll(params) {
    Object.entries(params).forEach(([key, value]) => {
      this.set(key, value);
    });
    return this;
  }

  /**
   * Append a value
   * @param {string} key
   * @param {*} value
   * @returns {this}
   */
  append(key, value) {
    if (value !== null && value !== undefined) {
      this._params.append(key, String(value));

      if (this._options.autoUpdate) {
        this.apply();
      }
    }
    return this;
  }

  /**
   * Remove a parameter
   * @param {string} key
   * @returns {this}
   */
  remove(key) {
    this._params.delete(key);

    if (this._options.autoUpdate) {
      this.apply();
    }

    return this;
  }

  /**
   * Check if parameter exists
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._params.has(key);
  }

  /**
   * Clear all parameters
   * @returns {this}
   */
  clear() {
    for (const key of [...this._params.keys()]) {
      this._params.delete(key);
    }

    if (this._options.autoUpdate) {
      this.apply();
    }

    return this;
  }

  /**
   * Get query string
   * @returns {string}
   */
  toString() {
    const str = this._params.toString();
    return str ? `?${str}` : '';
  }

  /**
   * Get full URL
   * @returns {string}
   */
  toURL() {
    const newUrl = new URL(this._url.href);

    if (this._options.useHash) {
      newUrl.hash = this._params.toString();
    } else {
      newUrl.search = this._params.toString();
    }

    return newUrl.href;
  }

  /**
   * Apply to browser URL
   */
  apply() {
    if (typeof window === 'undefined') return;

    const newUrl = this.toURL();
    window.history.replaceState(null, '', newUrl);
  }
}

// Convenience functions for current URL

/**
 * Get parameter from current URL
 * @param {string} key
 * @param {string} [defaultValue]
 * @returns {string | null}
 */
export function getParam(key, defaultValue = null) {
  return new UrlParams().get(key, defaultValue);
}

/**
 * Get all parameters from current URL
 * @returns {Object}
 */
export function getParams() {
  return new UrlParams().getObject();
}

/**
 * Set parameter in current URL
 * @param {string} key
 * @param {*} value
 */
export function setParam(key, value) {
  new UrlParams(undefined, { autoUpdate: true }).set(key, value);
}

/**
 * Set multiple parameters in current URL
 * @param {Object} params
 */
export function setParams(params) {
  new UrlParams(undefined, { autoUpdate: true }).setAll(params);
}

/**
 * Remove parameter from current URL
 * @param {string} key
 */
export function removeParam(key) {
  new UrlParams(undefined, { autoUpdate: true }).remove(key);
}

/**
 * Check if parameter exists in current URL
 * @param {string} key
 * @returns {boolean}
 */
export function hasParam(key) {
  return new UrlParams().has(key);
}

/**
 * Convert object to query string
 * @param {Object} params
 * @param {Object} [options]
 * @returns {string}
 */
export function toQueryString(params, options = {}) {
  const { arrayFormat = 'repeat' } = options;
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      switch (arrayFormat) {
        case 'bracket':
          value.forEach(v => searchParams.append(`${key}[]`, String(v)));
          break;
        case 'index':
          value.forEach((v, i) => searchParams.append(`${key}[${i}]`, String(v)));
          break;
        case 'comma':
          searchParams.set(key, value.join(','));
          break;
        case 'repeat':
        default:
          value.forEach(v => searchParams.append(key, String(v)));
      }
    } else {
      searchParams.set(key, String(value));
    }
  });

  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

/**
 * Parse query string to object
 * @param {string} queryString
 * @returns {Object}
 */
export function parseQueryString(queryString) {
  const clean = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const params = new URLSearchParams(clean);
  const obj = {};

  for (const key of params.keys()) {
    const values = params.getAll(key);

    // Handle bracket notation
    const cleanKey = key.replace(/\[\d*\]$/, '');
    if (cleanKey !== key) {
      obj[cleanKey] = obj[cleanKey] || [];
      obj[cleanKey].push(...values);
    } else {
      obj[key] = values.length > 1 ? values : values[0];
    }
  }

  return obj;
}
