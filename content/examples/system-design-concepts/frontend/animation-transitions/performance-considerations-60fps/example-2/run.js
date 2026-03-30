const workload = { script: 7.5, layout: 5.1, paint: 2.4 };
const total = Object.values(workload).reduce((sum, value) => sum + value, 0);
console.log(`Frame total: ${total.toFixed(1)}ms`);
console.log(total <= 16.7 ? "within budget" : "over budget");
