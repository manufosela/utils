/**
 * @fileoverview Browser and system feature detection utility
 * @module @manufosela/system-capabilities
 * @author manufosela
 * @license MIT
 */

/**
 * @typedef {Object} BrowserInfo
 * @property {string} name - Browser name (Chrome, Firefox, Safari, Edge, etc.)
 * @property {string} version - Browser version
 * @property {string} engine - Rendering engine (Blink, Gecko, WebKit)
 * @property {string} os - Operating system
 * @property {string} osVersion - OS version
 * @property {boolean} isMobile - Whether it's a mobile browser
 * @property {boolean} isBot - Whether it appears to be a bot
 * @property {string} userAgent - Full user agent string
 */

/**
 * @typedef {Object} Capabilities
 * @property {boolean} webgl - WebGL support
 * @property {boolean} webgl2 - WebGL 2.0 support
 * @property {boolean} webrtc - WebRTC support
 * @property {boolean} serviceWorker - Service Worker support
 * @property {boolean} pushNotifications - Push notifications support
 * @property {boolean} notifications - Notifications API support
 * @property {boolean} geolocation - Geolocation API support
 * @property {boolean} touch - Touch events support
 * @property {boolean} pointerEvents - Pointer Events support
 * @property {boolean} webp - WebP image format support
 * @property {boolean} avif - AVIF image format support
 * @property {boolean} webm - WebM video format support
 * @property {boolean} indexedDB - IndexedDB support
 * @property {boolean} localStorage - localStorage support
 * @property {boolean} sessionStorage - sessionStorage support
 * @property {boolean} cookies - Cookies enabled
 * @property {boolean} webWorkers - Web Workers support
 * @property {boolean} sharedWorkers - Shared Workers support
 * @property {boolean} websockets - WebSockets support
 * @property {boolean} fetch - Fetch API support
 * @property {boolean} crypto - Web Crypto API support
 * @property {boolean} bluetooth - Web Bluetooth API support
 * @property {boolean} usb - Web USB API support
 * @property {boolean} midi - Web MIDI API support
 * @property {boolean} gamepad - Gamepad API support
 * @property {boolean} speechRecognition - Speech Recognition API support
 * @property {boolean} speechSynthesis - Speech Synthesis API support
 * @property {boolean} clipboard - Clipboard API support
 * @property {boolean} share - Web Share API support
 * @property {boolean} vibration - Vibration API support
 * @property {boolean} batteryStatus - Battery Status API support
 * @property {boolean} networkInfo - Network Information API support
 * @property {boolean} deviceOrientation - Device Orientation API support
 * @property {boolean} deviceMotion - Device Motion API support
 * @property {boolean} fullscreen - Fullscreen API support
 * @property {boolean} pictureInPicture - Picture-in-Picture API support
 * @property {boolean} intersectionObserver - Intersection Observer support
 * @property {boolean} resizeObserver - Resize Observer support
 * @property {boolean} mutationObserver - Mutation Observer support
 * @property {boolean} customElements - Custom Elements support
 * @property {boolean} shadowDOM - Shadow DOM support
 * @property {boolean} modules - ES Modules support
 * @property {boolean} dynamicImport - Dynamic import support
 * @property {boolean} webAnimations - Web Animations API support
 * @property {boolean} canvas - Canvas API support
 * @property {boolean} offscreenCanvas - OffscreenCanvas support
 * @property {boolean} mediaRecorder - MediaRecorder API support
 * @property {boolean} mediaSession - Media Session API support
 * @property {boolean} wakeLock - Screen Wake Lock API support
 */

/**
 * Detects WebGL support
 * @private
 * @returns {boolean} Whether WebGL is supported
 */
function detectWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Detects WebGL 2.0 support
 * @private
 * @returns {boolean} Whether WebGL 2.0 is supported
 */
function detectWebGL2() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (e) {
    return false;
  }
}

/**
 * Detects WebP image format support
 * @private
 * @returns {Promise<boolean>} Whether WebP is supported
 */
