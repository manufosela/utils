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
