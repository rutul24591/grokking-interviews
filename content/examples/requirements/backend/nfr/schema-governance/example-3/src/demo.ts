function accept(version: number, pinned: number) {
  return version <= pinned;
}

console.log(JSON.stringify({ pinned: 2, acceptV1: accept(1, 2), acceptV3: accept(3, 2) }, null, 2));

