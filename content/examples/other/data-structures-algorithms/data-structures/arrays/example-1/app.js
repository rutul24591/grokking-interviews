const { DynamicArray } = require("./dynamic-array");

const catalog = new DynamicArray();

catalog.append({ sku: "SKU-101", name: "Mechanical Keyboard", stock: 14 });
catalog.append({ sku: "SKU-102", name: "USB-C Dock", stock: 9 });
catalog.append({ sku: "SKU-104", name: "4K Monitor", stock: 4 });
catalog.insertAt(2, { sku: "SKU-103", name: "Ergonomic Mouse", stock: 22 });
catalog.update(1, { sku: "SKU-102", name: "USB-C Dock", stock: 12 });

const discontinued = catalog.removeAt(0);

console.log("Discontinued:", discontinued);
console.log("Capacity after growth:", catalog.capacity);
console.table(catalog.toArray());
