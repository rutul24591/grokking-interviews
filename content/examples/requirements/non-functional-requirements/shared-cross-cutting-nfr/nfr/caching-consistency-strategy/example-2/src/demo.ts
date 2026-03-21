function key(id: string, version: number) {
  return `${id}@v${version}`;
}

console.log(key("item-1", 1));
console.log(key("item-1", 2));

