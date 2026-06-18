import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "as-needed",
});

const MUTATION_METHODS = new Set(["POST", "PATCH", "DELETE", "PUT"]);

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith("/api/v1/")) {
    return intlMiddleware(request);
  }

  if (url.pathname.startsWith("/api/") && MUTATION_METHODS.has(request.method)) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host") ?? url.host;

    const originHost = origin ? new URL(origin).host : null;
    const refererHost = referer ? new URL(referer).host : null;

    if (originHost && originHost !== host && refererHost !== host) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*|favicon.ico).*)"],
};
