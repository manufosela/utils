export type EventCallback<T = unknown> = (data: T) => void;

export interface EventEmitterOptions {
  /** Maximum number of listeners per event (0 = unlimited) */
  maxListeners?: number;
  /** Enable wildcard event matching */
  wildcard?: boolean;
  /** Namespace delimiter */
  delimiter?: string;
}

export declare class EventEmitter {
  constructor(options?: EventEmitterOptions);

  /**
   * Register an event listener
   * @param event - Event name or pattern
   * @param callback - Event callback
   * @returns Unsubscribe function
   */
  on<T = unknown>(event: string, callback: EventCallback<T>): () => void;

  /**
   * Register a one-time event listener
   * @param event - Event name
   * @param callback - Event callback
   * @returns Unsubscribe function
   */
  once<T = unknown>(event: string, callback: EventCallback<T>): () => void;

  /**
   * Remove an event listener
   * @param event - Event name
   * @param callback - Event callback to remove
   */
  off<T = unknown>(event: string, callback: EventCallback<T>): void;

  /**
   * Emit an event
   * @param event - Event name
   * @param data - Event data
   */
  emit<T = unknown>(event: string, data?: T): void;

  /**
   * Remove all listeners for an event, or all events
   * @param event - Optional event name
   */
  removeAllListeners(event?: string): void;

  /**
   * Get listener count for an event
   * @param event - Event name
   */
  listenerCount(event: string): number;

  /**
   * Get all registered event names
   */
  eventNames(): string[];

  /**
   * Check if event has listeners
   * @param event - Event name
   */
  hasListeners(event: string): boolean;
}
