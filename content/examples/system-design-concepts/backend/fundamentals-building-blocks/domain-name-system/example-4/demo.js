// UDP/TCP fallback simulation.

function query(size) {
  return size > 512 ? "TCP" : "UDP";
}

console.log("small", query(200));
console.log("large", query(900));
