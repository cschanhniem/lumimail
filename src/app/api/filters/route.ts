import { eq } from "drizzle-orm";
import { z } from "zod";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { messageFilters } from "@/db/schema";
import { guardUser } from "@/lib/auth/cookies";
import { apiSuccess, apiError } from "@/lib/api/response";
import { newId } from "@/lib/ids";

const createFilterSchema = z.object({
	name: z.string().trim().min(1).max(100),
	fromContains: z.string().optional(),
	toContains: z.string().optional(),
	subjectContains: z.string().optional(),
	hasWords: z.string().optional(),
	actionStar: z.boolean().default(false),
	actionMarkRead: z.boolean().default(false),
	actionArchive: z.boolean().default(false),
	actionLabelId: z.string().optional(),
	actionMoveToTrash: z.boolean().default(false),
});

export async function GET(request: Request) {
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;

	const db = getDb(env);
	const rows = await db
		.select()
		.from(messageFilters)
		.where(eq(messageFilters.userId, user.id));

	return apiSuccess({ filters: rows });
}

export async function POST(request: Request) {
	const env = getEnv();
	const { user, errorResponse } = await guardUser(env, request);
	if (errorResponse) return errorResponse;

	const parsed = createFilterSchema.safeParse(await request.json());
	if (!parsed.success) return apiError("Validation failed", 400, parsed.error.flatten());

	const id = newId("filter");
	const db = getDb(env);
	await db.insert(messageFilters).values({
		id,
		userId: user.id,
		...parsed.data,
		fromContains: parsed.data.fromContains ?? null,
		toContains: parsed.data.toContains ?? null,
		subjectContains: parsed.data.subjectContains ?? null,
		hasWords: parsed.data.hasWords ?? null,
		actionLabelId: parsed.data.actionLabelId ?? null,
	});

	return apiSuccess({ id });
}
