# @manufosela/debounce-throttle

Debounce, throttle, and rate-limit helpers for UI events and async workflows.

## Installation

```bash
pnpm add @manufosela/debounce-throttle
```

## Demo

Live demo: `https://manufosela.github.io/utils/packages/debounce-throttle/demo/`.

## Usage

```js
import { debounce, throttle, once, delay, defer, rateLimit } from '@manufosela/debounce-throttle';

const onInput = debounce((value) => {
  console.log('Search:', value);
}, 300);

const onScroll = throttle(() => {
  console.log('scroll');
}, 200);
```

## CodePen-ready example (HTML/CSS/JS)

<details>
<summary>View full snippet</summary>

```html
<div class="panel">
  <label>
    Debounced input (300ms)
    <input id="search" placeholder="Type to debounce..." />
  </label>
  <div class="row">
    <button id="throttleBtn">Throttled click (500ms)</button>
    <button id="rateBtn">Rate limit (2 per 2s)</button>
  </div>
  <pre id="log"></pre>
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
.row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
input,
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #2b3445;
  background: #101521;
  color: #f4f6fb;
}
button {
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
  min-height: 140px;
}
```

```js
import { debounce, throttle, rateLimit } from "https://esm.sh/@manufosela/debounce-throttle";

const logEl = document.getElementById("log");
const log = (msg) => {
  logEl.textContent = `${new Date().toLocaleTimeString()} ${msg}\\n` + logEl.textContent;
};

const onInput = debounce((value) => {
  log(`debounce: ${value}`);
}, 300);

document.getElementById("search").addEventListener("input", (e) => {
  onInput(e.target.value);
});

const onThrottle = throttle(() => {
  log("throttle: click");
}, 500);

document.getElementById("throttleBtn").addEventListener("click", onThrottle);

const onRate = rateLimit(() => {
  log("rateLimit: click");
}, 2, 2000);

document.getElementById("rateBtn").addEventListener("click", onRate);
```
</details>

## API

### debounce(fn, delay, options)

- `leading` (default: `false`)
- `trailing` (default: `true`)
- `maxWait` (optional)

### throttle(fn, limit, options)

- `leading` (default: `true`)
- `trailing` (default: `true`)

### once(fn)

Run only once and return the first result on subsequent calls.

### defer(fn, ...args)

Run at the end of the current call stack.

### delay(fn, wait, ...args)

Invoke after `wait` milliseconds. Returns the timeout id.

### rateLimit(fn, limit, period)

Allow at most `limit` calls per `period` milliseconds.

## License

MIT
