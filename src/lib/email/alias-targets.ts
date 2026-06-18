/**
 * Pure expansion of an email alias into concrete delivery targets.
 *
 * Aliases come in two shapes:
 *  - Simple alias: routes to a single mailbox (`targetMailboxId`) or forwards
 *    to a single external address (`forwardTo`).
 *  - Group alias (`isGroup`): fans out to every group member. Members are
 *    resolved at the DB layer into either an internal mailbox id or an
 *    external email address before reaching this function.
 *
 * The DB/routing layer is responsible for I/O; this module only normalizes and
 * de-duplicates the resulting target list so it can be unit-tested in isolation.
 */

export type AliasDeliveryTarget =
	| { type: "mailbox"; mailboxId: string }
	| { type: "forward"; address: string };

export interface AliasInput {
	targetMailboxId: string | null;
	forwardTo: string | null;
	isGroup: boolean;
}

export interface GroupMemberInput {
	/** Resolved mailbox id for internal members (null for external). */
	mailboxId: string | null;
	/** External email address (null for internal members). */
	email: string | null;
}

function targetKey(target: AliasDeliveryTarget): string {
	return target.type === "mailbox"
		? `mailbox:${target.mailboxId}`
		: `forward:${target.address.toLowerCase()}`;
}

export function expandAliasTargets(
	alias: AliasInput,
	members: ReadonlyArray<GroupMemberInput>,
): AliasDeliveryTarget[] {
	const targets: AliasDeliveryTarget[] = [];

	if (alias.isGroup) {
		for (const member of members) {
			if (member.mailboxId) {
				targets.push({ type: "mailbox", mailboxId: member.mailboxId });
			} else if (member.email && member.email.trim()) {
				targets.push({ type: "forward", address: member.email.trim() });
			}
		}
	} else if (alias.targetMailboxId) {
		targets.push({ type: "mailbox", mailboxId: alias.targetMailboxId });
	} else if (alias.forwardTo && alias.forwardTo.trim()) {
		targets.push({ type: "forward", address: alias.forwardTo.trim() });
	}

	const seen = new Set<string>();
	return targets.filter((target) => {
		const key = targetKey(target);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
