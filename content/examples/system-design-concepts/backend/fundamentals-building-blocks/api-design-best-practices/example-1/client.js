// Example client calls illustrating pagination and filtering.

const http = require("http");

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4030${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk.toString("utf8")));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    }).on("error", reject);
  });
}

async function run() {
  console.log("First page", await request("/orders?limit=2"));
  console.log("Second page", await request("/orders?limit=2&cursor=2"));
  console.log("Filtered", await request("/orders?status=shipped&minTotal=100&sort=total:desc"));
}

run().catch((error) => console.error(error));
