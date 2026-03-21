import { NextResponse } from "next/server";
import path from "node:path";
import { lintDocs } from "@/lib/lint";

export async function GET() {
  const root = path.join(process.cwd());
  const report = lintDocs(root);
  return NextResponse.json(report);
}

