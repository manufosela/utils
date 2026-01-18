# @manufosela/local-storage-helper

A localStorage wrapper with TTL support, JSON serialization, and automatic expiration handling.

## Installation

```bash
pnpm add @manufosela/local-storage-helper
```

## Usage

### Basic Usage

```javascript
import { LocalStorageHelper } from '@manufosela/local-storage-helper';

const storage = new LocalStorageHelper();

// Set a value
storage.set('user', { name: 'John', email: 'john@example.com' });

// Get a value
const user = storage.get('user');
console.log(user.name); // 'John'

// Remove a value
storage.remove('user');
```

### With TTL (Time To Live)

```javascript
const storage = new LocalStorageHelper();

// Set with 1 hour TTL
storage.set('token', 'abc123', 60 * 60 * 1000);

// Value automatically expires after 1 hour
const token = storage.get('token'); // null after expiration
```

### With Prefix/Namespace

```javascript
import { createStorage } from '@manufosela/local-storage-helper';

// Create namespaced storage
const userStorage = createStorage('user');
const cacheStorage = createStorage('cache', { defaultTTL: 5 * 60 * 1000 });

userStorage.set('profile', { name: 'John' });
// Stored as: user_profile

cacheStorage.set('data', { results: [] });
// Stored as: cache_data (expires in 5 minutes)
```

### Default TTL

```javascript
const storage = new LocalStorageHelper({
  prefix: 'myapp_',
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours default
});

storage.set('data', { value: 1 }); // Uses default TTL
storage.set('permanent', { value: 2 }, 0); // Override: no expiration
```

### Session Storage

```javascript
const storage = new LocalStorageHelper({
  useSession: true, // Use sessionStorage instead
});
```

### Custom Storage

```javascript
const storage = new LocalStorageHelper({
  storage: myStorageAdapter,
});
```

## CodePen-ready example (HTML/CSS/JS)

<details>
<summary>View full snippet</summary>

```html
<div class="panel">
  <div class="row">
    <input id="key" placeholder="key" value="demo" />
    <input id="value" placeholder="value" value="hello" />
    <input id="ttl" type="number" placeholder="ttl ms" value="3000" />
  </div>
  <div class="row">
    <button id="setBtn">Set</button>
    <button id="getBtn">Get</button>
    <button id="removeBtn">Remove</button>
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
  margin-bottom: 12px;
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
  margin-top: 8px;
  background: #0f1420;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #262f3f;
  min-height: 120px;
}
```

```js
import { LocalStorageHelper } from "https://esm.sh/@manufosela/local-storage-helper";

const storage = new LocalStorageHelper({ prefix: "demo_" });
const logEl = document.getElementById("log");
const log = (msg) => {
  logEl.textContent = `${new Date().toLocaleTimeString()} ${msg}\\n` + logEl.textContent;
};

const getValue = () => ({
  key: document.getElementById("key").value,
  value: document.getElementById("value").value,
  ttl: Number(document.getElementById("ttl").value || 0),
});

document.getElementById("setBtn").addEventListener("click", () => {
  const { key, value, ttl } = getValue();
  storage.set(key, value, ttl);
  log(`set ${key} (${ttl}ms)`);
});

document.getElementById("getBtn").addEventListener("click", () => {
  const { key } = getValue();
  const value = storage.get(key);
  log(`get ${key} -> ${value}`);
});

document.getElementById("removeBtn").addEventListener("click", () => {
  const { key } = getValue();
  storage.remove(key);
  log(`remove ${key}`);
});
```
</details>

## API

### Constructor

```javascript
new LocalStorageHelper(options?)
```

| Option       | Type      | Default | Description                        |
| ------------ | --------- | ------- | ---------------------------------- |
| `prefix`     | `String`  | `''`    | Prefix for all keys                |
| `defaultTTL` | `Number`  | `0`     | Default TTL in ms (0 = no expiry)  |
| `useSession` | `Boolean` | `false` | Use sessionStorage instead         |
| `storage`    | `Storage` | -       | Custom storage implementation      |

## Demo

`https://manufosela.github.io/utils/packages/local-storage-helper/demo/`

### Methods

#### `set(key, value, ttl?)`

Store a value with optional TTL.

```javascript
storage.set('key', { any: 'value' });
storage.set('temp', 'data', 5000); // Expires in 5 seconds
```

#### `get(key, defaultValue?)`

Get a value. Returns `null` (or defaultValue) if expired or not found.

```javascript
const value = storage.get('key');
const value = storage.get('key', 'default');
```

#### `remove(key)`

Remove a value.

```javascript
storage.remove('key');
```

#### `has(key)`

Check if key exists and is not expired.

```javascript
if (storage.has('token')) {
  // Token exists and is valid
}
```

#### `clear()`

Remove all items with the configured prefix.

```javascript
storage.clear();
```

#### `keys()`

Get all keys with the configured prefix.

```javascript
const keys = storage.keys();
// ['user', 'settings', 'cache']
```

#### `getTTL(key)`

Get remaining TTL in milliseconds.

```javascript
const remaining = storage.getTTL('token');
// 3600000 (1 hour remaining)
```

#### `setTTL(key, ttl)`

Update TTL for existing key.

```javascript
storage.setTTL('token', 2 * 60 * 60 * 1000); // Extend to 2 hours
```

#### `getSize()`

Get storage size information.

```javascript
const { used, available, items } = storage.getSize();
console.log(`Using ${used} bytes, ${items} items`);
```

## Factory Function

### `createStorage(namespace, options?)`

Create a namespaced storage instance.

```javascript
import { createStorage } from '@manufosela/local-storage-helper';

const auth = createStorage('auth');
const cache = createStorage('cache', { defaultTTL: 300000 });
```

## Error Handling

The library handles common localStorage errors:

- **QuotaExceededError**: Automatically cleans expired items and retries
- **Invalid JSON**: Removes corrupted entries and returns default value

## TypeScript

TypeScript definitions are included:

```typescript
import { LocalStorageHelper, StorageItem } from '@manufosela/local-storage-helper';

interface User {
  id: number;
  name: string;
}

const storage = new LocalStorageHelper();
storage.set<User>('user', { id: 1, name: 'John' });
const user = storage.get<User>('user');
```

## License

MIT
