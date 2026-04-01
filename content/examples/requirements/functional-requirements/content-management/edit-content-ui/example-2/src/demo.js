function hasMeaningfulEdit(before, after) {
  return {
    dirty: before.title.trim() !== after.title.trim() || before.summary.trim() !== after.summary.trim(),
    whitespaceOnly: before.title.trim() === after.title.trim() && before.summary.trim() === after.summary.trim()
  };
}

console.log(hasMeaningfulEdit({ title: "Storage", summary: "Warm tier" }, { title: "Storage ", summary: "Warm tier" }));
