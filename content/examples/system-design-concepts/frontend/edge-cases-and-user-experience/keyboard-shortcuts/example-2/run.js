const bindings = [
  { combo: 'g h', action: 'go-home' },
  { combo: 'g h', action: 'open-help' }
];
console.log({ conflicts: bindings.filter((entry, index) => bindings.findIndex((candidate) => candidate.combo === entry.combo) !== index) });
