const responses = [
  { code: "fresh_code", usedBefore: false },
  { code: "replayed_code", usedBefore: true }
];

for (const response of responses) {
  console.log(`${response.code} -> ${response.usedBefore ? "reject replay" : "exchange token"}`);
}
