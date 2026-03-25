function cookieMatchesPath(cookiePath, requestPath) {
  if (!requestPath.startsWith("/")) return false;
  if (!cookiePath.endsWith("/")) cookiePath = cookiePath;
  return requestPath.startsWith(cookiePath);
}

function cookiesForRequest(cookies, requestPath) {
  return cookies
    .filter((c) => cookieMatchesPath(c.path, requestPath))
    .sort((a, b) => b.path.length - a.path.length); // more specific path first
}

const jar = [
  { name: "session", value: "root", path: "/" },
  { name: "session", value: "admin", path: "/admin" },
  { name: "prefs", value: "x", path: "/" }
];

const reqPath = "/admin/settings";
process.stdout.write(`request path: ${reqPath}\n`);
process.stdout.write(`matching cookies (sorted): ${JSON.stringify(cookiesForRequest(jar, reqPath))}\n`);

