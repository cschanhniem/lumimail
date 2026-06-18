import { describe, expect, it } from "vitest";
import { newId } from "@/lib/ids";

describe("newId", () => {
	it("returns a non-empty id without a prefix", () => {
		const id = newId();
		expect(id).toBeTypeOf("string");
		expect(id.length).toBeGreaterThan(0);
	});

	it("prefixes the id with the given prefix and underscore separator", () => {
		const id = newId("t");
		expect(id.startsWith("t_")).toBe(true);
		const afterPrefix = id.slice(2);
		expect(afterPrefix.length).toBeGreaterThan(0);
	});

	it("prefixes the id with a longer prefix and underscore separator", () => {
		const id = newId("mbx");
		expect(id.startsWith("mbx_")).toBe(true);
		const afterPrefix = id.slice(4);
		expect(afterPrefix.length).toBeGreaterThan(0);
	});

	it("generates unique ids across calls", () => {
		const ids = new Set(Array.from({ length: 100 }, () => newId("d")));
		expect(ids.size).toBe(100);
	});
});
