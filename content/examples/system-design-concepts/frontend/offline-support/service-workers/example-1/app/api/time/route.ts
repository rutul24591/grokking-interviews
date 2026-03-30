export async function GET() {
  return Response.json({
    now: new Date().toISOString(),
    nonce: Math.random().toString(16).slice(2)
  });
}