async function detectWebP() {
  if (typeof document === 'undefined') return false;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JYgCdAEO/hOMAAAD+e/v7e/v7QA=';
  });
}

/**
 * Detects AVIF image format support
 * @private
 * @returns {Promise<boolean>} Whether AVIF is supported
 */
async function detectAVIF() {
  if (typeof document === 'undefined') return false;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABhAQ0AIy';
  });
}

/**
 * Detects WebM video format support
 * @private
 * @returns {boolean} Whether WebM is supported
 */
function detectWebM() {
  if (typeof document === 'undefined') return false;
  const video = document.createElement('video');
  return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
}

/**
 * Detects cookie support
 * @private
 * @returns {boolean} Whether cookies are enabled
 */
function detectCookies() {
  if (typeof document === 'undefined') return false;
  try {
    document.cookie = '__test_cookie=1';
    const supported = document.cookie.indexOf('__test_cookie') !== -1;
    document.cookie = '__test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return supported;
  } catch (e) {
    return false;
  }
}

/**
 * Detects localStorage support
 * @private
 * @returns {boolean} Whether localStorage is supported
 */
function detectLocalStorage() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Detects sessionStorage support
 * @private
 * @returns {boolean} Whether sessionStorage is supported
 */
function detectSessionStorage() {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Parses user agent to extract browser information
 * @private
 * @param {string} ua - User agent string
 * @returns {BrowserInfo} Parsed browser information
 */
function parseUserAgent(ua) {
  const info = {
    name: 'Unknown',
    version: 'Unknown',
    engine: 'Unknown',
    os: 'Unknown',
    osVersion: 'Unknown',
    isMobile: false,
    isBot: false,
    userAgent: ua
  };

  if (!ua) return info;

  // Detect bots
  const botPatterns = /bot|crawler|spider|crawling|googlebot|bingbot|yandex/i;
  info.isBot = botPatterns.test(ua);

  // Detect mobile
  info.isMobile = /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua);

  // Detect browser
  if (/Edg\//.test(ua)) {
    info.name = 'Edge';
    info.version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown';
    info.engine = 'Blink';
  } else if (/OPR\//.test(ua) || /Opera/.test(ua)) {
    info.name = 'Opera';
    info.version = ua.match(/(?:OPR|Opera)\/(\d+\.\d+)/)?.[1] || 'Unknown';
    info.engine = 'Blink';
  } else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) {
    info.name = 'Chrome';
    info.version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
    info.engine = 'Blink';
  } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
    info.name = 'Safari';
    info.version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
    info.engine = 'WebKit';
  } else if (/Firefox\//.test(ua)) {
    info.name = 'Firefox';
    info.version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
    info.engine = 'Gecko';
  } else if (/MSIE|Trident/.test(ua)) {
    info.name = 'Internet Explorer';
    info.version = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || 'Unknown';
    info.engine = 'Trident';
  }

  // Detect OS
  if (/Windows NT 10/.test(ua)) {
    info.os = 'Windows';
    info.osVersion = '10';
  } else if (/Windows NT 6\.3/.test(ua)) {
    info.os = 'Windows';
    info.osVersion = '8.1';
  } else if (/Windows NT 6\.2/.test(ua)) {
    info.os = 'Windows';
    info.osVersion = '8';
  } else if (/Windows NT 6\.1/.test(ua)) {
    info.os = 'Windows';
    info.osVersion = '7';
  } else if (/Mac OS X/.test(ua)) {
    info.os = 'macOS';
    info.osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (/Android/.test(ua)) {
    info.os = 'Android';
    info.osVersion = ua.match(/Android (\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    info.os = 'iOS';
    info.osVersion = ua.match(/OS (\d+_\d+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (/Linux/.test(ua)) {
    info.os = 'Linux';
    info.osVersion = 'Unknown';
  }

  return info;
}

/**
 * Gets browser information
 * @returns {BrowserInfo} Browser and system information
 * @example
 * const browserInfo = getBrowserInfo();
 * console.log(browserInfo.name); // 'Chrome'
 * console.log(browserInfo.version); // '120.0'
 * console.log(browserInfo.isMobile); // false
 */
export function getBrowserInfo() {
  if (typeof navigator === 'undefined') {
    return parseUserAgent('');
  }
  return parseUserAgent(navigator.userAgent);
}

/**
 * Gets all system capabilities (synchronous features only)
 * @returns {Partial<Capabilities>} Object containing capability detection results
 * @example
 * const caps = getCapabilitiesSync();
 * console.log(caps.webgl); // true
 * console.log(caps.serviceWorker); // true
 */
export function getCapabilitiesSync() {
  const win = typeof window !== 'undefined' ? window : {};
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const doc = typeof document !== 'undefined' ? document : null;

  return {
    // Graphics
    webgl: detectWebGL(),
    webgl2: detectWebGL2(),
    canvas: !!doc && typeof doc.createElement === 'function' &&
      !!doc.createElement('canvas').getContext,
    offscreenCanvas: typeof OffscreenCanvas !== 'undefined',

    // Communication
    webrtc: !!(win.RTCPeerConnection || win.webkitRTCPeerConnection || win.mozRTCPeerConnection),
    websockets: 'WebSocket' in win,
    fetch: 'fetch' in win,

    // Workers
    serviceWorker: 'serviceWorker' in nav,
    webWorkers: 'Worker' in win,
    sharedWorkers: 'SharedWorker' in win,

    // Notifications
    pushNotifications: 'PushManager' in win,
    notifications: 'Notification' in win,

    // Location & Sensors
    geolocation: 'geolocation' in nav,
    deviceOrientation: 'DeviceOrientationEvent' in win,
    deviceMotion: 'DeviceMotionEvent' in win,

    // Input
    touch: 'ontouchstart' in win || nav.maxTouchPoints > 0,
    pointerEvents: 'PointerEvent' in win,
    gamepad: 'getGamepads' in nav,

    // Storage
    indexedDB: 'indexedDB' in win,
    localStorage: detectLocalStorage(),
    sessionStorage: detectSessionStorage(),
    cookies: detectCookies(),

    // Media
    webm: detectWebM(),
    mediaRecorder: 'MediaRecorder' in win,
    mediaSession: 'mediaSession' in nav,
    speechRecognition: 'SpeechRecognition' in win || 'webkitSpeechRecognition' in win,
    speechSynthesis: 'speechSynthesis' in win,

    // Device APIs
    bluetooth: 'bluetooth' in nav,
    usb: 'usb' in nav,
    midi: 'requestMIDIAccess' in nav,
    vibration: 'vibrate' in nav,
    batteryStatus: 'getBattery' in nav,
    networkInfo: 'connection' in nav,
    wakeLock: 'wakeLock' in nav,

    // Security & Crypto
    crypto: 'crypto' in win && 'subtle' in (win.crypto || {}),

    // Clipboard & Share
    clipboard: 'clipboard' in nav,
    share: 'share' in nav,

    // Display
    fullscreen: 'fullscreenEnabled' in (doc || {}) ||
      'webkitFullscreenEnabled' in (doc || {}),
    pictureInPicture: 'pictureInPictureEnabled' in (doc || {}),

    // Observers
    intersectionObserver: 'IntersectionObserver' in win,
    resizeObserver: 'ResizeObserver' in win,
    mutationObserver: 'MutationObserver' in win,

    // Web Components
    customElements: 'customElements' in win,
    shadowDOM: !!doc && 'attachShadow' in (doc.createElement('div') || {}),

    // ES Features
    modules: 'noModule' in (doc?.createElement('script') || {}),
    dynamicImport: typeof win.import === 'function' || true, // Usually supported if modules are

    // Animation
    webAnimations: 'animate' in (doc?.createElement('div') || {})
  };
}

/**
 * Gets all system capabilities including async features
 * @returns {Promise<Capabilities>} Promise resolving to all capability detection results
 * @example
 * const caps = await getCapabilities();
 * console.log(caps.webp); // true
 * console.log(caps.avif); // true
 */
export async function getCapabilities() {
  const syncCaps = getCapabilitiesSync();

  // Add async capabilities
  const [webp, avif] = await Promise.all([
    detectWebP(),
    detectAVIF()
  ]);

  return {
    ...syncCaps,
    webp,
    avif
  };
}

/**
 * Checks if a specific feature is supported
 * @param {keyof Capabilities} feature - The feature to check
 * @returns {boolean|Promise<boolean>} Whether the feature is supported
 * @example
 * if (supports('webgl')) {
 *   // Initialize WebGL
 * }
 *
 * // For async features
 * if (await supports('webp')) {
 *   // Use WebP images
 * }
 */
export function supports(feature) {
  const asyncFeatures = ['webp', 'avif'];

  if (asyncFeatures.includes(feature)) {
    if (feature === 'webp') return detectWebP();
    if (feature === 'avif') return detectAVIF();
  }

  const caps = getCapabilitiesSync();
  return caps[feature] ?? false;
}

/**
 * Gets device memory (if available)
 * @returns {number|null} Device memory in GB or null if not available
 * @example
 * const memory = getDeviceMemory();
 * if (memory && memory < 4) {
 *   // Load lighter assets
 * }
 */
export function getDeviceMemory() {
  if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
    return navigator.deviceMemory;
  }
  return null;
}

/**
 * Gets hardware concurrency (number of CPU cores)
 * @returns {number|null} Number of logical processors or null if not available
 * @example
 * const cores = getHardwareConcurrency();
 * if (cores && cores >= 4) {
 *   // Use more web workers
 * }
 */
export function getHardwareConcurrency() {
  if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator) {
    return navigator.hardwareConcurrency;
  }
  return null;
}

/**
 * Gets connection information
 * @returns {Object|null} Network information or null if not available
 * @example
 * const connection = getConnectionInfo();
 * if (connection?.effectiveType === '4g') {
 *   // Load high-quality assets
 * }
 */
export function getConnectionInfo() {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = navigator.connection;
    return {
      effectiveType: conn.effectiveType,
      downlink: conn.downlink,
      rtt: conn.rtt,
      saveData: conn.saveData,
      type: conn.type
    };
  }
  return null;
}

/**
 * Gets screen information
 * @returns {Object} Screen dimensions and pixel ratio
 * @example
 * const screen = getScreenInfo();
 * console.log(screen.width, screen.height);
 * console.log(screen.pixelRatio);
 */
export function getScreenInfo() {
  if (typeof window === 'undefined' || typeof screen === 'undefined') {
    return {
      width: 0,
      height: 0,
      availWidth: 0,
      availHeight: 0,
      colorDepth: 0,
      pixelRatio: 1,
      orientation: 'unknown'
    };
  }

  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    orientation: screen.orientation?.type || 'unknown'
  };
}

/**
 * Checks if the user prefers reduced motion
 * @returns {boolean} Whether reduced motion is preferred
 * @example
 * if (prefersReducedMotion()) {
 *   // Disable animations
 * }
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if the user prefers dark color scheme
 * @returns {boolean} Whether dark mode is preferred
 * @example
 * if (prefersDarkMode()) {
 *   // Apply dark theme
 * }
 */
export function prefersDarkMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Checks if the browser is in standalone/PWA mode
 * @returns {boolean} Whether running as a PWA
 */
export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
    navigator.standalone === true;
}

export default {
  getBrowserInfo,
  getCapabilities,
  getCapabilitiesSync,
  supports,
  getDeviceMemory,
  getHardwareConcurrency,
  getConnectionInfo,
  getScreenInfo,
  prefersReducedMotion,
  prefersDarkMode,
  isStandalone
};
