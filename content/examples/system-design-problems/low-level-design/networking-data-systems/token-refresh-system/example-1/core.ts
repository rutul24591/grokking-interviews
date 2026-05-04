export type Tokens = { accessToken: string; refreshToken: string; expiresAt: number };

export function createRefreshManager(args: {
  load: () => Tokens | null;
  save: (t: Tokens) => void;
  refresh: (refreshToken: string) => Promise<Tokens>;
}) {
  let inFlight: Promise<Tokens> | null = null;

  return async function getValidAccessToken(now = Date.now()): Promise<string> {
    const t = args.load();
    if (!t) throw new Error("not authenticated");
    if (t.expiresAt - now > 30_000) return t.accessToken;

    if (inFlight) return (await inFlight).accessToken;
    inFlight = args.refresh(t.refreshToken).then((next) => {
      args.save(next);
      return next;
    }).finally(() => {
      inFlight = null;
    });

    return (await inFlight).accessToken;
  };
}
