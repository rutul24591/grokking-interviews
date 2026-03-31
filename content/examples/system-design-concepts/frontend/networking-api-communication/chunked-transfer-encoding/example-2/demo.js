const chunks = ["head", "line", " done"];
let buffer = "";
for (const chunk of chunks) {
  buffer += chunk;
  console.log(`partial -> ${buffer}`);
}
