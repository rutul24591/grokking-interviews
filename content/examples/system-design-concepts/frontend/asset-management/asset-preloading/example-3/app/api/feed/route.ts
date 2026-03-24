import { NextResponse } from "next/server";

export async function GET() {
  const link = [
    '</api/assets/hero?variant=hero&delayMs=250>; rel=preload; as=image',
    '</api/assets/hero?variant=thumb&delayMs=50>; rel=prefetch; as=image',
  ].join(", ");

  return NextResponse.json(
    {
      ok: true,
      items: [
        { id: "a", title: "Above-the-fold hero", heroHref: "/api/assets/hero?variant=hero&delayMs=250" },
        { id: "b", title: "Below-the-fold preview", heroHref: "/api/assets/hero?variant=thumb&delayMs=50" },
      ],
    },
    {
      headers: {
        Link: link,
        // In real deployments, `Link` should be correct under caching:
        // - If it depends on language/device/user, include those in the cache key and/or Vary.
        Vary: "Accept-Language",
        "Cache-Control": "no-store",
      },
    }
  );
}

