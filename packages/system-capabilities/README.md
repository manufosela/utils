# @manufosela/system-capabilities

Browser and system feature detection utility. Detect browser capabilities, hardware specs, and user preferences with a simple API.

## Installation

```bash
npm install @manufosela/system-capabilities
```

## Usage

### Get Browser Information

```javascript
import { getBrowserInfo } from '@manufosela/system-capabilities';

const info = getBrowserInfo();
console.log(info.name);      // 'Chrome'
console.log(info.version);   // '120.0'
console.log(info.engine);    // 'Blink'
console.log(info.os);        // 'Windows'
console.log(info.isMobile);  // false
```

### Check Feature Support

```javascript
import { supports, getCapabilities, getCapabilitiesSync } from '@manufosela/system-capabilities';

// Synchronous check
if (supports('webgl')) {
  // Initialize WebGL
}

// Async features (returns Promise)
if (await supports('webp')) {
  // Use WebP images
}

// Get all capabilities (sync)
const syncCaps = getCapabilitiesSync();
console.log(syncCaps.serviceWorker); // true

// Get all capabilities including async (WebP, AVIF)
const allCaps = await getCapabilities();
console.log(allCaps.webp); // true
```

### System Information

```javascript
import {
  getDeviceMemory,
  getHardwareConcurrency,
  getScreenInfo,
  getConnectionInfo
} from '@manufosela/system-capabilities';

// Device memory (GB)
const memory = getDeviceMemory(); // 8 or null

// CPU cores
const cores = getHardwareConcurrency(); // 8 or null

// Screen info
const screen = getScreenInfo();
console.log(screen.width, screen.height);
console.log(screen.pixelRatio);

// Network connection
const connection = getConnectionInfo();
if (connection) {
  console.log(connection.effectiveType); // '4g'
  console.log(connection.downlink);      // 10.0 (Mbps)
}
```

### User Preferences

```javascript
import {
  prefersReducedMotion,
  prefersDarkMode,
  isStandalone
} from '@manufosela/system-capabilities';

if (prefersReducedMotion()) {
  // Disable animations
}

if (prefersDarkMode()) {
  // Apply dark theme
}

if (isStandalone()) {
  // Running as PWA
}
```

## API Reference

### getBrowserInfo()

Returns browser and OS information.

```typescript
interface BrowserInfo {
  name: string;      // Browser name
  version: string;   // Browser version
  engine: string;    // Rendering engine
  os: string;        // Operating system
  osVersion: string; // OS version
  isMobile: boolean; // Mobile browser
  isBot: boolean;    // Bot detection
  userAgent: string; // Full UA string
}
```

### getCapabilitiesSync()

Returns synchronous capability checks.

### getCapabilities()

Returns all capabilities including async checks (WebP, AVIF).

### supports(feature)

Check if a specific feature is supported.

- Returns `boolean` for sync features
- Returns `Promise<boolean>` for async features (webp, avif)

## Supported Capabilities

### Graphics
- `webgl` - WebGL support
- `webgl2` - WebGL 2.0 support
- `canvas` - Canvas API
- `offscreenCanvas` - OffscreenCanvas
- `webAnimations` - Web Animations API

### Communication
- `webrtc` - WebRTC
- `websockets` - WebSockets
- `fetch` - Fetch API

### Workers
- `serviceWorker` - Service Workers
- `webWorkers` - Web Workers
- `sharedWorkers` - Shared Workers

### Storage
- `indexedDB` - IndexedDB
- `localStorage` - localStorage
- `sessionStorage` - sessionStorage
- `cookies` - Cookies enabled

### Media
- `webp` - WebP format (async)
- `avif` - AVIF format (async)
- `webm` - WebM format
- `mediaRecorder` - MediaRecorder API
- `speechRecognition` - Speech Recognition
- `speechSynthesis` - Speech Synthesis

### Input
- `touch` - Touch events
- `pointerEvents` - Pointer Events
- `gamepad` - Gamepad API

### Device APIs
- `geolocation` - Geolocation
- `bluetooth` - Web Bluetooth
- `usb` - Web USB
- `midi` - Web MIDI
- `vibration` - Vibration API
- `batteryStatus` - Battery Status
- `networkInfo` - Network Information
- `deviceOrientation` - Device Orientation
- `deviceMotion` - Device Motion

### Display
- `fullscreen` - Fullscreen API
- `pictureInPicture` - Picture-in-Picture

### Observers
- `intersectionObserver` - Intersection Observer
- `resizeObserver` - Resize Observer
- `mutationObserver` - Mutation Observer

### Web Components
- `customElements` - Custom Elements
- `shadowDOM` - Shadow DOM

### Notifications
- `notifications` - Notifications API
- `pushNotifications` - Push Notifications

### Security
- `crypto` - Web Crypto API
- `clipboard` - Clipboard API
- `share` - Web Share API

## Browser Support

Works in all modern browsers. Feature detection gracefully handles missing APIs.

## License

MIT
