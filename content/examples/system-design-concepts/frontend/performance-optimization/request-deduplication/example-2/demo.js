function normalize(url) {
  const parsed = new URL(url, "https://example.com");
  parsed.searchParams.sort();
  return `${parsed.pathname.toLowerCase()}?${parsed.searchParams.toString()}`;
}
for (const url of ["/api/user?b=2&a=1", "/api/user?a=1&b=2", "/API/USER?a=1&b=2"]) {
  console.log(`${url} -> ${normalize(url)}`);
}
