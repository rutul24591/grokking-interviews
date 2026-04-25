const { DynamicArray } = require("../example-1/dynamic-array");

const array = new DynamicArray(1);
array.append("A");
array.append("B");

console.log("Contents after resize:", array.toArray(), "capacity:", array.capacity);

try {
  array.removeAt(5);
} catch (error) {
  console.log("Expected remove failure:", error.message);
}

try {
  array.insertAt(-1, "bad");
} catch (error) {
  console.log("Expected insert failure:", error.message);
}
