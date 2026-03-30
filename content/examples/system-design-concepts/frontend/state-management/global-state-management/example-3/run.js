const events = [
  { subscriber: 'whole-store-consumer', rerenders: 1, change: 'theme' },
  { subscriber: 'whole-store-consumer', rerenders: 2, change: 'cart' },
  { subscriber: 'theme-selector-consumer', rerenders: 1, change: 'theme' },
  { subscriber: 'theme-selector-consumer', rerenders: 1, change: 'cart' }
];
console.table(events);
