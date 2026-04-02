import { NextResponse } from "next/server";
import { getConfig } from "@/lib/store";
import { snapshotTenant } from "@/lib/telemetry";
import { getRuntime } from "@/lib/runtime";

export async function GET() {
  const config = await getConfig();
  const rt = getRuntime(config);
  const tenants = Object.keys(config.tenants)
    .sort()
    .reduce<Record<string, any>>((acc, id) => {
      acc[id] = snapshotTenant(id);
      return acc;
    }, {});

  return NextResponse.json(
    {
      now: new Date().toISOString(),
      config,
      tenants,
      global: rt.global.snapshot(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

