const requests = [
  { method: "GET", headers: [] },
  { method: "POST", headers: ["content-type"] },
  { method: "DELETE", headers: ["authorization"] },
];
for (const request of requests) {
  const needsPreflight = !["GET", "HEAD", "POST"].includes(request.method) || request.headers.includes("authorization");
  console.log(`${request.method} ${request.headers.join(",")} -> ${needsPreflight ? "preflight" : "simple request"}`);
}
