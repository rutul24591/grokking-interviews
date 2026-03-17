// Simple client that calls both the HTTP and HTTPS endpoints.

const http = require("http");
const https = require("https");

function callHttp() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:4010/status", (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk.toString("utf8")));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    }).on("error", reject);
  });
}

function callHttps() {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://localhost:4011/status",
        { rejectUnauthorized: false },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk.toString("utf8")));
          res.on("end", () => resolve({ status: res.statusCode, body }));
        }
      )
      .on("error", reject);
  });
}

async function run() {
  console.log("HTTP:", await callHttp());
  try {
    console.log("HTTPS:", await callHttps());
  } catch (error) {
    console.log("HTTPS error (server not running?)", error.message);
  }
}

run().catch((error) => console.error(error));
