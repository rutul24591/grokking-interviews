// Example REST client calls showing expected responses.

const http = require("http");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: "localhost",
        port: 4020,
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
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log("GET /books", await request("GET", "/books"));
  console.log(
    "POST /books",
    await request("POST", "/books", { title: "Site Reliability Engineering", author: "Beyer", year: 2016 })
  );
  console.log("GET /books/3", await request("GET", "/books/3"));
}

run().catch((error) => console.error(error));
