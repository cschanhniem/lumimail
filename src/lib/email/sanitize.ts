import createDOMPurify from "dompurify";
import { parseHTML } from "linkedom";

/**
 * Server-side HTML sanitizer.
 *
 * `dompurify` needs a DOM. On the Cloudflare Workers runtime there is no global
 * `window`/`document`, so the previous `isomorphic-dompurify` dependency threw
 * at import (its jsdom/browser builds assume a DOM). `linkedom` provides a
 * pure-JS DOM that runs on Workers, which we hand to DOMPurify once at module
 * load. Browser code uses the native `window` via `dompurify` directly and does
 * not import this module.
 */
const { window } = parseHTML("<!DOCTYPE html><html><body></body></html>");
const DOMPurify = createDOMPurify(window as unknown as Window & typeof globalThis);

export function sanitizeHtml(html: string | null | undefined): string | null {
	if (!html) return null;
	return DOMPurify.sanitize(html);
}
