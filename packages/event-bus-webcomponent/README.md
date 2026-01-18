# @manufosela/event-bus-webcomponent

DOM CustomEvent bus for web components. Every event includes a source and a target envelope so consumers can route events reliably.

## Installation

```bash
pnpm add @manufosela/event-bus-webcomponent
```

## Envelope format

```js
{
  name: 'user:updated',
  detail: { id: 42 },
  source: { id: 'profile-card', type: 'user-card' },
  target: { id: 'ALL', type: 'ALL-TYPES', excludeSource: false }
}
```

- `source.id` and `source.type` are required.
- `target.id` can be a specific id or `ALL`.
- `target.type` can be a specific type or `ALL-TYPES`.
- `target.excludeSource` skips delivering the event to the emitting component.

## Usage

```js
import { WebComponentEventBus, ALL, ALL_TYPES } from '@manufosela/event-bus-webcomponent';

const bus = new WebComponentEventBus();

const component = { id: 'profile-card', type: 'user-card' };

bus.on(component, (envelope) => {
  console.log('received', envelope);
});

bus.emit({
  name: 'user:updated',
  detail: { id: 42 },
  source: { id: 'settings-panel', type: 'settings' },
  target: { id: 'profile-card', type: 'user-card' },
});

// Broadcast to all
bus.emit({
  name: 'theme:changed',
  detail: { theme: 'dark' },
  source: { id: 'theme-toggle', type: 'theme-toggle' },
  target: { id: ALL, type: ALL_TYPES, excludeSource: true },
});
```

## CodePen-ready example (HTML/CSS/JS)

<details>
<summary>View full snippet</summary>

```html
<div class="row">
  <button id="sendA">Send to A</button>
  <button id="sendAll">Broadcast</button>
</div>
<pre id="log"></pre>
```

```css
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #0c0f14;
  color: #f4f6fb;
}
button {
  margin-right: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #262f3f;
  background: #ff8a3d;
  color: #0c0f14;
  cursor: pointer;
}
pre {
  margin-top: 16px;
  background: #141923;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #262f3f;
}
```

```js
import { WebComponentEventBus, ALL, ALL_TYPES } from "https://esm.sh/@manufosela/event-bus-webcomponent";

const log = (msg) => {
  const el = document.getElementById("log");
  el.textContent = `${new Date().toLocaleTimeString()} ${msg}\\n` + el.textContent;
};

const bus = new WebComponentEventBus();
const componentA = { id: "a", type: "demo-card" };
const componentB = { id: "b", type: "demo-card" };

bus.on(componentA, (envelope) => log(`A received: ${envelope.name}`));
bus.on(componentB, (envelope) => log(`B received: ${envelope.name}`));

document.getElementById("sendA").addEventListener("click", () => {
  bus.emit({
    name: "ping",
    detail: { ts: Date.now() },
    source: { id: "sender", type: "controls" },
    target: { id: "a", type: "demo-card" },
  });
});

document.getElementById("sendAll").addEventListener("click", () => {
  bus.emit({
    name: "broadcast",
    detail: { ts: Date.now() },
    source: { id: "sender", type: "controls" },
    target: { id: ALL, type: ALL_TYPES, excludeSource: true },
  });
});
```
</details>

## DOM CustomEvent integration

Events are dispatched as `CustomEvent` on the root (default: `document`).

```js
const bus = new WebComponentEventBus({ root: document, eventName: 'wc-bus' });

document.addEventListener('wc-bus', (event) => {
  console.log('raw event', event.detail);
});
```

## Demo

`https://manufosela.github.io/utils/packages/event-bus-webcomponent/demo/`

## API

### WebComponentEventBus

- `new WebComponentEventBus({ root?, eventName? })`
- `emit({ name, detail, source, target })`
- `on(componentRef, handler, { name? })` -> returns unsubscribe
- `once(componentRef, handler, { name? })` -> returns unsubscribe

### Helpers

- `createComponentRef(elementOrRef)`
- `createEnvelope({ name, detail, source, target })`
- `matchesTarget(target, componentRef)`
- `normalizeTarget(target)`

## License

MIT
