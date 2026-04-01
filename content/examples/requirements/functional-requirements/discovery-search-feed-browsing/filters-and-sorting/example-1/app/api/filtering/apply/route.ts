import { NextRequest, NextResponse } from "next/server";
import { dataset } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { category: string; sort: 'popular' | 'recent' };
  const filtered = dataset.filter((item) => body.category === 'all' || item.category === body.category);
  const results = [...filtered].sort((a, b) => body.sort === 'popular' ? b.popularity - a.popularity : a.recencyHours - b.recencyHours);
  return NextResponse.json({ filters: { category: body.category }, sort: body.sort, results, lastMessage: `Applied ${body.category} filter and ${body.sort} sort.` });
}
