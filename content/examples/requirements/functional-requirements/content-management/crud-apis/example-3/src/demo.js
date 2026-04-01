function deletePolicy(item) {
  return {
    blocked: item.status === "published",
    mode: item.status === "published" ? "soft-delete-required" : "hard-delete-allowed"
  };
}

console.log(deletePolicy({ id: "c-101", status: "published" }));
