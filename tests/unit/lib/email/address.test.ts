import { describe, expect, it } from "vitest";
import {
	formatEmailAddress,
	getMailboxAddress,
	parseEmailAddressParts,
	getEmailAddress,
	normalizeEmailAddress,
	getEmailDisplayName,
	formatPostalAddress,
	formatPostalAddressList,
} from "@/lib/email/address";

describe("getMailboxAddress", () => {
	it("formats a mailbox into an email address", () => {
		expect(getMailboxAddress({ localPart: "hello", hostname: "example.com" })).toBe("hello@example.com");
	});

	it("handles subdomains", () => {
		expect(getMailboxAddress({ localPart: "support", hostname: "mail.example.com" })).toBe("support@mail.example.com");
	});
});

describe("formatEmailAddress", () => {
	it("returns just the address when no name", () => {
		expect(formatEmailAddress("user@example.com")).toBe("user@example.com");
	});

	it("returns just the address when name is null", () => {
		expect(formatEmailAddress("user@example.com", null)).toBe("user@example.com");
	});

	it("returns just the address when name is empty string", () => {
		expect(formatEmailAddress("user@example.com", "")).toBe("user@example.com");
	});

	it("formats with a display name", () => {
		expect(formatEmailAddress("user@example.com", "John")).toBe('"John" <user@example.com>');
	});

	it("escapes double quotes in display name", () => {
		expect(formatEmailAddress("user@example.com", 'Jo"hn')).toBe(
			'"Jo\\"hn" <user@example.com>',
		);
	});

	it("trims whitespace from name and address", () => {
		expect(formatEmailAddress("  user@example.com  ", "  John  ")).toBe(
			'"John" <user@example.com>',
		);
	});
});

describe("parseEmailAddressParts", () => {
	it("parses address with quoted name", () => {
		expect(parseEmailAddressParts('"John Doe" <john@example.com>')).toEqual({
			name: "John Doe",
			address: "john@example.com",
		});
	});

	it("parses address with unquoted name", () => {
		expect(parseEmailAddressParts("John Doe <john@example.com>")).toEqual({
			name: "John Doe",
			address: "john@example.com",
		});
	});

	it("parses bare address", () => {
		expect(parseEmailAddressParts("john@example.com")).toEqual({
			name: null,
			address: "john@example.com",
		});
	});

	it("handles whitespace around bare address", () => {
		expect(parseEmailAddressParts("  john@example.com  ")).toEqual({
			name: null,
			address: "john@example.com",
		});
	});

	it("returns null name when quoted name is only whitespace", () => {
		const result = parseEmailAddressParts('" " <john@example.com>');
		expect(result.name).toBeNull();
		expect(result.address).toBe("john@example.com");
	});

	it("returns null name and full string as address for empty quoted name", () => {
		const result = parseEmailAddressParts('"" <john@example.com>');
		expect(result.name).toBeNull();
		expect(result.address).toBe('"" <john@example.com>');
	});
});

describe("getEmailAddress", () => {
	it("extracts address from formatted string", () => {
		expect(getEmailAddress("John <john@example.com>")).toBe("john@example.com");
	});

	it("returns bare address unchanged", () => {
		expect(getEmailAddress("john@example.com")).toBe("john@example.com");
	});
});

describe("normalizeEmailAddress", () => {
	it("lowercases the address part", () => {
		expect(normalizeEmailAddress("John <John@Example.COM>")).toBe("john@example.com");
	});

	it("lowercases bare address", () => {
		expect(normalizeEmailAddress("User@Example.COM")).toBe("user@example.com");
	});
});

describe("getEmailDisplayName", () => {
	it("returns the display name when present", () => {
		expect(getEmailDisplayName("John Doe <john@example.com>")).toBe("John Doe");
	});

	it("returns quoted display name", () => {
		expect(getEmailDisplayName('"John Doe" <john@example.com>')).toBe("John Doe");
	});

	it("falls back to local part when no name and address is parseable", () => {
		expect(getEmailDisplayName("john@example.com")).toBe("john");
	});

	it("falls back to the full address when address cannot be parsed", () => {
		expect(getEmailDisplayName("notanemail")).toBe("notanemail");
	});
});

describe("formatPostalAddress", () => {
	it("returns formatted address from a postal-mime mailbox", () => {
		const address = { name: "John", address: "john@example.com" };
		expect(formatPostalAddress(address, "fallback")).toBe(
			'"John" <john@example.com>',
		);
	});

	it("returns fallback when address is undefined", () => {
		expect(formatPostalAddress(undefined, "fallback")).toBe("fallback");
	});

	it("returns fallback when address has no address property", () => {
		expect(formatPostalAddress({} as never, "fallback")).toBe("fallback");
	});

	it("handles group address by taking the first mailbox", () => {
		const address = { group: [{ name: "A", address: "a@test.com" }, { name: "B", address: "b@test.com" }] };
		expect(formatPostalAddress(address as never, "fallback")).toBe('"A" <a@test.com>');
	});
});

describe("formatPostalAddressList", () => {
	it("formats the first valid address from a list", () => {
		const addresses = [{ address: "a@test.com" }, { address: "b@test.com" }];
		expect(formatPostalAddressList(addresses as never, "fallback")).toBe("a@test.com");
	});

	it("returns fallback for empty array", () => {
		expect(formatPostalAddressList([], "fallback")).toBe("fallback");
	});

	it("returns fallback when no address has an address property", () => {
		expect(formatPostalAddressList([{} as never], "fallback")).toBe("fallback");
	});

	it("returns fallback for undefined", () => {
		expect(formatPostalAddressList(undefined, "fallback")).toBe("fallback");
	});
});
