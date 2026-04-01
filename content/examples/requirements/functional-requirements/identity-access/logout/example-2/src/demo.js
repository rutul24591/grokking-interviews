function cleared(containers) {
  const uncleared = containers.filter((container) => container.cleared !== true).map((container) => container.name);
  return { allCleared: uncleared.length === 0, uncleared };
}

console.log(cleared([{ name: "cookie", cleared: true }, { name: "memory", cleared: true }, { name: "broadcast-channel", cleared: true }]));
console.log(cleared([{ name: "cookie", cleared: true }, { name: "memory", cleared: false }, { name: "broadcast-channel", cleared: true }]));
