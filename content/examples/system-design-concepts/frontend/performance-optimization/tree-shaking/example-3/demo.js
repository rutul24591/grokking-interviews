const modules = [
  { name: "button.css", sideEffect: true },
  { name: "polyfills.ts", sideEffect: true },
  { name: "date-utils.ts", sideEffect: false },
];
for (const module of modules) {
  console.log(`${module.name} -> ${module.sideEffect ? "must retain unless explicitly excluded" : "safe to shake when unused"}`);
}
