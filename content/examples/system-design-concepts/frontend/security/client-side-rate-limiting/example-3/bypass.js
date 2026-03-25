const perClientPerSec = 5;
const clients = 10;
process.stdout.write(`per-client limit=${perClientPerSec}/sec, clients=${clients}\n`);
process.stdout.write(`aggregate potential=${perClientPerSec * clients}/sec (server still needs limits)\n`);

