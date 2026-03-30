function chunkCookie(name, value, chunkSize = 3800) {
  const out = [];
  for (let i = 0; i < value.length; i += chunkSize) {
    out.push(`${name}.${out.length}=${value.slice(i, i + chunkSize)}`);
  }
  return out;
}

const payload = "x".repeat(9000);
const parts = chunkCookie("draft", payload);
console.log("chunks", parts.length);
console.log(parts.map((p) => p.slice(0, 30) + "..."));

