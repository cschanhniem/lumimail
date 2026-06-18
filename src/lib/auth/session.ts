import { eq, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { newId } from "@/lib/ids";
import { getDb } from "@/db";
import { sessions, users, organizationMembers } from "@/db/schema";

export const SESSION_COOKIE = "ep_session";
const SESSION_DAYS = 30;

export function generateSessionToken(): string {
	return newId("sess");
}

export function hashSessionToken(token: string): string {
	return bcrypt.hashSync(token, 10);
}

export function verifySessionToken(token: string, hash: string): boolean {
	return bcrypt.compareSync(token, hash);
}

export async function createSession(env: CloudflareEnv, userId: string): Promise<string> {
	const db = getDb(env);
	const [user] = await db.select({ organizationId: users.organizationId }).from(users).where(eq(users.id, userId)).limit(1);
	const token = generateSessionToken();
	const tokenHash = hashSessionToken(token);
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

	await db.insert(sessions).values({
		id: newId(),
		userId,
		tokenHash,
		expiresAt,
		organizationId: user?.organizationId ?? null,
	});

	return token;
}

export type SessionUser = typeof users.$inferSelect & { role?: string | null };

export async function getUserFromSession(
	env: CloudflareEnv,
	token: string | undefined,
): Promise<SessionUser | null> {
	if (!token) return null;
	const db = getDb(env);
	const rows = await db.select().from(sessions).where(gt(sessions.expiresAt, new Date()));
	for (const row of rows) {
		if (verifySessionToken(token, row.tokenHash)) {
			const [user] = await db.select().from(users).where(eq(users.id, row.userId)).limit(1);
			if (!user) return null;
			if (user.organizationId) {
				const [membership] = await db
					.select({ role: organizationMembers.role })
					.from(organizationMembers)
					.where(eq(organizationMembers.userId, user.id))
					.limit(1);
				return { ...user, role: membership?.role ?? null };
			}
			return user;
		}
	}
	return null;
}

export async function deleteSession(env: CloudflareEnv, token: string): Promise<void> {
	const db = getDb(env);
	const rows = await db.select().from(sessions).where(gt(sessions.expiresAt, new Date()));
	for (const row of rows) {
		if (verifySessionToken(token, row.tokenHash)) {
			await db.delete(sessions).where(eq(sessions.id, row.id));
		}
	}
}
