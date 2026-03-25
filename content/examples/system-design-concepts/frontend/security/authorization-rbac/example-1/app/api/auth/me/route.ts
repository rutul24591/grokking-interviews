import { getAuth } from "../../../../lib/requestAuth";

export async function GET() {
  const auth = await getAuth();
  if (!auth.authenticated) return Response.json({ authenticated: false });
  return Response.json({ authenticated: true, user: auth.session });
}

