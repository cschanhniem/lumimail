import { eq, and } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { messageFilters } from "@/db/schema";
import { guardUser } from "@/lib/auth/cookies";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;

	const db = getDb(env);
	const [filter] = await db
		.select()
		.from(messageFilters)
		.where(and(eq(messageFilters.id, id), eq(messageFilters.userId, user.id)))
		.limit(1);

	if (!filter) return apiError("Filter not found", 404);

	await db.delete(messageFilters).where(eq(messageFilters.id, id));
	return apiSuccess({ ok: true });
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;

	const db = getDb(env);
	const [filter] = await db
		.select()
		.from(messageFilters)
		.where(and(eq(messageFilters.id, id), eq(messageFilters.userId, user.id)))
		.limit(1);

	if (!filter) return apiError("Filter not found", 404);

	const body = await request.json() as { enabled?: boolean };
	if (typeof body.enabled === "boolean") {
		await db.update(messageFilters).set({ enabled: body.enabled }).where(eq(messageFilters.id, id));
	}

	return apiSuccess({ ok: true });
}
