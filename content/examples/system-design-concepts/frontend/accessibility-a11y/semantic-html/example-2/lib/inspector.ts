export type OutlineSnapshot = {
  headings: Array<{ tag: string; text: string; selector: string }>;
  landmarks: Array<{ tag: string; label?: string; selector: string }>;
};

function cssEscape(input: string) {
  // Enough for demo selectors.
  return input.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
}

function selectorFor(el: Element) {
  const id = (el as HTMLElement).id;
  if (id) return `#${cssEscape(id)}`;
  const tag = el.tagName.toLowerCase();
  const index =
    el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.tagName === el.tagName).indexOf(el) : 0;
  return `${tag}:nth-of-type(${index + 1})`;
}

export function buildOutline(doc: Document): OutlineSnapshot {
  const headings = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => ({
    tag: h.tagName.toLowerCase(),
    text: (h.textContent ?? "").trim().slice(0, 80),
    selector: selectorFor(h)
  }));

  const landmarkTags = ["header", "nav", "main", "footer", "aside", "article"];
  const landmarks = landmarkTags
    .flatMap((tag) => Array.from(doc.getElementsByTagName(tag)))
    .map((el) => {
      const label = el.getAttribute("aria-label") ?? undefined;
      return { tag: el.tagName.toLowerCase(), label, selector: selectorFor(el) };
    });

  return { headings, landmarks };
}

