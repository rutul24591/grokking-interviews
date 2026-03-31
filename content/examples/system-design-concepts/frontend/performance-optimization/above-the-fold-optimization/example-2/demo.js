const samples = [
  {
    name: "bad-hero",
    markup: '<img src="/hero.jpg" loading="lazy" class="hero-image">',
  },
  {
    name: "good-hero",
    markup:
      '<img src="/hero.jpg" width="1400" height="933" fetchpriority="high" alt="Hero" class="hero-image">',
  },
];

function auditHeroMarkup(markup) {
  const hasWidth = /\bwidth="\d+"/.test(markup);
  const hasHeight = /\bheight="\d+"/.test(markup);
  const lazyLoaded = /\bloading="lazy"/.test(markup);
  const prioritized = /\bfetchpriority="high"/.test(markup);

  const issues = [];

  if (!hasWidth || !hasHeight) issues.push("missing intrinsic dimensions");
  if (lazyLoaded) issues.push("LCP image is lazy-loaded");
  if (!prioritized) issues.push("missing fetchpriority=high");

  return {
    hasWidth,
    hasHeight,
    lazyLoaded,
    prioritized,
    issues,
    pass: issues.length === 0,
  };
}

for (const sample of samples) {
  const result = auditHeroMarkup(sample.markup);

  console.log(`\nScenario: ${sample.name}`);
  console.log(sample.markup);
  console.log(`width reserved: ${result.hasWidth}`);
  console.log(`height reserved: ${result.hasHeight}`);
  console.log(`lazy loaded: ${result.lazyLoaded}`);
  console.log(`priority hint: ${result.prioritized}`);
  console.log(result.pass ? "status: pass" : `status: fail -> ${result.issues.join(", ")}`);
}
