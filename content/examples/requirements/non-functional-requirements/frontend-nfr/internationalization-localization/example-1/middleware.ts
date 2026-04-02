import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LocaleSchema, negotiateLocale, SUPPORTED_LOCALES } from "@/lib/i18n";

const PUBLIC_FILE = /\\.[^/]+$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const seg = pathname.split("/")[1] || "";
  const isLocale = LocaleSchema.safeParse(seg).success;
  const headerLocale = isLocale ? (seg as (typeof SUPPORTED_LOCALES)[number]) : null;

  if (!headerLocale) {
    const cookieLocale = LocaleSchema.safeParse(req.cookies.get("locale")?.value).success
      ? (req.cookies.get("locale")!.value as (typeof SUPPORTED_LOCALES)[number])
      : null;
    const accept = req.headers.get("accept-language") || "";
    const chosen = cookieLocale || negotiateLocale(accept) || "en";

    const url = req.nextUrl.clone();
    url.pathname = `/${chosen}${pathname}`;

    const res = NextResponse.redirect(url);
    res.cookies.set("locale", chosen, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", headerLocale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

