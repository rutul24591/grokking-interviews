function canCreateDraft(form, existingSlugs) {
  const slugValid = /^[a-z0-9-]+$/.test(form.slug);
  const duplicate = existingSlugs.includes(form.slug);
  return {
    ready: form.title.trim().length > 8 && slugValid && !duplicate && Boolean(form.category) && Boolean(form.audience),
    duplicate,
    slugValid
  };
}

console.log(canCreateDraft({ title: "Search ranking trade-offs", slug: "search-ranking-tradeoffs", category: "system-design", audience: "staff" }, ["content-preview"]));
