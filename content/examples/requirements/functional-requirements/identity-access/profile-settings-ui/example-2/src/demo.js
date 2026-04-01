function hasDirtyFields(original, draft) {
  return Object.keys(original).some((key) => original[key] !== draft[key]);
}

console.log(hasDirtyFields({ name: "Avery", title: "Staff" }, { name: "Avery", title: "Staff" }));
console.log(hasDirtyFields({ name: "Avery", title: "Staff" }, { name: "Avery", title: "Principal" }));
