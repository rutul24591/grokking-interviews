import React from "react";

export default function SlowSection() {
  const ts = new Date().toISOString();
  const e = React.createElement;
  return e(
    "div",
    {
      style: {
        marginTop: 14,
        border: "1px solid #22283a",
        borderRadius: 16,
        padding: 14,
        background: "rgba(10,14,26,0.6)",
      },
    },
    e(
      "div",
      { style: { fontSize: 12, fontWeight: 700, letterSpacing: 1.4, color: "#cbd2e8" } },
      "SLOW SECTION (streamed later)",
    ),
    e(
      "p",
      { style: { margin: "10px 0 0 0", color: "#dbe2ff" } },
      "Rendered at: ",
      e("span", { style: { fontFamily: "ui-monospace" } }, ts),
    ),
  );
}
