export type Variant = {
  id: string;
  name: string;
  description: string;
  html: string;
};

export const VARIANTS: Variant[] = [
  {
    id: "good-form",
    name: "Good: labeled form controls",
    description: "A baseline “good” variant: proper labels, button name, and image alt.",
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Good</title></head>
  <body>
    <main>
      <h1>Signup</h1>
      <form>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" />
        <button type="submit">Create account</button>
      </form>
      <img src="/logo.png" alt="Example brand logo" />
    </main>
  </body>
</html>`,
  },
  {
    id: "missing-label",
    name: "Bug: input missing label",
    description: "Common regression: an input without an associated label.",
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Missing label</title></head>
  <body>
    <main>
      <h1>Signup</h1>
      <form>
        <input name="email" type="email" placeholder="Email address" />
        <button type="submit">Create account</button>
      </form>
    </main>
  </body>
</html>`,
  },
  {
    id: "icon-button",
    name: "Bug: icon-only button without name",
    description: "Buttons must have an accessible name (text/aria-label).",
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Icon-only button</title></head>
  <body>
    <main>
      <h1>Toolbar</h1>
      <button type="button"><svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6"/></svg></button>
    </main>
  </body>
</html>`,
  },
  {
    id: "color-contrast",
    name: "Bug: low contrast text",
    description: "Contrast failures are frequent and can be budgeted against.",
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Contrast</title>
    <style>
      .bad { color: #8a8a8a; background: #ffffff; font-size: 16px; }
    </style>
  </head>
  <body>
    <main>
      <h1 class="bad">Low contrast headline</h1>
      <p class="bad">Low contrast body copy</p>
    </main>
  </body>
</html>`,
  },
];

export function getVariant(id: string): Variant | undefined {
  return VARIANTS.find((v) => v.id === id);
}

