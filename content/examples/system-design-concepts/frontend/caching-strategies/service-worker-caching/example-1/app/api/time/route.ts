export async function GET() {
  return new Response(new Date().toISOString(), {
    headers: { 'cache-control': 'no-store', 'content-type': 'text/plain' }
  });
}
