import { eq } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { aliases, domains, mailboxes } from "@/db/schema";
import { guardOrgAdmin } from "@/lib/auth/org-guard";
import { apiSuccess, apiError } from "@/lib/api/response";
import { newId } from "@/lib/ids";
import { createAliasSchema } from "@/lib/validators";

export async function GET(request: Request) {
	const env = getEnv();
	const { orgUser, errorResponse } = await guardOrgAdmin(env, request);
	if (errorResponse) return errorResponse;

	const db = getDb(env);
	const rows = await db
		.select({
			id: aliases.id,
			localPart: aliases.localPart,
			forwardTo: aliases.forwardTo,
			isGroup: aliases.isGroup,
			targetMailboxId: aliases.targetMailboxId,
			domainId: aliases.domainId,
			domainHostname: domains.hostname,
			createdAt: aliases.createdAt,
		})
		.from(aliases)
		.innerJoin(domains, eq(aliases.domainId, domains.id))
		.where(eq(aliases.organizationId, orgUser.organizationId as string));

	return apiSuccess({ aliases: rows });
}

export async function POST(request: Request) {
	const env = getEnv();
	const { orgUser, errorResponse } = await guardOrgAdmin(env, request);
	if (errorResponse) return errorResponse;

	const parsed = createAliasSchema.safeParse(await request.json());
	if (!parsed.success) return apiError("Validation failed", 400, parsed.error.flatten());

	const db = getDb(env);
	const [domain] = await db
		.select()
		.from(domains)
		.where(eq(domains.id, parsed.data.domainId))
		.limit(1);

	if (!domain || domain.organizationId !== orgUser.organizationId) {
		return apiError("Domain not found", 404);
	}

	if (parsed.data.targetMailboxId) {
		const [mb] = await db
			.select()
			.from(mailboxes)
			.where(eq(mailboxes.id, parsed.data.targetMailboxId))
			.limit(1);
		if (!mb || mb.organizationId !== orgUser.organizationId) {
			return apiError("Mailbox not found", 404);
		}
	}

	const id = newId("alias");
	await db.insert(aliases).values({
		id,
		organizationId: orgUser.organizationId as string,
		domainId: parsed.data.domainId,
		localPart: parsed.data.localPart,
		targetMailboxId: parsed.data.targetMailboxId ?? null,
		forwardTo: parsed.data.forwardTo ?? null,
		isGroup: parsed.data.isGroup,
	});

	return apiSuccess({ id, ...parsed.data });
}
