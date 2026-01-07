export type ParamValue = string | number | boolean | null | undefined;
export type ParamsObject = Record<string, ParamValue | ParamValue[]>;

export interface UrlParamsOptions {
  /** Use hash instead of search params */
  useHash?: boolean;
  /** Automatically update browser URL */
  autoUpdate?: boolean;
  /** Array format (bracket, index, comma, repeat) */
  arrayFormat?: 'bracket' | 'index' | 'comma' | 'repeat';
}

export declare class UrlParams {
  constructor(url?: string | URL, options?: UrlParamsOptions);

  /**
   * Get a single parameter value
   * @param key - Parameter key
   * @param defaultValue - Default if not found
   */
  get(key: string, defaultValue?: string): string | null;

  /**
   * Get all values for a parameter (for arrays)
   * @param key - Parameter key
   */
  getAll(key: string): string[];

  /**
   * Get all parameters as object
   */
  getObject(): ParamsObject;

  /**
   * Set a parameter value
   * @param key - Parameter key
   * @param value - Parameter value
   */
  set(key: string, value: ParamValue): this;

  /**
   * Set multiple parameters
   * @param params - Object with key-value pairs
   */
  setAll(params: ParamsObject): this;

  /**
   * Append a value (for arrays)
   * @param key - Parameter key
   * @param value - Value to append
   */
  append(key: string, value: ParamValue): this;

  /**
   * Remove a parameter
   * @param key - Parameter key
   */
  remove(key: string): this;

  /**
   * Check if parameter exists
   * @param key - Parameter key
   */
  has(key: string): boolean;

  /**
   * Clear all parameters
   */
  clear(): this;

  /**
   * Get query string
   */
  toString(): string;

  /**
   * Get full URL
   */
  toURL(): string;

  /**
   * Apply changes to browser URL
   */
  apply(): void;
}

/**
 * Get a parameter from current URL
 */
export declare function getParam(key: string, defaultValue?: string): string | null;

/**
 * Get all parameters from current URL
 */
export declare function getParams(): ParamsObject;

/**
 * Set a parameter in current URL
 */
export declare function setParam(key: string, value: ParamValue): void;

/**
 * Set multiple parameters in current URL
 */
export declare function setParams(params: ParamsObject): void;

/**
 * Remove a parameter from current URL
 */
export declare function removeParam(key: string): void;

/**
 * Check if parameter exists in current URL
 */
export declare function hasParam(key: string): boolean;

/**
 * Convert object to query string
 */
export declare function toQueryString(params: ParamsObject, options?: UrlParamsOptions): string;

/**
 * Parse query string to object
 */
export declare function parseQueryString(queryString: string): ParamsObject;
