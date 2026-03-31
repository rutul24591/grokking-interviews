const appliedRequestId = 3;

for (const response of [
  { requestId: 2, query: "caching" },
  { requestId: 3, query: "cached" }
]) {
  if (response.requestId !== appliedRequestId) {
    console.log(`ignore stale response ${response.requestId} -> ${response.query}`);
    continue;
  }
  console.log(`apply current response ${response.requestId} -> ${response.query}`);
}
