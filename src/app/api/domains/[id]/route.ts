import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { domains } from "@/db/schema";
import { guardUser } from "@/lib/auth/cookies";
import { getDomainForUser, removeDomainForUser } from "@/lib/domains/service";
import { apiSuccess, apiError } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
	const { id } = await params;
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;
	if (!user.organizationId) return apiError("No organization", 400);
	const domain = await getDomainForUser(env, user.organizationId, id);
	if (!domain) return apiError("Not found", 404);
	return apiSuccess({ domain });
}

export async function PATCH(request: Request, { params }: Params) {
	const { id } = await params;
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;
	if (!user.organizationId) return apiError("No organization", 400);

	const domain = await getDomainForUser(env, user.organizationId, id);
	if (!domain) return apiError("Not found", 404);

	const body = await request.json() as Record<string, unknown>;
	const db = getDb(env);
	const values: Record<string, unknown> = {};

	if (typeof body.routingEnabled === "boolean") values.routingEnabled = body.routingEnabled;
	if (typeof body.sendingEnabled === "boolean") values.sendingEnabled = body.sendingEnabled;

	if (Object.keys(values).length === 0) {
		return apiError("No valid fields to update", 400);
	}

	await db.update(domains).set(values).where(eq(domains.id, id));
	const [updated] = await db.select().from(domains).where(eq(domains.id, id)).limit(1);
	return apiSuccess({ domain: updated });
}

export async function DELETE(request: Request, { params }: Params) {
	const { id } = await params;
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;
	try {
		await removeDomainForUser(env, user.organizationId!, id);
		return apiSuccess({ ok: true });
	} catch {
		return apiError("Failed to remove domain", 400);
	}
}
