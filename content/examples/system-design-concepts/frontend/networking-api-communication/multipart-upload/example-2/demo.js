const totalBytes = 1030;
const partSize = 256;
let partNumber = 1;

for (let offset = 0; offset < totalBytes; offset += partSize) {
  const end = Math.min(offset + partSize, totalBytes);
  console.log(`part ${partNumber} -> bytes ${offset}-${end - 1}`);
  partNumber += 1;
}
