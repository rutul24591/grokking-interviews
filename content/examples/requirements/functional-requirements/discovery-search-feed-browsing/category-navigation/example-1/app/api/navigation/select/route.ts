import { NextRequest, NextResponse } from "next/server";
import { navigationState } from "@/lib/store";

const labels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  requirements: "Requirements",
  rendering: "Rendering",
  performance: "Performance",
  storage: "Storage",
  networking: "Networking",
  identity: "Identity",
  feed: "Feed"
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { category: string; child: string };
  navigationState.selectedCategory = body.category;
  navigationState.selectedChild = body.child;
  navigationState.breadcrumb = ["System Design", labels[body.category] ?? body.category, labels[body.child] ?? body.child];
  navigationState.lastMessage = `Navigated to ${body.category} / ${body.child}.`;
  return NextResponse.json(navigationState);
}
