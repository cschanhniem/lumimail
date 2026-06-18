import { eq, and } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { webhooks } from "@/db/schema";
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
	const [webhook] = await db
		.select()
		.from(webhooks)
		.where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id)))
		.limit(1);

	if (!webhook) return apiError("Webhook not found", 404);

	await db.delete(webhooks).where(eq(webhooks.id, id));
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
	const [webhook] = await db
		.select()
		.from(webhooks)
		.where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id)))
		.limit(1);

	if (!webhook) return apiError("Webhook not found", 404);

	const body = await request.json() as { enabled?: boolean };
	if (typeof body.enabled === "boolean") {
		await db.update(webhooks).set({ enabled: body.enabled }).where(eq(webhooks.id, id));
	}

	return apiSuccess({ ok: true });
}
