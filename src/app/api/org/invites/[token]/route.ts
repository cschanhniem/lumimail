import { eq, gt } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { orgInvites, organizations } from "@/db/schema";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const env = getEnv();
  const db = getDb(env);

  const [invite] = await db
    .select({
      id: orgInvites.id,
      email: orgInvites.email,
      role: orgInvites.role,
      expiresAt: orgInvites.expiresAt,
      organizationId: orgInvites.organizationId,
      orgName: organizations.name,
    })
    .from(orgInvites)
    .innerJoin(organizations, eq(orgInvites.organizationId, organizations.id))
    .where(eq(orgInvites.token, token))
    .limit(1);

  if (!invite) return apiError("Invite not found", 404);

  if (new Date(invite.expiresAt) < new Date()) {
    return apiError("Invite has expired", 410);
  }

  return apiSuccess({
    email: invite.email,
    orgName: invite.orgName,
    role: invite.role,
  });
}
