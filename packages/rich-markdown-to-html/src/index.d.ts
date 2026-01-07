/**
 * Markdown to HTML converter with rich features
 * @module @manufosela/rich-markdown-to-html
 */

/**
 * Parse options for markdown conversion
 */
export interface ParseOptions {
  /** Sanitize HTML output. Default: true */
  sanitize?: boolean;
  /** Convert line breaks to <br>. Default: false */
  breaks?: boolean;
  /** Auto-convert URLs to links. Default: true */
  linkify?: boolean;
  /** Enable typographic replacements. Default: false */
  typographer?: boolean;
  /** CSS class prefix for code blocks. Default: 'language-' */
  langPrefix?: string;
  /** Enable task list rendering. Default: true */
  taskLists?: boolean;
  /** Enable table rendering. Default: true */
  tables?: boolean;
  /** Enable syntax highlighting classes. Default: true */
  highlight?: boolean;
  /** Prefix for header IDs. Default: '' */
  headerIdPrefix?: string;
  /** Custom highlight function */
  highlightFn?: (code: string, lang: string) => string;
}

/**
 * Table of contents entry
 */
export interface TOCEntry {
  /** Heading level (1-6) */
  level: number;
  /** Heading text */
  text: string;
  /** Generated ID for linking */
  id: string;
}

/**
 * TOC generation options
 */
export interface TOCOptions {
  /** Maximum heading level to include. Default: 3 */
  maxLevel?: number;
  /** ID prefix for links. Default: '' */
  prefix?: string;
}

/**
 * Parses markdown text to HTML
 * @param markdown - Markdown text to parse
 * @param options - Parse options
 * @returns HTML output
 */
export function parse(markdown: string, options?: ParseOptions): string;

/**
 * Parses inline markdown (no block elements)
 * @param text - Inline markdown text
 * @param options - Parse options
 * @returns HTML output
 */
export function parseInline(text: string, options?: ParseOptions): string;

/**
 * Escapes HTML in text
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escape(text: string): string;

/**
 * Generates a table of contents from markdown
 * @param markdown - Markdown text
 * @param options - TOC generation options
 * @returns Array of TOC entries
 */
export function generateTOC(markdown: string, options?: TOCOptions): TOCEntry[];

/**
 * Renders table of contents as HTML
 * @param toc - TOC entries
 * @returns HTML list
 */
export function renderTOC(toc: TOCEntry[]): string;

declare const _default: {
  parse: typeof parse;
  parseInline: typeof parseInline;
  escape: typeof escape;
  generateTOC: typeof generateTOC;
  renderTOC: typeof renderTOC;
};

export default _default;
