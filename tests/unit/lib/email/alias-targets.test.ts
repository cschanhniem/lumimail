import { describe, it, expect } from "vitest";
import { expandAliasTargets } from "@/lib/email/alias-targets";

describe("expandAliasTargets", () => {
	it("routes a simple alias to its target mailbox", () => {
		expect(
			expandAliasTargets({ targetMailboxId: "mb_1", forwardTo: null, isGroup: false }, []),
		).toEqual([{ type: "mailbox", mailboxId: "mb_1" }]);
	});

	it("forwards a simple alias to an external address", () => {
		expect(
			expandAliasTargets({ targetMailboxId: null, forwardTo: "ext@example.com", isGroup: false }, []),
		).toEqual([{ type: "forward", address: "ext@example.com" }]);
	});

	it("prefers mailbox over forward when both are set on a simple alias", () => {
		expect(
			expandAliasTargets(
				{ targetMailboxId: "mb_1", forwardTo: "ext@example.com", isGroup: false },
				[],
			),
		).toEqual([{ type: "mailbox", mailboxId: "mb_1" }]);
	});

	it("returns no targets for an unconfigured simple alias", () => {
		expect(
			expandAliasTargets({ targetMailboxId: null, forwardTo: null, isGroup: false }, []),
		).toEqual([]);
	});

	it("trims and ignores blank forward addresses", () => {
		expect(
			expandAliasTargets({ targetMailboxId: null, forwardTo: "   ", isGroup: false }, []),
		).toEqual([]);
		expect(
			expandAliasTargets({ targetMailboxId: null, forwardTo: "  a@b.com ", isGroup: false }, []),
		).toEqual([{ type: "forward", address: "a@b.com" }]);
	});

	it("fans a group alias out to internal and external members", () => {
		const result = expandAliasTargets(
			{ targetMailboxId: null, forwardTo: null, isGroup: true },
			[
				{ mailboxId: "mb_1", email: null },
				{ mailboxId: null, email: "ext@example.com" },
				{ mailboxId: null, email: "  spaced@example.com  " },
			],
		);
		expect(result).toEqual([
			{ type: "mailbox", mailboxId: "mb_1" },
			{ type: "forward", address: "ext@example.com" },
			{ type: "forward", address: "spaced@example.com" },
		]);
	});

	it("skips members with neither mailbox nor email", () => {
		expect(
			expandAliasTargets({ targetMailboxId: null, forwardTo: null, isGroup: true }, [
				{ mailboxId: null, email: null },
				{ mailboxId: null, email: "  " },
				{ mailboxId: "mb_2", email: null },
			]),
		).toEqual([{ type: "mailbox", mailboxId: "mb_2" }]);
	});

	it("de-duplicates repeated mailbox and forward targets case-insensitively", () => {
		const result = expandAliasTargets(
			{ targetMailboxId: null, forwardTo: null, isGroup: true },
			[
				{ mailboxId: "mb_1", email: null },
				{ mailboxId: "mb_1", email: null },
				{ mailboxId: null, email: "Dup@Example.com" },
				{ mailboxId: null, email: "dup@example.com" },
			],
		);
		expect(result).toEqual([
			{ type: "mailbox", mailboxId: "mb_1" },
			{ type: "forward", address: "Dup@Example.com" },
		]);
	});

	it("returns no targets for an empty group", () => {
		expect(
			expandAliasTargets({ targetMailboxId: null, forwardTo: null, isGroup: true }, []),
		).toEqual([]);
	});
});
