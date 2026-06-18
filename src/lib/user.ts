import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { messages, domains, mailboxes, users } from "@/db/schema";

export async function userHasMailboxes(env: CloudflareEnv, userId: string): Promise<boolean> {
	const db = getDb(env);
	const [user] = await db
		.select({ organizationId: users.organizationId })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);
	if (!user) return false;
	if (user.organizationId) {
		const [row] = await db
			.select({ id: mailboxes.id })
			.from(mailboxes)
			.where(eq(mailboxes.organizationId, user.organizationId))
			.limit(1);
		return !!row;
	}
	const [row] = await db
		.select({ id: mailboxes.id })
		.from(mailboxes)
		.where(eq(mailboxes.userId, userId))
		.limit(1);
	return !!row;
}

export function getPrimaryDomain(env: CloudflareEnv) {
	const db = getDb(env);
	return db.select().from(domains).limit(1).then(([row]) => row ?? null);
}

export function getPrimaryDomainForOrg(env: CloudflareEnv, organizationId: string) {
	const db = getDb(env);
	return db
		.select()
		.from(domains)
		.where(eq(domains.organizationId, organizationId))
		.limit(1)
		.then(([row]) => row ?? null);
}

export async function markMessageAsRead(env: CloudflareEnv, userId: string, messageId: string) {
	const db = getDb(env);
	const [message] = await db
		.select()
		.from(messages)
		.where(eq(messages.id, messageId))
		.limit(1);
	if (!message || message.userId !== userId) return false;
	await db
		.update(messages)
		.set({ read: true })
		.where(eq(messages.id, messageId));
	return true;
}

export async function updateMessageStatus(
	env: CloudflareEnv,
	userId: string,
	messageId: string,
	status: string,
) {
	const db = getDb(env);
	const [message] = await db
		.select()
		.from(messages)
		.where(eq(messages.id, messageId))
		.limit(1);
	if (!message || message.userId !== userId) return false;
	await db
		.update(messages)
		.set({ status })
		.where(eq(messages.id, messageId));
	return true;
}
