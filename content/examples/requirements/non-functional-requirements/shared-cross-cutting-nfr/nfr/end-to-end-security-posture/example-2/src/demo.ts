import { enforceSameOriginCsrf } from "./guard.js";

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

const allowedOrigins = ["http://localhost:3000"];
const expectedCsrfToken = "csrf-demo-token";

const cases = [
  {
    name: "Allows GET without CSRF",
    input: {
      method: "GET",
      origin: "http://evil.test",
      allowedOrigins,
      secFetchSite: "cross-site",
      csrfHeader: null,
      expectedCsrfToken,
    },
    ok: true,
  },
  {
    name: "Blocks bad origin on POST",
    input: {
      method: "POST",
      origin: "http://evil.test",
      allowedOrigins,
      secFetchSite: "same-origin",
      csrfHeader: expectedCsrfToken,
      expectedCsrfToken,
    },
    ok: false,
    reason: "bad_origin",
  },
  {
    name: "Blocks cross-site sec-fetch-site",
    input: {
      method: "POST",
      origin: "http://localhost:3000",
      allowedOrigins,
      secFetchSite: "cross-site",
      csrfHeader: expectedCsrfToken,
      expectedCsrfToken,
    },
    ok: false,
    reason: "cross_site",
  },
  {
    name: "Blocks missing CSRF header",
    input: {
      method: "POST",
      origin: "http://localhost:3000",
      allowedOrigins,
      secFetchSite: "same-origin",
      csrfHeader: null,
      expectedCsrfToken,
    },
    ok: false,
    reason: "bad_csrf",
  },
  {
    name: "Allows same-origin with CSRF",
    input: {
      method: "POST",
      origin: "http://localhost:3000",
      allowedOrigins,
      secFetchSite: "same-origin",
      csrfHeader: expectedCsrfToken,
      expectedCsrfToken,
    },
    ok: true,
  },
] as const;

for (const c of cases) {
  const res = enforceSameOriginCsrf(c.input);
  if (c.ok) {
    assert(res.ok, `${c.name} expected ok`);
  } else {
    assert(!res.ok, `${c.name} expected failure`);
    assert(res.reason === c.reason, `${c.name} expected ${c.reason}, got ${res.reason}`);
  }
}

console.log(JSON.stringify({ ok: true, cases: cases.length }, null, 2));

