function validateVersionChain(versions) {
  const published = versions.filter((item) => item.status === "published");
  const sequenceOk = versions.every((item, index) => Number(item.label.split(" ")[1]) === 12 + index);
  return { valid: published.length === 1 && sequenceOk, publishedCount: published.length, sequenceOk };
}

console.log(
  validateVersionChain([
    { label: "Revision 12", status: "archived" },
    { label: "Revision 13", status: "draft" },
    { label: "Revision 14", status: "published" }
  ])
);
