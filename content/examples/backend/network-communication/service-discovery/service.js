import fetch from "node-fetch";

const serviceUrl = "http://localhost:4801";

async function register() {
  await fetch("http://localhost:4800/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ service: "users", url: serviceUrl }),
  });
}

async function heartbeat() {
  await fetch("http://localhost:4800/heartbeat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: serviceUrl }),
  });
}

register();
setInterval(heartbeat, 2000);