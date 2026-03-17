import fetch from "node-fetch";

async function getUsersService() {
  const res = await fetch("http://localhost:4800/discover/users");
  const data = await res.json();
  return data.instances[0];
}

async function callService() {
  const url = await getUsersService();
  if (!url) {
    console.log("no instances available");
    return;
  }
  const res = await fetch(url + "/health");
  console.log("status:", res.status);
}

callService();