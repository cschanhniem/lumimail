import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`API ${status}: ${message}`, details);
  }
  return NextResponse.json({ success: false, error: { message } }, { status });
}
