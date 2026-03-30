import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ title: 'Fresh article set', fetchedAt: new Date().toISOString().slice(11, 19) }, {
    headers: { 'cache-control': 'public, max-age=30, stale-while-revalidate=300' }
  });
}
