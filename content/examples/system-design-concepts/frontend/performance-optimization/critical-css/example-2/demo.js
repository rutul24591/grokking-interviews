const stylesheet = `
.hero { padding: 48px; }
.hero-title { font-size: 64px; }
.site-nav { display: flex; gap: 12px; }
.article-card { border-radius: 20px; }
.comments-thread { padding: 24px; }
.footer { margin-top: 80px; }
`;

const criticalSelectors = [".hero", ".hero-title", ".site-nav"];

const criticalRules = stylesheet
  .trim()
  .split("\n")
  .filter((rule) => criticalSelectors.some((selector) => rule.includes(selector)));

console.log(`full rules: ${stylesheet.trim().split("\n").length}`);
console.log(`critical rules: ${criticalRules.length}`);
console.log(criticalRules.join("\n"));
