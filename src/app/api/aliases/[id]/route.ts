import { eq, and } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { aliases } from "@/db/schema";
import { guardOrgAdmin } from "@/lib/auth/org-guard";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const env = getEnv();
	const { orgUser, errorResponse } = await guardOrgAdmin(env, request);
	if (errorResponse) return errorResponse;

	const db = getDb(env);
	const [alias] = await db
		.select()
		.from(aliases)
		.where(and(eq(aliases.id, id), eq(aliases.organizationId, orgUser.organizationId as string)))
		.limit(1);

	if (!alias) return apiError("Alias not found", 404);

	await db.delete(aliases).where(eq(aliases.id, id));
	return apiSuccess({ ok: true });
}
