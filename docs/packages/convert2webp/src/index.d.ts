/**
 * Image to WebP conversion utility using Canvas API
 * @module @manufosela/convert2webp
 */

/**
 * Options for WebP conversion
 */
export interface ConvertOptions {
  /** Quality of the output WebP image (0 to 1). Default: 0.8 */
  quality?: number;
  /** Maximum width for the output image */
  maxWidth?: number;
  /** Maximum height for the output image */
  maxHeight?: number;
  /** Whether to preserve aspect ratio when resizing. Default: true */
  preserveAspectRatio?: boolean;
}

/**
 * Result of a WebP conversion
 */
export interface ConversionResult {
  /** The resulting WebP blob */
  blob: Blob;
  /** Width of the converted image */
  width: number;
  /** Height of the converted image */
  height: number;
  /** Size in bytes of the resulting blob */
  size: number;
  /** MIME type of the result (image/webp) */
  type: string;
}

/**
 * Converts an image File to WebP format using Canvas API
 * @param file - The image file to convert
 * @param qualityOrOptions - Quality (0-1) or options object
 * @returns Promise resolving to the conversion result with WebP blob
 * @throws Error if conversion fails or file is invalid
 */
export function convertToWebP(
  file: File,
  qualityOrOptions?: number | ConvertOptions
): Promise<ConversionResult>;

/**
 * Converts a Blob to WebP format using Canvas API
 * @param blob - The image blob to convert
 * @param options - Conversion options
 * @returns Promise resolving to the conversion result with WebP blob
 * @throws Error if conversion fails or blob is invalid
 */
export function convertBlobToWebP(
  blob: Blob,
  options?: ConvertOptions
): Promise<ConversionResult>;

/**
 * Converts an image URL to WebP format
 * @param url - The URL of the image to convert
 * @param options - Conversion options
 * @returns Promise resolving to the conversion result with WebP blob
 * @throws Error if conversion fails or URL is invalid
 */
export function convertUrlToWebP(
  url: string,
  options?: ConvertOptions
): Promise<ConversionResult>;

/**
 * Checks if WebP format is supported by the browser
 * @returns Promise resolving to true if WebP is supported
 */
export function isWebPSupported(): Promise<boolean>;

/**
 * Creates a download URL for the converted WebP blob
 * @param blob - The WebP blob to download
 * @param filename - The filename for download (default: 'converted.webp')
 * @returns The object URL for the blob
 */
export function createDownloadUrl(blob: Blob, filename?: string): string;

/**
 * Batch converts multiple files to WebP format
 * @param files - Array of image files to convert
 * @param options - Conversion options applied to all files
 * @param onProgress - Progress callback (index, total, result)
 * @returns Promise resolving to array of conversion results
 */
export function batchConvertToWebP(
  files: File[],
  options?: ConvertOptions,
  onProgress?: (index: number, total: number, result: ConversionResult) => void
): Promise<ConversionResult[]>;

declare const _default: {
  convertToWebP: typeof convertToWebP;
  convertBlobToWebP: typeof convertBlobToWebP;
  convertUrlToWebP: typeof convertUrlToWebP;
  isWebPSupported: typeof isWebPSupported;
  createDownloadUrl: typeof createDownloadUrl;
  batchConvertToWebP: typeof batchConvertToWebP;
};

export default _default;
