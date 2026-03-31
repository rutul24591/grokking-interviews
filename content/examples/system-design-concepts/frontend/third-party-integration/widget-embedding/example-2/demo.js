const trustedOrigin = "https://widgets.example.com";
for (const origin of ["https://widgets.example.com", "https://evil.example.com"]) {
  console.log(`${origin} -> ${origin === trustedOrigin ? "accept postMessage" : "reject postMessage"}`);
}
