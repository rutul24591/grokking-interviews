const samples = [
  { contentType: "text/html; charset=utf-8", bytes: 18240 },
  { contentType: "application/javascript", bytes: 92400 },
  { contentType: "image/avif", bytes: 188000 },
  { contentType: "video/mp4", bytes: 640000 },
];

function shouldCompress(contentType, bytes) {
  const alreadyCompressed = /image\/(avif|jpeg|png|webp)|video\/|audio\//.test(contentType);
  if (alreadyCompressed) return false;
  return bytes >= 1024;
}

for (const sample of samples) {
  console.log(
    `${sample.contentType.padEnd(32)} ${String(sample.bytes).padStart(8)} bytes -> ${
      shouldCompress(sample.contentType, sample.bytes) ? "compress" : "skip"
    }`,
  );
}
