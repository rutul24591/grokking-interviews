// Demonstrates denormalized access patterns.

const model = require("./model");

model.writeOrder({ id: "o1", customer_id: "c1", status: "paid" });
model.writeOrder({ id: "o2", customer_id: "c1", status: "shipped" });
model.writeOrder({ id: "o3", customer_id: "c2", status: "paid" });

console.log("By customer", model.getOrdersByCustomer("c1"));
console.log("By status", model.getOrdersByStatus("paid"));
