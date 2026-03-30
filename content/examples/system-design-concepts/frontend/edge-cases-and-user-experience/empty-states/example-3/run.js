const states = [
  { state: 'first-use', hasPrimaryAction: true },
  { state: 'filtered-empty', hasClearFilterAction: true },
  { state: 'dead-end', hasPrimaryAction: false }
];
console.table(states);
