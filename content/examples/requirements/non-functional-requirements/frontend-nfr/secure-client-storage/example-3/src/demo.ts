type Cookie = {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
};

function risk(c: Cookie) {
  const risks: string[] = [];
  if (!c.httpOnly) risks.push("JS-readable (XSS token theft)");
  if (c.sameSite === "none") risks.push("cross-site requests allowed (needs CSRF token)");
  if (!c.secure) risks.push("sent over HTTP (MITM risk)");
  return risks.length ? risks : ["ok-ish (still needs review)"];
}

const cookies: Cookie[] = [
  { name: "sid", httpOnly: true, secure: true, sameSite: "lax" },
  { name: "auth", httpOnly: false, secure: true, sameSite: "lax" },
  { name: "sid", httpOnly: true, secure: false, sameSite: "none" }
];

console.log(JSON.stringify(cookies.map((c) => ({ c, risks: risk(c) })), null, 2));

