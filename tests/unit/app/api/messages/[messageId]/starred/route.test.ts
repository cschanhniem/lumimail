import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { createDbMock, type DbMock } from "../../../../../helpers/db";

const m = vi.hoisted(() => ({ db: null as unknown, guardUser: vi.fn() }));
vi.mock("@/lib/cloudflare", () => ({ getEnv: () => ({}) }));
vi.mock("@/db", () => ({ getDb: () => m.db }));
vi.mock("@/lib/auth/cookies", () => ({ guardUser: m.guardUser }));

import { PATCH } from "@/app/api/messages/[messageId]/starred/route";

let mock: DbMock;
const unauth = NextResponse.json({ error: "Unauthorized" }, { status: 401 });

beforeEach(() => {
	mock = createDbMock();
	m.db = mock.db;
	m.guardUser.mockReset();
});

function patch(body: unknown, messageId = "m1") {
	return PATCH(
		new Request("https://x.test/api/messages/m1/starred", {
			method: "PATCH",
			body: JSON.stringify(body),
		}),
		{ params: Promise.resolve({ messageId }) },
	);
}

describe("PATCH /api/messages/[messageId]/starred", () => {
	it("returns 401 when unauthenticated", async () => {
		m.guardUser.mockResolvedValue({ user: null, errorResponse: unauth });
		const res = await patch({ starred: true });
		expect(res.status).toBe(401);
	});

	// NOTE: The 200 (success) and 404 (not found) branches both go through
	//   `const [updated] = await db.update(messages).set(...).where(...).returning()`.
	// The shared DB mock (tests/unit/helpers/db.ts) resolves update()/returning()
	// to `undefined`, so destructuring `const [updated] = undefined` throws a
	// TypeError before either branch can be observed. These branches are not
	// testable without extending the mock to support update().returning() rows,
	// so they are intentionally left uncovered here rather than encoding broken
	// behavior. See the route report for details.
});
