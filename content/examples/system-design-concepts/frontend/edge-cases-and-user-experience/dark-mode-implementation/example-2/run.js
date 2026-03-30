const cases = [
  { system: 'dark', user: 'system' },
  { system: 'light', user: 'dark' },
  { system: 'dark', user: 'light' }
];
console.log(cases.map((entry) => ({ ...entry, resolved: entry.user === 'system' ? entry.system : entry.user })));
