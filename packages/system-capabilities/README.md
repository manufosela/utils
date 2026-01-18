# @manufosela/system-capabilities

Browser and system feature detection utility. Detect browser capabilities, hardware specs, and user preferences with a simple API.

## Installation

```bash
pnpm add @manufosela/system-capabilities
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

## Demo

`https://manufosela.github.io/utils/packages/system-capabilities/demo/`

## CodePen-ready example (HTML/CSS/JS)

<details>
<summary>View full snippet</summary>

```html
<div class="panel">
  <button id="scan">Scan capabilities</button>
  <pre id="output"></pre>
</div>
```

```css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #0c0f14;
  color: #f4f6fb;
}
.panel {
  background: #141923;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #262f3f;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #2b3445;
  background: #ff8a3d;
  color: #0c0f14;
  cursor: pointer;
}
pre {
  margin-top: 16px;
  background: #0f1420;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #262f3f;
  min-height: 160px;
}
```

```js
import { getBrowserInfo, getCapabilities, prefersDarkMode } from "https://esm.sh/@manufosela/system-capabilities";

const output = document.getElementById("output");
const scan = async () => {
  const info = getBrowserInfo();
  const caps = await getCapabilities();
  const data = {
    browser: `${info.name} ${info.version}`,
    os: `${info.os} ${info.osVersion || ""}`.trim(),
    prefersDark: prefersDarkMode(),
    webgl: caps.webgl,
    webp: caps.webp,
    serviceWorker: caps.serviceWorker,
  };
  output.textContent = JSON.stringify(data, null, 2);
};

document.getElementById("scan").addEventListener("click", scan);
scan();
```
</details>

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
