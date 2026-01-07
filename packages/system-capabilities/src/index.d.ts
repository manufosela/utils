/**
 * Browser and system feature detection utility
 * @module @manufosela/system-capabilities
 */

/**
 * Browser information object
 */
export interface BrowserInfo {
  /** Browser name (Chrome, Firefox, Safari, Edge, etc.) */
  name: string;
  /** Browser version */
  version: string;
  /** Rendering engine (Blink, Gecko, WebKit) */
  engine: string;
  /** Operating system */
  os: string;
  /** OS version */
  osVersion: string;
  /** Whether it's a mobile browser */
  isMobile: boolean;
  /** Whether it appears to be a bot */
  isBot: boolean;
  /** Full user agent string */
  userAgent: string;
}

/**
 * System capabilities object
 */
export interface Capabilities {
  /** WebGL support */
  webgl: boolean;
  /** WebGL 2.0 support */
  webgl2: boolean;
  /** WebRTC support */
  webrtc: boolean;
  /** Service Worker support */
  serviceWorker: boolean;
  /** Push notifications support */
  pushNotifications: boolean;
  /** Notifications API support */
  notifications: boolean;
  /** Geolocation API support */
  geolocation: boolean;
  /** Touch events support */
  touch: boolean;
  /** Pointer Events support */
  pointerEvents: boolean;
  /** WebP image format support */
  webp: boolean;
  /** AVIF image format support */
  avif: boolean;
  /** WebM video format support */
  webm: boolean;
  /** IndexedDB support */
  indexedDB: boolean;
  /** localStorage support */
  localStorage: boolean;
  /** sessionStorage support */
  sessionStorage: boolean;
  /** Cookies enabled */
  cookies: boolean;
  /** Web Workers support */
  webWorkers: boolean;
  /** Shared Workers support */
  sharedWorkers: boolean;
  /** WebSockets support */
  websockets: boolean;
  /** Fetch API support */
  fetch: boolean;
  /** Web Crypto API support */
  crypto: boolean;
  /** Web Bluetooth API support */
  bluetooth: boolean;
  /** Web USB API support */
  usb: boolean;
  /** Web MIDI API support */
  midi: boolean;
  /** Gamepad API support */
  gamepad: boolean;
  /** Speech Recognition API support */
  speechRecognition: boolean;
  /** Speech Synthesis API support */
  speechSynthesis: boolean;
  /** Clipboard API support */
  clipboard: boolean;
  /** Web Share API support */
  share: boolean;
  /** Vibration API support */
  vibration: boolean;
  /** Battery Status API support */
  batteryStatus: boolean;
  /** Network Information API support */
  networkInfo: boolean;
  /** Device Orientation API support */
  deviceOrientation: boolean;
  /** Device Motion API support */
  deviceMotion: boolean;
  /** Fullscreen API support */
  fullscreen: boolean;
  /** Picture-in-Picture API support */
  pictureInPicture: boolean;
  /** Intersection Observer support */
  intersectionObserver: boolean;
  /** Resize Observer support */
  resizeObserver: boolean;
  /** Mutation Observer support */
  mutationObserver: boolean;
  /** Custom Elements support */
  customElements: boolean;
  /** Shadow DOM support */
  shadowDOM: boolean;
  /** ES Modules support */
  modules: boolean;
  /** Dynamic import support */
  dynamicImport: boolean;
  /** Web Animations API support */
  webAnimations: boolean;
  /** Canvas API support */
  canvas: boolean;
  /** OffscreenCanvas support */
  offscreenCanvas: boolean;
  /** MediaRecorder API support */
  mediaRecorder: boolean;
  /** Media Session API support */
  mediaSession: boolean;
  /** Screen Wake Lock API support */
  wakeLock: boolean;
}

/**
 * Network connection information
 */
export interface ConnectionInfo {
  /** Effective connection type (slow-2g, 2g, 3g, 4g) */
  effectiveType: string;
  /** Downlink speed in Mbps */
  downlink: number;
  /** Round-trip time in ms */
  rtt: number;
  /** Whether data saver is enabled */
  saveData: boolean;
  /** Connection type (wifi, cellular, etc.) */
  type: string;
}

/**
 * Screen information
 */
export interface ScreenInfo {
  /** Screen width in pixels */
  width: number;
  /** Screen height in pixels */
  height: number;
  /** Available width in pixels */
  availWidth: number;
  /** Available height in pixels */
  availHeight: number;
  /** Color depth in bits */
  colorDepth: number;
  /** Device pixel ratio */
  pixelRatio: number;
  /** Screen orientation */
  orientation: string;
}

/**
 * Gets browser information
 * @returns Browser and system information
 */
export function getBrowserInfo(): BrowserInfo;

/**
 * Gets all system capabilities (synchronous features only)
 * @returns Object containing capability detection results
 */
export function getCapabilitiesSync(): Partial<Capabilities>;

/**
 * Gets all system capabilities including async features
 * @returns Promise resolving to all capability detection results
 */
export function getCapabilities(): Promise<Capabilities>;

/**
 * Checks if a specific feature is supported
 * @param feature - The feature to check
 * @returns Whether the feature is supported (may be a Promise for async features)
 */
export function supports(feature: keyof Capabilities): boolean | Promise<boolean>;

/**
 * Gets device memory (if available)
 * @returns Device memory in GB or null if not available
 */
export function getDeviceMemory(): number | null;

/**
 * Gets hardware concurrency (number of CPU cores)
 * @returns Number of logical processors or null if not available
 */
export function getHardwareConcurrency(): number | null;

/**
 * Gets connection information
 * @returns Network information or null if not available
 */
export function getConnectionInfo(): ConnectionInfo | null;

/**
 * Gets screen information
 * @returns Screen dimensions and pixel ratio
 */
export function getScreenInfo(): ScreenInfo;

/**
 * Checks if the user prefers reduced motion
 * @returns Whether reduced motion is preferred
 */
export function prefersReducedMotion(): boolean;

/**
 * Checks if the user prefers dark color scheme
 * @returns Whether dark mode is preferred
 */
export function prefersDarkMode(): boolean;

/**
 * Checks if the browser is in standalone/PWA mode
 * @returns Whether running as a PWA
 */
export function isStandalone(): boolean;

declare const _default: {
  getBrowserInfo: typeof getBrowserInfo;
  getCapabilities: typeof getCapabilities;
  getCapabilitiesSync: typeof getCapabilitiesSync;
  supports: typeof supports;
  getDeviceMemory: typeof getDeviceMemory;
  getHardwareConcurrency: typeof getHardwareConcurrency;
  getConnectionInfo: typeof getConnectionInfo;
  getScreenInfo: typeof getScreenInfo;
  prefersReducedMotion: typeof prefersReducedMotion;
  prefersDarkMode: typeof prefersDarkMode;
  isStandalone: typeof isStandalone;
};

export default _default;
