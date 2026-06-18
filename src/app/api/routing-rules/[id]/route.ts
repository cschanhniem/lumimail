import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getDb } from "@/db";
import { routingRules } from "@/db/schema";
import { guardUser } from "@/lib/auth/cookies";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const env = getEnv();
  const { user, errorResponse } = await guardUser(env, request);
  if (errorResponse) return errorResponse;
  if (!user.organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const db = getDb(env);
  const [rule] = await db
    .select()
    .from(routingRules)
    .where(and(eq(routingRules.id, id), eq(routingRules.organizationId, user.organizationId)))
    .limit(1);

  if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ rule });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const env = getEnv();
  const { user, errorResponse } = await guardUser(env, request);
  if (errorResponse) return errorResponse;
  if (!user.organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = await request.json() as Record<string, unknown>;
  const db = getDb(env);
  const [rule] = await db
    .select()
    .from(routingRules)
    .where(and(eq(routingRules.id, id), eq(routingRules.organizationId, user.organizationId)))
    .limit(1);

  if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const values: Record<string, unknown> = {};
  if (typeof body.action === "string") values.action = body.action;
  if (typeof body.priority === "number") values.priority = body.priority;
  if (typeof body.pattern === "string") values.pattern = body.pattern;
  if (typeof body.forwardTo === "string" || body.forwardTo === null) values.forwardTo = body.forwardTo;
  if (typeof body.mailboxId === "string" || body.mailboxId === null) values.mailboxId = body.mailboxId;

  if (Object.keys(values).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  await db.update(routingRules).set(values).where(eq(routingRules.id, id));

  const [updated] = await db.select().from(routingRules).where(eq(routingRules.id, id)).limit(1);
  return NextResponse.json({ rule: updated });
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const env = getEnv();
  const { user, errorResponse } = await guardUser(env, request);
  if (errorResponse) return errorResponse;
  if (!user.organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const db = getDb(env);
  const [rule] = await db
    .select()
    .from(routingRules)
    .where(and(eq(routingRules.id, id), eq(routingRules.organizationId, user.organizationId)))
    .limit(1);

  if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.delete(routingRules).where(eq(routingRules.id, id));
  return NextResponse.json({ ok: true });
}
