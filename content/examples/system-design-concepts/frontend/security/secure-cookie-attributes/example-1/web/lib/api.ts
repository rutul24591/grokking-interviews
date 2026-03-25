const BASE = "https://localhost:9443";

export async function whoami() {
  const res = await fetch(`${BASE}/whoami`, { credentials: "include", cache: "no-store" });
  return (await res.json()) as unknown;
}

export async function login() {
  const res = await fetch(`${BASE}/login`, { method: "POST", credentials: "include" });
  return (await res.json()) as unknown;
}

export async function logout() {
  const res = await fetch(`${BASE}/logout`, { method: "POST", credentials: "include" });
  return (await res.json()) as unknown;
}

