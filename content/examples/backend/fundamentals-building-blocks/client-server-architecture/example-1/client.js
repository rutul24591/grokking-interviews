// Example client exercising the server API contract via HTTP.

const http = require("http");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: "localhost",
        port: 4001,
        path,
        method,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload),
            }
          : {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk.toString("utf8")));
        res.on("end", () => {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log("GET /items", await request("GET", "/items"));
  console.log(
    "POST /items",
    await request("POST", "/items", { name: "Gateway", stock: 3 })
  );
  console.log("GET /items/3", await request("GET", "/items/3"));

  console.log(
    "POST /sessions",
    await request("POST", "/sessions", { clientId: "client-42" })
  );
  console.log(
    "POST /sessions/hit",
    await request("POST", "/sessions/hit", { clientId: "client-42" })
  );
}

run().catch((error) => console.error(error));
