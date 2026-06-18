import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "@/lib/email/sanitize";

describe("sanitizeHtml", () => {
	it("returns null for empty/nullish input", () => {
		expect(sanitizeHtml(null)).toBeNull();
		expect(sanitizeHtml(undefined)).toBeNull();
		expect(sanitizeHtml("")).toBeNull();
	});

	it("preserves benign markup", () => {
		const out = sanitizeHtml("<p>hello <strong>world</strong></p>");
		expect(out).toContain("<p>");
		expect(out).toContain("hello");
		expect(out).toContain("world");
	});

	it("strips <script> elements", () => {
		const out = sanitizeHtml("<p>safe</p><script>alert(1)</script>") ?? "";
		expect(out).toContain("safe");
		expect(out.toLowerCase()).not.toContain("<script");
	});

	it("strips inline event handlers", () => {
		const out = sanitizeHtml('<img src="x" onerror="alert(1)">') ?? "";
		expect(out.toLowerCase()).not.toContain("onerror");
	});

	it("strips javascript: URLs", () => {
		const out = sanitizeHtml('<a href="javascript:alert(1)">link</a>') ?? "";
		expect(out.toLowerCase()).not.toContain("javascript:");
	});
});
