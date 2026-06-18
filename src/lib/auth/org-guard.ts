import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/cookies";

type OrgGuardResult =
  | { orgUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> & { role: string }; errorResponse: null }
  | { orgUser: null; errorResponse: NextResponse };

export async function guardOrgAdmin(env: CloudflareEnv, request?: Request): Promise<OrgGuardResult> {
  const user = await getCurrentUser(env, request);
  if (!user || !user.organizationId) return { orgUser: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!user.role || (user.role !== "owner" && user.role !== "admin")) {
    return { orgUser: null, errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { orgUser: { ...user, organizationId: user.organizationId, role: user.role }, errorResponse: null };
}

export async function guardOrgOwner(env: CloudflareEnv, request?: Request): Promise<OrgGuardResult> {
  const user = await getCurrentUser(env, request);
  if (!user || !user.organizationId) return { orgUser: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (user.role !== "owner") {
    return { orgUser: null, errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { orgUser: { ...user, organizationId: user.organizationId, role: user.role }, errorResponse: null };
}

export async function guardOrgUser(env: CloudflareEnv, request?: Request): Promise<OrgGuardResult> {
  const user = await getCurrentUser(env, request);
  if (!user || !user.organizationId) return { orgUser: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!user.role) return { orgUser: null, errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { orgUser: { ...user, organizationId: user.organizationId, role: user.role }, errorResponse: null };
}
