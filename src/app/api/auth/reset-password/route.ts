import { eq, and } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { users, passwordResetTokens, sessions } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
  const env = getEnv();
  const body = await request.json() as Record<string, unknown>;
  const token = typeof body.token === "string" ? body.token.trim() : null;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : null;

  if (!token || !email || !newPassword || newPassword.length < 8) {
    return apiError("Invalid request", 400);
  }

  const db = getDb(env);
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) return apiError("Invalid or expired token", 400);

  const tokens = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.userId, user.id), eq(passwordResetTokens.used, false)));

  let validToken: typeof passwordResetTokens.$inferSelect | null = null;
  for (const t of tokens) {
    if (verifyPassword(token, t.tokenHash) && new Date() < t.expiresAt) {
      validToken = t;
      break;
    }
  }

  if (!validToken) return apiError("Invalid or expired token", 400);

  await db.update(users).set({ passwordHash: hashPassword(newPassword) }).where(eq(users.id, user.id));
  await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, validToken.id));
  await db.delete(sessions).where(eq(sessions.userId, user.id));

  return apiSuccess({ ok: true });
}
