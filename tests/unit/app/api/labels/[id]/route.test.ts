import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { createDbMock, type DbMock } from "../../../../helpers/db";

const m = vi.hoisted(() => ({ db: null as unknown, guardUser: vi.fn() }));
vi.mock("@/lib/cloudflare", () => ({ getEnv: () => ({}) }));
vi.mock("@/db", () => ({ getDb: () => m.db }));
vi.mock("@/lib/auth/cookies", () => ({ guardUser: m.guardUser }));

import { PATCH, DELETE } from "@/app/api/labels/[id]/route";

let mock: DbMock;
const unauth = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const params = (id = "lbl_1") => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
	mock = createDbMock();
	m.db = mock.db;
	m.guardUser.mockReset();
});

function req(body?: unknown, raw?: string) {
	return new Request("https://x.test/api/labels/lbl_1", {
		method: "PATCH",
		body: raw !== undefined ? raw : body === undefined ? undefined : JSON.stringify(body),
	});
}

describe("PATCH /api/labels/[id]", () => {
	it("returns 401 when unauthenticated", async () => {
		m.guardUser.mockResolvedValue({ errorResponse: unauth });
		const res = await PATCH(req({ name: "X" }), params());
		expect(res.status).toBe(401);
	});

	it("returns 400 for invalid JSON", async () => {
		m.guardUser.mockResolvedValue({ user: { id: "u1" } });
		const res = await PATCH(req(undefined, "bad"), params());
		expect(res.status).toBe(400);
		expect((await res.json()) as any).toEqual({ success: false, error: { message: "Invalid JSON" } });
	});

	it("returns 400 for an invalid body", async () => {
		m.guardUser.mockResolvedValue({ user: { id: "u1" } });
		const res = await PATCH(req({ color: "nothex" }), params());
		expect(res.status).toBe(400);
	});

	// NOTE: the 404 branch (existing == undefined) cannot be exercised through
	// the shared db mock: `.get()` is a chainable no-op and an awaited select
	// chain always resolves to the queued array (never a single undefined row),
	// so `if (!existing)` is unreachable here. This is a harness limitation, not
	// a route bug — under real D1, `.get()` returns a row|undefined. Skipped.

	it("updates an existing label", async () => {
		m.guardUser.mockResolvedValue({ user: { id: "u1" } });
		mock.queueSelect([{ id: "lbl_1", userId: "u1" }]); // existing
		mock.queueSelect([{ id: "lbl_1", name: "New" }]); // updated returning
		const res = await PATCH(req({ name: "New" }), params());
		expect(res.status).toBe(200);
		expect((await res.json()) as any).toEqual({ success: true, data: { id: "lbl_1", name: "New" } });
		expect(mock.updates[0].set).toEqual({ name: "New" });
	});
});

describe("DELETE /api/labels/[id]", () => {
	it("returns 401 when unauthenticated", async () => {
		m.guardUser.mockResolvedValue({ errorResponse: unauth });
		const res = await DELETE(req(), params());
		expect(res.status).toBe(401);
	});

	// 404 branch unreachable through the mock — see PATCH note above.

	it("deletes an existing label", async () => {
		m.guardUser.mockResolvedValue({ user: { id: "u1" } });
		mock.queueSelect([{ id: "lbl_1", userId: "u1" }]);
		const res = await DELETE(req(), params());
		expect(res.status).toBe(200);
		expect((await res.json()) as any).toEqual({ success: true, data: { id: "lbl_1" } });
		expect(mock.deletes.length).toBe(1);
	});
});
