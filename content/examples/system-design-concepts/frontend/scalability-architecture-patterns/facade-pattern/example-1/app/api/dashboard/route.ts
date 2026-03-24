import { fetchBilling, fetchFeed, fetchProfile, withTimeout } from "../../../lib/upstreams";

export async function GET() {
  const timeoutMs = 180;

  const [profile, feed, billing] = await Promise.allSettled([
    withTimeout(fetchProfile(), timeoutMs),
    withTimeout(fetchFeed(), timeoutMs),
    withTimeout(fetchBilling(), timeoutMs)
  ]);

  const errors: Array<{ service: string; error: string }> = [];

  const out = {
    profile: profile.status === "fulfilled" ? profile.value : null,
    feed: feed.status === "fulfilled" ? feed.value : null,
    billing: billing.status === "fulfilled" ? billing.value : null
  };

  if (profile.status === "rejected") errors.push({ service: "profile", error: profile.reason?.message ?? "error" });
  if (feed.status === "rejected") errors.push({ service: "feed", error: feed.reason?.message ?? "error" });
  if (billing.status === "rejected") errors.push({ service: "billing", error: billing.reason?.message ?? "error" });

  return Response.json({
    data: out,
    partial: errors.length > 0,
    errors,
    policy: { timeoutMs }
  });
}

