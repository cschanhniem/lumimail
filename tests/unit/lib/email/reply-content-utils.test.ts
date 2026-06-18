import { describe, expect, it } from "vitest";
import {
	splitRepliedEmailContent,
	getLatestEmailContent,
	htmlToReadableText,
} from "@/lib/email/reply-content-utils";

describe("splitRepliedEmailContent", () => {
	it("returns only latestContent for plain text with no quotes", () => {
		const result = splitRepliedEmailContent("Hello, how are you?");
		expect(result.latestContent).toBe("Hello, how are you?");
		expect(result.quotedContent).toEqual([]);
	});

	it("returns empty latestContent for null input", () => {
		const result = splitRepliedEmailContent(null);
		expect(result.latestContent).toBe("");
		expect(result.quotedContent).toEqual([]);
	});

	it("detects '--- Original Message ---' separator", () => {
		const content = "Thanks!\n\n--- Original Message ---\nFrom: John\n\nOld content";
		const result = splitRepliedEmailContent(content);
		expect(result.latestContent).toBe("Thanks!");
		expect(result.quotedContent.length).toBeGreaterThan(0);
		expect(result.quotedContent[0].content).toContain("Old content");
	});

	it("detects underscore separator", () => {
		const content = "New reply\n________\nOld content";
		const result = splitRepliedEmailContent(content);
		expect(result.latestContent).toBe("New reply");
		expect(result.quotedContent.length).toBeGreaterThan(0);
	});

	it("detects 'On ... wrote:' pattern", () => {
		const content = "My reply\n\nOn Monday, John wrote:\n> Old content";
		const result = splitRepliedEmailContent(content);
		expect(result.latestContent).toBe("My reply");
		expect(result.quotedContent.length).toBe(1);
		expect(result.quotedContent[0].content).toContain("Old content");
	});

	it("detects inline quote prefix >", () => {
		const content = "My reply\n> Quoted text";
		const result = splitRepliedEmailContent(content);
		expect(result.latestContent).toBe("My reply");
		expect(result.quotedContent.length).toBe(1);
		expect(result.quotedContent[0].content).toBe("Quoted text");
	});

	it("strips multiple quote levels", () => {
		const content = "Reply\n>> Deeply quoted";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].content).toBe("Deeply quoted");
	});

	it("trims empty lines from latestContent", () => {
		const content = "\n\nHello\n\n--- Original Message ---\nOld";
		const result = splitRepliedEmailContent(content);
		expect(result.latestContent).toBe("Hello");
	});

	it("returns original message date from headers", () => {
		const content = "Reply\n--- Original Message ---\nDate: Mon, 1 Jan\n\nBody";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].dateLine).toBe("Mon, 1 Jan");
	});

	it("uses Sent header for dateLine when Date is missing", () => {
		const content = "Reply\n--- Original Message ---\nSent: Tue, 2 Feb\n\nBody";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].dateLine).toBe("Tue, 2 Feb");
	});

	it("handles blank line between header and content in original message", () => {
		const content = "Reply\n--- Original Message ---\nFrom: Jane\nDate: Wed\n\nBody";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].content).toBe("Body");
	});

	it("strips name/email suffix from wrote date line", () => {
		const content = "Reply\n\nOn Monday, January 1, 2026 at 10:30 AM, John Doe <john@example.com> wrote:\n> Old";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].dateLine).not.toContain("john@example.com");
		expect(result.quotedContent[0].dateLine).not.toContain("John Doe");
	});

	it("handles wrote line with AM/PM time suffix", () => {
		const content = "Reply\n\nOn Jan 1, 2026 at 2:00 PM, some text wrote:\n> Old";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].dateLine).not.toContain("some text");
	});

	it("handles wrote line with quoted name/email suffix", () => {
		const content = "Reply\n\nOn Tuesday, 'Jane' <jane@test.com> wrote:\n> Old";
		const result = splitRepliedEmailContent(content);
		expect(result.quotedContent[0].dateLine).not.toContain("jane@test.com");
	});
});

describe("getLatestEmailContent", () => {
	it("returns only the latest part of a reply chain", () => {
		const content = "My reply\n--- Original Message ---\nOld";
		expect(getLatestEmailContent(content)).toBe("My reply");
	});

	it("returns empty string for null input", () => {
		expect(getLatestEmailContent(null)).toBe("");
	});

	it("returns normalized content for plain text", () => {
		expect(getLatestEmailContent("Hello world")).toBe("Hello world");
	});
});

describe("htmlToReadableText", () => {
	it("converts <br> to newlines", () => {
		expect(htmlToReadableText("line1<br>line2")).toContain("\n");
	});

	it("strips HTML tags", () => {
		const result = htmlToReadableText("<p>Hello</p><div>World</div>");
		expect(result).not.toContain("<p>");
		expect(result).not.toContain("<div>");
		expect(result).toContain("Hello");
		expect(result).toContain("World");
	});

	it("decodes &nbsp;", () => {
		expect(htmlToReadableText("a&nbsp;b")).toBe("a b");
	});

	it("decodes &amp;", () => {
		expect(htmlToReadableText("a&amp;b")).toBe("a&b");
	});

	it("returns empty string for null input", () => {
		expect(htmlToReadableText(null)).toBe("");
	});

	it("returns empty string for undefined input", () => {
		expect(htmlToReadableText(undefined)).toBe("");
	});
});
