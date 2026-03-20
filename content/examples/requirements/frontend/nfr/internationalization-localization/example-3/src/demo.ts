function pseudoLocalize(s: string) {
  const map: Record<string, string> = {
    a: "à",
    e: "ë",
    i: "ï",
    o: "ø",
    u: "ü",
    A: "À",
    E: "Ë",
    I: "Ï",
    O: "Ø",
    U: "Ü",
  };
  const widened = s
    .split("")
    .map((ch) => map[ch] || ch)
    .join("");
  return `[!! ${widened} !!]`;
}

function bidiWrapRtl(s: string) {
  // U+202B: RLE, U+202C: PDF
  return `\\u202B${s}\\u202C`;
}

const msg = "Pay now — total $1,234.56";

console.log(
  JSON.stringify(
    {
      original: msg,
      pseudo: pseudoLocalize(msg),
      rtlWrapped: bidiWrapRtl(msg),
      note: [
        "Pseudolocalization catches truncation and hard-coded strings early.",
        "RTL support is more than text direction; it impacts layout, icons, and charts.",
        "Normalize user input (Unicode) when doing comparisons or dedupe across locales.",
      ],
    },
    null,
    2,
  ),
);

