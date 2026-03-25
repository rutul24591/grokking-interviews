export async function fetchTlsHealth() {
  const res = await fetch("https://localhost:8443/health", { cache: "no-store" });
  if (!res.ok) throw new Error(`bad response: ${res.status}`);
  return (await res.json()) as unknown;
}

