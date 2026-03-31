import { brotliCompressSync, gzipSync } from "node:zlib";

const payload = Buffer.from("core-web-vitals ".repeat(500));

function respond(acceptEncoding) {
  if (acceptEncoding.includes("br")) {
    return {
      contentEncoding: "br",
      body: brotliCompressSync(payload),
    };
  }

  if (acceptEncoding.includes("gzip")) {
    return {
      contentEncoding: "gzip",
      body: gzipSync(payload),
    };
  }

  return {
    contentEncoding: "identity",
    body: payload,
  };
}

for (const acceptEncoding of ["identity", "gzip", "br"]) {
  const response = respond(acceptEncoding);
  console.log(`${acceptEncoding} -> ${response.contentEncoding} -> ${response.body.byteLength} bytes`);
}
