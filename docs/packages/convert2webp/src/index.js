/**
 * @fileoverview Image to WebP conversion utility using Canvas API
 * @module @manufosela/convert2webp
 * @author manufosela
 * @license MIT
 */

/**
 * @typedef {Object} ConvertOptions
 * @property {number} [quality=0.8] - Quality of the output WebP image (0 to 1)
 * @property {number} [maxWidth] - Maximum width for the output image
 * @property {number} [maxHeight] - Maximum height for the output image
 * @property {boolean} [preserveAspectRatio=true] - Whether to preserve aspect ratio when resizing
 */

/**
 * @typedef {Object} ConversionResult
 * @property {Blob} blob - The resulting WebP blob
 * @property {number} width - Width of the converted image
 * @property {number} height - Height of the converted image
 * @property {number} size - Size in bytes of the resulting blob
 * @property {string} type - MIME type of the result (image/webp)
 */

/**
 * Default options for WebP conversion
 * @type {ConvertOptions}
 */
const DEFAULT_OPTIONS = {
  quality: 0.8,
  preserveAspectRatio: true
};

/**
 * Creates an HTMLImageElement from a source
 * @private
 * @param {string|Blob|File} source - Image source
 * @returns {Promise<HTMLImageElement>} Loaded image element
 */
async function createImageFromSource(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Clean up object URL if we created one
      if (typeof source !== 'string') {
        URL.revokeObjectURL(img.src);
      }
      resolve(img);
    };

    img.onerror = () => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(img.src);
      }
      reject(new Error('Failed to load image'));
    };

    if (source instanceof Blob || source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else if (typeof source === 'string') {
      img.src = source;
    } else {
      reject(new Error('Invalid source type. Expected File, Blob, or URL string'));
    }
  });
}

/**
 * Calculates the output dimensions based on options
 * @private
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {ConvertOptions} options - Conversion options
 * @returns {{ width: number, height: number }} Calculated dimensions
 */
function calculateDimensions(originalWidth, originalHeight, options) {
  let width = originalWidth;
  let height = originalHeight;

  if (!options.maxWidth && !options.maxHeight) {
    return { width, height };
  }

  if (options.preserveAspectRatio !== false) {
    const aspectRatio = originalWidth / originalHeight;

    if (options.maxWidth && options.maxHeight) {
      // Fit within both constraints
      if (width > options.maxWidth) {
        width = options.maxWidth;
        height = width / aspectRatio;
      }
      if (height > options.maxHeight) {
        height = options.maxHeight;
        width = height * aspectRatio;
      }
    } else if (options.maxWidth && width > options.maxWidth) {
      width = options.maxWidth;
      height = width / aspectRatio;
    } else if (options.maxHeight && height > options.maxHeight) {
      height = options.maxHeight;
      width = height * aspectRatio;
    }
  } else {
    // Don't preserve aspect ratio
    if (options.maxWidth) {
      width = Math.min(width, options.maxWidth);
    }
    if (options.maxHeight) {
      height = Math.min(height, options.maxHeight);
    }
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  };
}

/**
 * Converts an image to WebP format using Canvas API
 * @param {File} file - The image file to convert
 * @param {number|ConvertOptions} [qualityOrOptions=0.8] - Quality (0-1) or options object
 * @returns {Promise<ConversionResult>} The conversion result with WebP blob
 * @throws {Error} If conversion fails or file is invalid
 * @example
 * // Simple usage with quality
 * const result = await convertToWebP(imageFile, 0.9);
 * console.log(result.blob, result.size);
 *
 * @example
 * // With options object
 * const result = await convertToWebP(imageFile, {
 *   quality: 0.85,
 *   maxWidth: 1920,
 *   maxHeight: 1080
 * });
 */
export async function convertToWebP(file, qualityOrOptions = 0.8) {
  if (!(file instanceof File)) {
    throw new Error('First argument must be a File object');
  }

  const options = typeof qualityOrOptions === 'number'
    ? { ...DEFAULT_OPTIONS, quality: qualityOrOptions }
    : { ...DEFAULT_OPTIONS, ...qualityOrOptions };

  // Validate quality
  if (options.quality < 0 || options.quality > 1) {
    throw new Error('Quality must be between 0 and 1');
  }

  return convertBlobToWebP(file, options);
}

/**
 * Converts a Blob to WebP format using Canvas API
 * @param {Blob} blob - The image blob to convert
 * @param {ConvertOptions} [options={}] - Conversion options
 * @returns {Promise<ConversionResult>} The conversion result with WebP blob
 * @throws {Error} If conversion fails or blob is invalid
 * @example
 * const result = await convertBlobToWebP(imageBlob, {
 *   quality: 0.9,
 *   maxWidth: 800
 * });
 *
 * // Use the resulting blob
 * const url = URL.createObjectURL(result.blob);
 */
