// Client sending requests through the lifecycle pipeline.

const http = require("http");

function request(body, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      {
        host: "localhost",
        port: 4060,
        path: "/transform",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "x-api-key": apiKey,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk.toString("utf8")));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(await request({ input: "hello" }, "demo-key"));
  console.log(await request({ input: 42 }, "demo-key"));
  console.log(await request({ input: "no-auth" }, "bad-key"));
}

run().catch((error) => console.error(error));
