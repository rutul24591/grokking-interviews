const cases = [
  { action: "create comment", status: 201, hasBody: true },
  { action: "delete comment", status: 204, hasBody: false },
  { action: "validation failure", status: 422, hasBody: true }
];

for (const testCase of cases) {
  const valid = !(testCase.status === 204 && testCase.hasBody);
  console.log(`${testCase.action} -> ${valid ? "valid response contract" : "invalid 204 body contract"}`);
}
