import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getArticle } from "@/lib/articles";

function baseUrlFromHeaders(h: Headers) {
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "missing slug" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const article = getArticle(slug);
  if (!article) {
    return NextResponse.json({ error: "not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const baseUrl = baseUrlFromHeaders(req.headers);
  const canonical = `${baseUrl}/articles/${article.slug}`;

  return NextResponse.json(
    {
      slug: article.slug,
      canonical,
      title: article.title,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        url: canonical,
        type: "article" as const,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
        // Host/proto affect canonical URL generation behind proxies.
        Vary: "Host, X-Forwarded-Proto",
      },
    }
  );
}

