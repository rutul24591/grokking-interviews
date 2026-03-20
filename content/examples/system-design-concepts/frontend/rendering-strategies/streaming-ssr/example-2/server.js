import http from "node:http";
import React, { Suspense } from "react";
import { renderToPipeableStream } from "react-dom/server";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const e = React.createElement;

function lazyWithDelay(factory, delayMs) {
  return React.lazy(async () => {
    await sleep(delayMs);
    return factory();
  });
}

const SlowSection = lazyWithDelay(() => import("./slow-section.js"), 1800);

function Shell({ children }) {
  return e(
    "html",
    { lang: "en" },
    e(
      "head",
      null,
      e("meta", { charSet: "utf-8" }),
      e("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      e("title", null, "Streaming SSR Primitive"),
    ),
    e(
      "body",
      { style: { fontFamily: "system-ui", background: "#060912", color: "#e6e9f2" } },
      e("main", { style: { maxWidth: 900, margin: "40px auto", padding: "0 18px" } }, children),
    ),
  );
}

function App() {
  const ts = new Date().toISOString();
  return e(
    Shell,
    null,
    e("h1", { style: { margin: 0 } }, "React Streaming SSR: `renderToPipeableStream`"),
    e(
      "p",
      { style: { marginTop: 6, color: "#a6adc1" } },
      "Shell timestamp: ",
      e("span", { style: { fontFamily: "ui-monospace" } }, ts),
    ),
    e(
      "div",
      {
        style: {
          marginTop: 18,
          border: "1px solid #22283a",
          borderRadius: 16,
          padding: 14,
          background: "rgba(10,14,26,0.6)",
        },
      },
      e(
        "div",
        { style: { fontSize: 12, fontWeight: 700, letterSpacing: 1.4, color: "#cbd2e8" } },
        "FAST CONTENT (always in first flush)",
      ),
      e(
        "p",
        { style: { margin: "10px 0 0 0", color: "#dbe2ff" } },
        "You can read this while the slow section is still rendering.",
      ),
    ),
    e(
      Suspense,
      {
        fallback: e(
          "div",
          {
            style: {
              marginTop: 14,
              border: "1px solid #22283a",
              borderRadius: 16,
              padding: 14,
              background: "rgba(10,14,26,0.35)",
              color: "#a6adc1",
            },
          },
          e(
            "div",
            { style: { fontSize: 12, fontWeight: 700, letterSpacing: 1.4 } },
            "SLOW SECTION (fallback streamed first)",
          ),
          e(
            "p",
            { style: { margin: "10px 0 0 0" } },
            "Waiting on async dependency… (simulated 1800ms)",
          ),
        ),
      },
      e(SlowSection, null),
    ),
    e(
      "p",
      { style: { marginTop: 18, fontSize: 12, color: "#7680a2" } },
      "Run with ",
      e("code", null, "curl -N"),
      " to observe chunked HTML.",
    ),
  );
}

const server = http.createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  let didError = false;
  const stream = renderToPipeableStream(e(App, null), {
    onShellReady() {
      res.statusCode = didError ? 500 : 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      stream.pipe(res);
    },
    onError(err) {
      didError = true;
      // eslint-disable-next-line no-console
      console.error(err);
    },
  });

  setTimeout(() => {
    // If downstream is too slow, abort and send fallbacks.
    stream.abort();
  }, 10_000);
});

const port = 3050;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Streaming server on http://localhost:${port}`);
});
