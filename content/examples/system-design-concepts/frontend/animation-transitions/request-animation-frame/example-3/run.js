const pitfalls = [
  ["hidden tab", "Animation callbacks throttle heavily or pause"],
  ["delta spike", "Clamp large frame deltas after background restore"],
  ["timer mixing", "Do not schedule the same animation with rAF and timers"],
];
console.log("requestAnimationFrame edge cases\n");
for (const [name, note] of pitfalls) console.log(`- ${name}: ${note}`);
