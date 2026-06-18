import { eq, and } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { newId } from "@/lib/ids";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
  const env = getEnv();
  const body = await request.json() as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  if (!email) return apiError("Email is required", 400);

  const db = getDb(env);
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user || !user.resetEmail) {
    return apiSuccess({ message: "If the account exists, a reset link has been sent." });
  }

  const token = newId("pwr");
  const tokenHash = hashPassword(token);

  await db.insert(passwordResetTokens).values({
    id: newId(),
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    used: false,
  });

  const origin = request.headers.get("origin") ?? "";
  const resetLink = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const devInfo = process.env.NODE_ENV !== "production" ? { resetLink } : {};

  return apiSuccess({ message: "If the account exists, a reset link has been sent.", ...devInfo });
}
