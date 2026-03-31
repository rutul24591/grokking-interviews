function coerce(params) {
  return { page: String(Math.max(1, Number(params.page || 1))), sort: params.sort || "relevance" };
}

console.log(coerce({ page: "0", sort: "" }));
