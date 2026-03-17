// Client exercising both stateful and stateless servers.

const http = require("http");

function request({ port, method, path, headers }) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "localhost", port, method, path, headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk.toString("utf8")));
      res.on("end", () => resolve(JSON.parse(data)));
    });
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  const statefulLogin = await request({ port: 4050, method: "POST", path: "/login" });
  const statefulProfile = await request({
    port: 4050,
    method: "GET",
    path: "/profile",
    headers: { "x-session-id": statefulLogin.sessionId },
  });

  const statelessLogin = await request({ port: 4051, method: "POST", path: "/login" });
  const statelessProfile = await request({
    port: 4051,
    method: "GET",
    path: "/profile",
    headers: { Authorization: `Bearer ${statelessLogin.token}` },
  });

  console.log({ statefulLogin, statefulProfile, statelessLogin, statelessProfile });
}

run().catch((error) => console.error(error));
