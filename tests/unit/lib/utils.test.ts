import { describe, expect, it } from "vitest";
import { slugify, parseAddress, cn } from "@/lib/utils";

describe("slugify", () => {
	it("lowercases and replaces spaces with hyphens", () => {
		expect(slugify("Hello World")).toBe("hello-world");
	});

	it("removes non-alphanumeric characters", () => {
		expect(slugify("Hello! @World #2024")).toBe("hello-world-2024");
	});

	it("trims leading and trailing hyphens", () => {
		expect(slugify("---hello---")).toBe("hello");
	});

	it("collapses multiple hyphens", () => {
		expect(slugify("hello   world")).toBe("hello-world");
	});

	it("returns empty string for input with no alphanumerics", () => {
		expect(slugify("!!!")).toBe("");
	});

	it("handles mixed case and unicode-like input", () => {
		expect(slugify("Café Münster")).toBe("caf-m-nster");
	});
});

describe("parseAddress", () => {
	it("parses a simple email address", () => {
		expect(parseAddress("user@example.com")).toEqual({
			local: "user",
			domain: "example.com",
		});
	});

	it("parses an address with display name and angle brackets", () => {
		expect(parseAddress("John Doe <john@example.com>")).toEqual({
			local: "john",
			domain: "example.com",
		});
	});

	it("lowercases both parts", () => {
		expect(parseAddress("User@Example.COM")).toEqual({
			local: "user",
			domain: "example.com",
		});
	});

	it("returns null for invalid input", () => {
		expect(parseAddress("not-an-email")).toBeNull();
	});

	it("returns null for empty string", () => {
		expect(parseAddress("")).toBeNull();
	});

	it("handles subdomains in the domain part", () => {
		expect(parseAddress("user@mail.example.com")).toEqual({
			local: "user",
			domain: "mail.example.com",
		});
	});

	it("trims whitespace from the address", () => {
		expect(parseAddress("  user@example.com  ")).toEqual({
			local: "user",
			domain: "example.com",
		});
	});

	it("returns null when text follows the angle-bracketed address", () => {
		expect(parseAddress("Some Name <name@example.com> extra")).toBeNull();
	});
});

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("px-4", "py-2")).toBe("px-4 py-2");
	});

	it("filters out falsy values", () => {
		expect(cn("px-4", false && "hidden", undefined, "py-2")).toBe("px-4 py-2");
	});

	it("resolves tailwind conflicts via twMerge", () => {
		expect(cn("px-4", "px-6")).toBe("px-6");
	});

	it("returns empty string for no inputs", () => {
		expect(cn()).toBe("");
	});
});
