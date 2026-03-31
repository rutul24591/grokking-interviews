function safeBack(pointer) {
  return Math.max(0, pointer - 1);
}

console.log(safeBack(0));
console.log(safeBack(2));
