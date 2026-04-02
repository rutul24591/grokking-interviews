import React from "react";

type Token =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "code"; value: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    if (input.startsWith("**", i)) {
      const end = input.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push({ type: "bold", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (input[i] === "`") {
      const end = input.indexOf("`", i + 1);
      if (end !== -1) {
        tokens.push({ type: "code", value: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // plain text until next delimiter
    const nextBold = input.indexOf("**", i);
    const nextCode = input.indexOf("`", i);
    const next = [nextBold === -1 ? Infinity : nextBold, nextCode === -1 ? Infinity : nextCode].reduce(
      (a, b) => Math.min(a, b),
      Infinity,
    );
    const end = next === Infinity ? input.length : next;
    tokens.push({ type: "text", value: input.slice(i, end) });
    i = end;
  }
  return tokens;
}

export function SafeRichText({ text }: { text: string }) {
  const tokens = tokenize(text);
  return (
    <span>
      {tokens.map((t, idx) => {
        if (t.type === "text") return <React.Fragment key={idx}>{t.value}</React.Fragment>;
        if (t.type === "bold") return <strong key={idx}>{t.value}</strong>;
        return (
          <code key={idx} className="rounded bg-slate-800 px-1 py-0.5 text-xs">
            {t.value}
          </code>
        );
      })}
    </span>
  );
}

