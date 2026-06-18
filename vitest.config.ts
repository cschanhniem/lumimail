import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Unit/integration test runner config.
 *
 * Coverage is enforced at 100% (lines, functions, statements, branches) on the
 * files listed in `coverage.include`. The protocol target is 100% across all of
 * `src/`; we grow the include list as modules gain tests rather than lowering the
 * threshold. See docs/tests/README.md for the expansion process.
 *
 * E2E tests live in tests/e2e and run under Playwright, not Vitest — they are
 * excluded here.
 */
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "node",
		globals: true,
		// Some unit tests exercise bcrypt hashing in tight loops (see
		// tests/unit/lib/api-keys.test.ts). bcrypt.hashSync at cost 10 is ~100ms
		// per call, so batches can exceed the 5s default on slower CI runners.
		testTimeout: 30000,
		include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
		exclude: ["tests/e2e/**", "node_modules/**"],
		setupFiles: [],
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			reportsDirectory: "./coverage",
			include: [
				"src/lib/validators.ts",
				"src/lib/ids.ts",
				"src/app/utils.ts",
				"src/lib/utils.ts",
				"src/lib/api-keys.ts",
				"src/lib/dns-status.ts",
				"src/lib/email/address.ts",
				"src/lib/email/reply-content-utils.ts",
				"src/lib/email/alias-targets.ts",
				"src/lib/email/providers/index.ts",
				"src/lib/email/providers/cloudflare.ts",
				"src/lib/email/providers/resend.ts",
				"src/lib/api/response.ts",
				"src/lib/cloudflare-api-utils.ts",
				"src/lib/contacts/utils.ts",
				"src/lib/domains/utils.ts",
				"src/lib/auth/password.ts",
				"src/lib/rate-limit.ts",
				"src/lib/cloudflare.ts",
				"src/lib/email/parse.ts",
				"src/lib/user.ts",
				"src/lib/contacts/service.ts",
				"src/lib/migration/backfill-orgs.ts",
				"src/lib/seed.ts",
				"src/lib/domains/service.ts",
				"src/lib/domains/provision.ts",
				"src/lib/domains/cloudflare-cleanup.ts",
				"src/lib/auth/session.ts",
				"src/lib/auth/cookies.ts",
				"src/lib/auth/org-guard.ts",
				"src/lib/auth/client.ts",
				"src/lib/api/auth.ts",
				"src/lib/email/send.ts",
				"src/lib/email/webhooks.ts",
				"src/lib/email/routing.ts",
				"src/lib/email/inbound.ts",
				"src/app/api/api-keys/route.ts",
				"src/lib/cloudflare-api.ts",
			],
			thresholds: {
				lines: 100,
				functions: 100,
				statements: 100,
				branches: 100,
			},
		},
	},
});
