// Minimal router that supports path params like /books/:id.

function matchRoute(method, pathname, routes) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(pathname);
    if (match) {
      return { handler: route.handler, params: match.groups || {} };
    }
  }
  return null;
}

module.exports = { matchRoute };
