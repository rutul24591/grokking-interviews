const slices = { script: 6.2, layout: 3.1, paint: 2.8 };
const total = Object.values(slices).reduce((sum, value) => sum + value, 0);
console.log("Frame budget report\n");
for (const [name, value] of Object.entries(slices)) console.log(`${name.padEnd(8)} ${value.toFixed(1)}ms`);
console.log(`\nTotal: ${total.toFixed(1)}ms of 16.7ms`);
