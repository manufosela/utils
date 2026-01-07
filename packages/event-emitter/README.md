# @manufosela/event-emitter

A lightweight pub/sub event emitter with namespaced events support.

## Installation

```bash
npm install @manufosela/event-emitter
```

## Usage

### Basic Usage

```javascript
import { EventEmitter } from '@manufosela/event-emitter';

const emitter = new EventEmitter();

// Subscribe to an event
const unsubscribe = emitter.on('message', (data) => {
  console.log('Received:', data);
});

// Emit an event
emitter.emit('message', { text: 'Hello!' });

// Unsubscribe
unsubscribe();
```

### Namespaced Events

```javascript
const emitter = new EventEmitter();

// Subscribe to namespaced events
emitter.on('user:login', (user) => console.log('Login:', user));
emitter.on('user:logout', (user) => console.log('Logout:', user));

emitter.emit('user:login', { id: 1, name: 'John' });
```

### One-time Listeners

```javascript
// Listen only once
emitter.once('init', () => {
  console.log('Initialized!');
});

emitter.emit('init'); // Logs: Initialized!
emitter.emit('init'); // Nothing happens
```

### Wildcard Events

```javascript
const emitter = new EventEmitter({ wildcard: true });

// * matches single segment
emitter.on('user:*', (data) => {
  console.log('User event:', data);
});

// ** matches any segments
emitter.on('**', (data) => {
  console.log('Any event:', data);
});

emitter.emit('user:login', { name: 'John' }); // Both listeners fire
emitter.emit('system:ready', {}); // Only ** listener fires
```

## API

### Constructor

```javascript
new EventEmitter(options?)
```

| Option         | Type      | Default | Description                           |
| -------------- | --------- | ------- | ------------------------------------- |
| `maxListeners` | `Number`  | `0`     | Max listeners per event (0 = unlimited)|
| `wildcard`     | `Boolean` | `false` | Enable wildcard event matching        |
| `delimiter`    | `String`  | `':'`   | Namespace delimiter                   |

### Methods

#### `on(event, callback)`

Register an event listener. Returns an unsubscribe function.

```javascript
const unsubscribe = emitter.on('event', callback);
unsubscribe(); // Remove listener
```

#### `once(event, callback)`

Register a one-time listener. Automatically removed after first call.

```javascript
emitter.once('ready', () => console.log('Ready!'));
```

#### `off(event, callback)`

Remove a specific event listener.

```javascript
emitter.off('event', callback);
```

#### `emit(event, data?)`

Emit an event with optional data.

```javascript
emitter.emit('user:update', { id: 1, name: 'Jane' });
```

#### `removeAllListeners(event?)`

Remove all listeners for an event, or all events if no argument.

```javascript
emitter.removeAllListeners('user:*'); // Remove specific event
emitter.removeAllListeners(); // Remove all
```

#### `listenerCount(event)`

Get the number of listeners for an event.

```javascript
const count = emitter.listenerCount('message');
```

#### `eventNames()`

Get all registered event names.

```javascript
const events = emitter.eventNames();
// ['user:login', 'user:logout', 'message']
```

#### `hasListeners(event)`

Check if an event has any listeners.

```javascript
if (emitter.hasListeners('message')) {
  emitter.emit('message', data);
}
```

## TypeScript

TypeScript definitions are included:

```typescript
import { EventEmitter, EventCallback } from '@manufosela/event-emitter';

interface UserData {
  id: number;
  name: string;
}

const emitter = new EventEmitter();

emitter.on<UserData>('user:login', (user) => {
  console.log(user.name); // TypeScript knows user has name
});
```

## License

MIT
