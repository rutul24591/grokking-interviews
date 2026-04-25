const urgent = ["fraud-review", "manual-refund"];
const standard = ["email-digest", "invoice-export", "crm-sync"];

const dispatchOrder = [];
while (urgent.length || standard.length) {
  if (urgent.length) dispatchOrder.push({ lane: "urgent", task: urgent.shift() });
  else dispatchOrder.push({ lane: "standard", task: standard.shift() });
}

console.table(dispatchOrder);
