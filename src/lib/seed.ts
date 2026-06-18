import {
	ensureDemoDomain,
	ensureDemoMailboxes,
	ensureDemoUser,
	insertDemoMessages,
} from "@/lib/seed-utils";
import { ensureUserOrg } from "@/lib/migration/backfill-orgs";

/** Dev-only seed without Cloudflare API (domain must be onboarded separately). */
export async function seedDemoData(env: CloudflareEnv): Promise<{ messageCount: number }> {
	const user = await ensureDemoUser(env);
	await ensureUserOrg(env, user.id);
	const domain = await ensureDemoDomain(env, user.id);
	const mailboxMap = await ensureDemoMailboxes(env, user.id, domain.id);
	const messageCount = await insertDemoMessages(env, user.id, mailboxMap);

	return { messageCount };
}
