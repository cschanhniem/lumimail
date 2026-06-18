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
// linkedom's parseHTML() returns a window-like object that exposes `document`
// directly; depending on the build it may or may not also expose a
// self-referential `.window`. Handing DOMPurify an object without a usable
// `.document` makes it mark itself unsupported and silently return the input
// UNSANITIZED, so we pass the object that actually carries `document`.
const dom = parseHTML("<!DOCTYPE html><html><head></head><body></body></html>");
const purifyWindow = ((dom as { window?: unknown }).window ?? dom) as unknown as Window & typeof globalThis;
const DOMPurify = createDOMPurify(purifyWindow);

export function sanitizeHtml(html: string | null | undefined): string | null {
	if (!html) return null;
	return DOMPurify.sanitize(html);
}
