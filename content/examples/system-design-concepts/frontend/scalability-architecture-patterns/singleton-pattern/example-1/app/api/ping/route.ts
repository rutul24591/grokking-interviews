import { getDemoSingleton } from "../../../lib/singleton";

export async function GET() {
  const singleton = getDemoSingleton();
  singleton.requests += 1;

  return Response.json({
    singletonId: singleton.id,
    startedAt: singleton.startedAt,
    requests: singleton.requests,
    note: "This is one instance per Node.js process. In serverless/edge you may have multiple."
  });
}

