export async function fetchJson<T>(
  url: string,
  options: { timeoutMs: number } = { timeoutMs: 3_500 },
): Promise<T> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), options.timeoutMs);

  try {
    const res = await fetch(url, { cache: "no-store", signal: abortController.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

