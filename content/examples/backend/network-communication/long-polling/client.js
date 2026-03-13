import fetch from "node-fetch";

async function poll() {
  try {
    const res = await fetch("http://localhost:5200/poll");
    const data = await res.json();
    console.log("events", data.events);
  } catch (err) {
    // backoff on error
    await new Promise((r) => setTimeout(r, 1000));
  }
  setTimeout(poll, 200);
}

poll();