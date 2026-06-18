import { describe, expect, it } from "vitest";
import { summariseDns, type DnsStatusSummary } from "@/lib/dns-status";

function makeRecord(type: string): { type: string } {
	return { type };
}

describe("summariseDns", () => {
	it("reports routing as configured when records present and none missing", () => {
		const result = summariseDns(
			[makeRecord("MX"), makeRecord("TXT")],
			[],
			[],
		);
		expect(result.routing.configured).toBe(true);
		expect(result.routing.missing).toEqual([]);
	});

	it("reports routing as not configured when all records missing", () => {
		const result = summariseDns([], [makeRecord("MX")], []);
		expect(result.routing.configured).toBe(false);
		expect(result.routing.missing).toContain("MX");
	});

	it("reports routing as not configured when no routing records at all", () => {
		const result = summariseDns([], [], []);
		expect(result.routing.configured).toBe(false);
	});

	it("reports sending as configured when records present", () => {
		const result = summariseDns([], [], [makeRecord("TXT"), makeRecord("MX")]);
		expect(result.sending.configured).toBe(true);
		expect(result.sending.records).toContain("TXT");
		expect(result.sending.records).toContain("MX");
	});

	it("reports sending as not configured when no records", () => {
		const result = summariseDns([], [], []);
		expect(result.sending.configured).toBe(false);
		expect(result.sending.records).toEqual([]);
	});

	it("deduplicates record types in missing and records lists", () => {
		const result = summariseDns(
			[makeRecord("MX")],
			[makeRecord("MX"), makeRecord("MX")],
			[makeRecord("TXT"), makeRecord("TXT")],
		);
		expect(result.routing.missing).toEqual(["MX"]);
		expect(result.sending.records).toEqual(["TXT"]);
	});

	it("filters out records with null types", () => {
		const result = summariseDns(
			[makeRecord("MX"), { type: null } as never],
			[],
			[],
		);
		expect(result.routing.missing).toEqual([]);
	});
});
