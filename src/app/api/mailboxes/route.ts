import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { domains, mailboxes } from "@/db/schema";
import { guardUser } from "@/lib/auth/cookies";
import { newId } from "@/lib/ids";
import { mailboxSchema } from "@/lib/validators";
import { ensureEmailRoutingRuleToWorker } from "@/lib/cloudflare-api";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(request: Request) {
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;
	if (!user.organizationId) return apiError("No organization", 400);
	const db = getDb(env);
	const rows = await db
		.select({
			id: mailboxes.id,
			userId: mailboxes.userId,
			domainId: mailboxes.domainId,
			localPart: mailboxes.localPart,
			displayName: mailboxes.displayName,
			createdAt: mailboxes.createdAt,
			hostname: domains.hostname,
		})
		.from(mailboxes)
		.innerJoin(domains, eq(mailboxes.domainId, domains.id))
		.where(eq(mailboxes.organizationId, user.organizationId!));
	return NextResponse.json({
		mailboxes: rows.map((row) => ({
			...row,
			isPrimary: `${row.localPart}@${row.hostname}` === user.email,
		})),
	});
}

export async function POST(request: Request) {
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;
	const parsed = mailboxSchema.safeParse(await request.json());
	if (!parsed.success) return apiError("Validation failed", 400, parsed.error.flatten());

	const db = getDb(env);
	const [domain] = await db
		.select()
		.from(domains)
		.where(eq(domains.id, parsed.data.domainId))
		.limit(1);
	if (!domain || domain.organizationId !== user.organizationId) {
		return apiError("Domain not found", 404);
	}

	const localPart = parsed.data.localPart.toLowerCase();
	const [existing] = await db
		.select()
		.from(mailboxes)
		.where(and(eq(mailboxes.domainId, domain.id), eq(mailboxes.localPart, localPart)))
		.limit(1);
	if (existing) return apiError("Mailbox already exists", 409);

	const address = `${localPart}@${domain.hostname}`;
	try {
		await ensureEmailRoutingRuleToWorker(env, domain.zoneId, address);
	} catch {
		return apiError("Failed to create Cloudflare routing rule", 502);
	}

	const id = newId("mbx");
	await db.insert(mailboxes).values({
		id,
		userId: user.id,
		organizationId: user.organizationId!,
		domainId: parsed.data.domainId,
		localPart,
		displayName: parsed.data.displayName,
	});

	return apiSuccess({ id, address });
}
