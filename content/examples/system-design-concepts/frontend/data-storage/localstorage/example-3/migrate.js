const badValue = "{not-valid-json";
const v1Value = JSON.stringify({ draft: "legacy draft", fontScale: 90 });

function recover(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version === 2) return parsed;
    return {
      version: 2,
      draft: typeof parsed.draft === "string" ? parsed.draft : "",
      theme: "dark",
      fontScale: typeof parsed.fontScale === "number" ? parsed.fontScale : 100
    };
  } catch {
    return {
      version: 2,
      draft: "",
      theme: "dark",
      fontScale: 100,
      recoveredFromCorruption: true
    };
  }
}

console.log("migrate v1 =>", recover(v1Value));
console.log("recover bad =>", recover(badValue));

