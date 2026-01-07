# @manufosela/local-storage-helper

A localStorage wrapper with TTL support, JSON serialization, and automatic expiration handling.

## Installation

```bash
npm install @manufosela/local-storage-helper
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
