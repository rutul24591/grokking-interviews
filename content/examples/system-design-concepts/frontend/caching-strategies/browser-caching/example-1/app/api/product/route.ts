import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const payload = { id: 'p1', title: 'Search cache deep dive', updatedAt: '2026-03-30T10:00:00.000Z' };

export async function GET(request: Request) {
  const body = JSON.stringify(payload);
  const etag = createHash('sha1').update(body).digest('hex');
  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { etag, 'cache-control': 'private, max-age=0, must-revalidate' }
    });
  }
  return NextResponse.json(payload, {
    headers: { etag, 'cache-control': 'private, max-age=0, must-revalidate' }
  });
}
