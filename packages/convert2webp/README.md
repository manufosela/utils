# @manufosela/convert2webp

Image to WebP conversion utility using Canvas API. Convert images to WebP format directly in the browser with support for quality control, resizing, and batch processing.

## Installation

```bash
pnpm add @manufosela/convert2webp
```

## Usage

### Basic Conversion

```javascript
import { convertToWebP } from '@manufosela/convert2webp';

// From file input
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await convertToWebP(file, 0.8);

  console.log('Converted:', result.blob);
  console.log('Size:', result.size, 'bytes');
  console.log('Dimensions:', result.width, 'x', result.height);
});
```

### With Options

```javascript
import { convertToWebP } from '@manufosela/convert2webp';

const result = await convertToWebP(file, {
  quality: 0.85,
  maxWidth: 1920,
  maxHeight: 1080,
  preserveAspectRatio: true
});
```

### Convert Blob

```javascript
import { convertBlobToWebP } from '@manufosela/convert2webp';

const blob = await fetch('image.png').then(r => r.blob());
const result = await convertBlobToWebP(blob, {
  quality: 0.9,
  maxWidth: 800
});
```

### Convert from URL

```javascript
import { convertUrlToWebP } from '@manufosela/convert2webp';

const result = await convertUrlToWebP('https://example.com/image.png', {
  quality: 0.85
});
```

### Batch Conversion

```javascript
import { batchConvertToWebP } from '@manufosela/convert2webp';

const files = Array.from(fileInput.files);
const results = await batchConvertToWebP(files, { quality: 0.8 }, (index, total, result) => {
  console.log(`Converted ${index + 1}/${total}`);
});
```

### Check WebP Support

```javascript
import { isWebPSupported } from '@manufosela/convert2webp';

if (await isWebPSupported()) {
  // Proceed with conversion
}
```

### Create Download URL

```javascript
import { convertToWebP, createDownloadUrl } from '@manufosela/convert2webp';

const result = await convertToWebP(file);
const url = createDownloadUrl(result.blob, 'converted.webp');

// Create download link
const a = document.createElement('a');
a.href = url;
a.download = 'converted.webp';
a.click();

// Remember to clean up
URL.revokeObjectURL(url);
```

## Demo

`https://manufosela.github.io/utils/packages/convert2webp/demo/`

## API Reference

### convertToWebP(file, qualityOrOptions?)

Converts a File to WebP format.

| Parameter | Type | Description |
|-----------|------|-------------|
| file | `File` | The image file to convert |
| qualityOrOptions | `number \| ConvertOptions` | Quality (0-1) or options object |

Returns: `Promise<ConversionResult>`

### convertBlobToWebP(blob, options?)

Converts a Blob to WebP format.

| Parameter | Type | Description |
|-----------|------|-------------|
| blob | `Blob` | The image blob to convert |
| options | `ConvertOptions` | Conversion options |

Returns: `Promise<ConversionResult>`

### convertUrlToWebP(url, options?)

Converts an image URL to WebP format.

| Parameter | Type | Description |
|-----------|------|-------------|
| url | `string` | The URL of the image |
| options | `ConvertOptions` | Conversion options |

Returns: `Promise<ConversionResult>`

### batchConvertToWebP(files, options?, onProgress?)

Batch converts multiple files.

| Parameter | Type | Description |
|-----------|------|-------------|
| files | `File[]` | Array of image files |
| options | `ConvertOptions` | Conversion options |
| onProgress | `Function` | Progress callback |

Returns: `Promise<ConversionResult[]>`

### isWebPSupported()

Checks if WebP is supported by the browser.

Returns: `Promise<boolean>`

### createDownloadUrl(blob, filename?)

Creates an object URL for downloading.

| Parameter | Type | Description |
|-----------|------|-------------|
| blob | `Blob` | The WebP blob |
| filename | `string` | Optional filename |

Returns: `string`

## Types

### ConvertOptions

```typescript
interface ConvertOptions {
  quality?: number;           // 0-1, default: 0.8
  maxWidth?: number;          // Maximum output width
  maxHeight?: number;         // Maximum output height
  preserveAspectRatio?: boolean; // default: true
}
```

### ConversionResult

```typescript
interface ConversionResult {
  blob: Blob;      // The WebP blob
  width: number;   // Output width
  height: number;  // Output height
  size: number;    // Size in bytes
  type: string;    // MIME type (image/webp)
}
```

## Browser Support

Works in all modern browsers that support:
- Canvas API
- `canvas.toBlob()` with WebP format
- File and Blob APIs

## License

MIT
