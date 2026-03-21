console.log(
  JSON.stringify(
    {
      contexts: [
        { context: "HTML text node", safe: "escape HTML entities" },
        { context: "HTML attribute", safe: "escape + avoid event handler attributes" },
        { context: "URL context", safe: "validate protocol + allowlist domains" },
        { context: "JS context", safe: "avoid string concatenation; never eval" }
      ],
      note: [
        "Many XSS bugs come from using the right escaping in the wrong context.",
        "Prefer frameworks that escape by default and minimize raw HTML usage."
      ]
    },
    null,
    2,
  ),
);

