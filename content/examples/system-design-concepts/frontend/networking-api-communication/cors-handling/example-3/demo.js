const config = [
  { origin: "*", credentials: true },
  { origin: "https://app.example.com", credentials: true },
];
for (const row of config) {
  console.log(`${row.origin} + credentials:${row.credentials} -> ${row.origin === "*" && row.credentials ? "invalid" : "valid"}`);
}
