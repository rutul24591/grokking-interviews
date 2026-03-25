const a = "ａｄｍｉｎ"; // fullwidth characters
const b = "admin";

process.stdout.write(`raw equals? ${a === b}\n`);
process.stdout.write(`NFKC equals? ${a.normalize("NFKC") === b.normalize("NFKC")}\n`);

const key = "user\u0000id";
process.stdout.write(`contains NUL? ${key.includes("\u0000")}\n`);
process.stdout.write(`sanitized: ${key.replace(/\u0000/g, "")}\n`);
