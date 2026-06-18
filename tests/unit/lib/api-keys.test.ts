import { describe, expect, it } from "vitest";
import { generateApiKey, parseScopes, scopesToJson, verifyApiKey } from "@/lib/api-keys";

describe("generateApiKey", () => {
	it("returns fullKey, prefix, and hash", () => {
		const result = generateApiKey();
		expect(result.fullKey).toBeTypeOf("string");
		expect(result.prefix).toBeTypeOf("string");
		expect(result.hash).toBeTypeOf("string");
	});

	it("prefixes the full key with ep_", () => {
		const result = generateApiKey();
		expect(result.fullKey.startsWith("ep_")).toBe(true);
	});

	it("extracts a 12-character prefix", () => {
		const result = generateApiKey();
		expect(result.prefix).toBe(result.fullKey.slice(0, 12));
	});

	it("produces a bcrypt hash that verifies against the full key", () => {
		const result = generateApiKey();
		expect(verifyApiKey(result.fullKey, result.hash)).toBe(true);
	});

	it("generates unique keys across calls", () => {
		const keys = new Set(Array.from({ length: 50 }, () => generateApiKey().fullKey));
		expect(keys.size).toBe(50);
	});

	it("generates unique prefixes across calls", () => {
		const prefixes = new Set(Array.from({ length: 50 }, () => generateApiKey().prefix));
		expect(prefixes.size).toBeGreaterThan(1);
	});
});

describe("verifyApiKey", () => {
	it("returns true for a matching key and hash", () => {
		const { fullKey, hash } = generateApiKey();
		expect(verifyApiKey(fullKey, hash)).toBe(true);
	});

	it("returns false for a wrong key", () => {
		const { hash } = generateApiKey();
		const wrongKey = "ep_wrong-key-value";
		expect(verifyApiKey(wrongKey, hash)).toBe(false);
	});

	it("returns false for an empty key", () => {
		const { hash } = generateApiKey();
		expect(verifyApiKey("", hash)).toBe(false);
	});
});

describe("parseScopes", () => {
	it("parses a valid JSON array of strings", () => {
		expect(parseScopes('["read","write"]')).toEqual(["read", "write"]);
	});

	it("returns an empty array for empty JSON array", () => {
		expect(parseScopes("[]")).toEqual([]);
	});

	it("returns an empty array for invalid JSON", () => {
		expect(parseScopes("{bad")).toEqual([]);
	});

	it("returns an empty array for non-array JSON", () => {
		expect(parseScopes('{"key":"value"}')).toEqual([]);
	});

	it("filters out non-string elements", () => {
		expect(parseScopes('["read", 123, true, "write"]')).toEqual(["read", "write"]);
	});
});

describe("scopesToJson", () => {
	it("serializes a string array to JSON", () => {
		expect(scopesToJson(["read", "write"])).toBe('["read","write"]');
	});

	it("serializes an empty array", () => {
		expect(scopesToJson([])).toBe("[]");
	});
});
