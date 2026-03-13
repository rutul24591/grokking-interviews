// Reads embedded vs referenced documents.

const data = require("./documents.json");

function readEmbeddedOrders() {
  return data.orders_embedded.map((order) => ({
    id: order.id,
    customerName: order.customer.name,
    total: order.total,
  }));
}

function readReferencedOrders() {
  return data.orders_referenced.map((order) => {
    const customer = data.customers.find((c) => c.id === order.customer_id);
    return {
      id: order.id,
      customerName: customer ? customer.name : "unknown",
      total: order.total,
    };
  });
}

console.log("Embedded", readEmbeddedOrders());
console.log("Referenced", readReferencedOrders());
