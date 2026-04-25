const { DoublyLinkedList } = require("./list");

const tabs = new DoublyLinkedList();
const dashboard = tabs.append("Dashboard");
tabs.append("Orders");
const alerts = tabs.append("Alerts");
tabs.append("Billing");

tabs.remove(alerts);

console.log("Closed tab:", alerts.value);
console.log("Forward:", tabs.valuesForward());
console.log("Backward:", tabs.valuesBackward());
console.log("Still reachable from head:", dashboard.value);