export async function convertBlobToWebP(blob, options = {}) {
  if (!(blob instanceof Blob)) {
    throw new Error('First argument must be a Blob object');
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Validate quality
  if (mergedOptions.quality < 0 || mergedOptions.quality > 1) {
    throw new Error('Quality must be between 0 and 1');
  }

  // Load the image
  const img = await createImageFromSource(blob);

  // Calculate dimensions
  const dimensions = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    mergedOptions
  );

  // Create canvas and draw image
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  // Enable image smoothing for better quality when resizing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw the image
  ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

  // Convert to WebP blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (resultBlob) => {
        if (!resultBlob) {
          reject(new Error('Failed to convert canvas to WebP blob'));
          return;
        }

        resolve({
          blob: resultBlob,
          width: dimensions.width,
          height: dimensions.height,
          size: resultBlob.size,
          type: resultBlob.type
        });
      },
      'image/webp',
      mergedOptions.quality
    );
  });
}

/**
 * Converts an image URL to WebP format
 * @param {string} url - The URL of the image to convert
 * @param {ConvertOptions} [options={}] - Conversion options
 * @returns {Promise<ConversionResult>} The conversion result with WebP blob
 * @throws {Error} If conversion fails or URL is invalid
 * @example
 * const result = await convertUrlToWebP('https://example.com/image.png', {
 *   quality: 0.85,
 *   maxWidth: 1200
 * });
 */
export async function convertUrlToWebP(url, options = {}) {
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('URL must be a non-empty string');
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Validate quality
  if (mergedOptions.quality < 0 || mergedOptions.quality > 1) {
    throw new Error('Quality must be between 0 and 1');
  }

  // Load the image
  const img = await createImageFromSource(url);

  // Calculate dimensions
  const dimensions = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    mergedOptions
  );

  // Create canvas and draw image
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (resultBlob) => {
        if (!resultBlob) {
          reject(new Error('Failed to convert canvas to WebP blob'));
          return;
        }

        resolve({
          blob: resultBlob,
          width: dimensions.width,
          height: dimensions.height,
          size: resultBlob.size,
          type: resultBlob.type
        });
      },
      'image/webp',
      mergedOptions.quality
    );
  });
}

/**
 * Checks if WebP format is supported by the browser
 * @returns {Promise<boolean>} True if WebP is supported
 * @example
 * if (await isWebPSupported()) {
 *   const result = await convertToWebP(file);
 * }
 */
export async function isWebPSupported() {
  if (typeof document === 'undefined') {
    return false;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const dataUrl = canvas.toDataURL('image/webp');
  return dataUrl.startsWith('data:image/webp');
}

/**
 * Creates a download link for the converted WebP blob
 * @param {Blob} blob - The WebP blob to download
 * @param {string} [filename='converted.webp'] - The filename for download
 * @returns {string} The object URL for the blob (remember to revoke when done)
 * @example
 * const result = await convertToWebP(file);
 * const url = createDownloadUrl(result.blob, 'my-image.webp');
 *
 * // Create download link
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'my-image.webp';
 * a.click();
 *
 * // Clean up
 * URL.revokeObjectURL(url);
 */
export function createDownloadUrl(blob, filename = 'converted.webp') {
  if (!(blob instanceof Blob)) {
    throw new Error('First argument must be a Blob object');
  }
  return URL.createObjectURL(blob);
}

/**
 * Batch converts multiple files to WebP format
 * @param {File[]} files - Array of image files to convert
 * @param {ConvertOptions} [options={}] - Conversion options applied to all files
 * @param {function} [onProgress] - Progress callback (index, total, result)
 * @returns {Promise<ConversionResult[]>} Array of conversion results
 * @example
 * const results = await batchConvertToWebP(files, { quality: 0.8 }, (i, total) => {
 *   console.log(`Converting ${i + 1}/${total}`);
 * });
 */
export async function batchConvertToWebP(files, options = {}, onProgress) {
  if (!Array.isArray(files)) {
    throw new Error('First argument must be an array of File objects');
  }

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const result = await convertToWebP(files[i], options);
    results.push(result);

    if (typeof onProgress === 'function') {
      onProgress(i, files.length, result);
    }
  }

  return results;
}

export default {
  convertToWebP,
  convertBlobToWebP,
  convertUrlToWebP,
  isWebPSupported,
  createDownloadUrl,
  batchConvertToWebP
};
