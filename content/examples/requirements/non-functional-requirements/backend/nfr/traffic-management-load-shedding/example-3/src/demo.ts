type Class = "interactive" | "background";

function pick(classes: Array<{ c: Class; weight: number }>) {
  const total = classes.reduce((a, x) => a + x.weight, 0);
  let r = Math.random() * total;
  for (const x of classes) {
    r -= x.weight;
    if (r <= 0) return x.c;
  }
  return classes[classes.length - 1]!.c;
}

const counts: Record<Class, number> = { interactive: 0, background: 0 };
for (let i = 0; i < 1000; i++) counts[pick([{ c: "interactive", weight: 8 }, { c: "background", weight: 2 }])]++;

console.log(JSON.stringify(counts, null, 2));

