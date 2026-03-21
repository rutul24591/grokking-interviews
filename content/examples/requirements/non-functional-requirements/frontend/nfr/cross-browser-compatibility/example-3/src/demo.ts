type Layer = { supports: string; css: string };

function generate(base: string, layers: Layer[]) {
  return [
    "/* base */",
    base,
    ...layers.flatMap((l) => [`@supports (${l.supports}) {`, l.css, "}", ""]),
  ].join("\n");
}

const css = generate(
  ".card { display: block; }",
  [
    { supports: "display: grid", css: ".card { display: grid; grid-template-columns: 1fr 1fr; }" },
    { supports: "backdrop-filter: blur(10px)", css: ".glass { backdrop-filter: blur(10px); }" },
  ],
);

console.log(css);
console.log(JSON.stringify({ ok: true }, null, 2));

