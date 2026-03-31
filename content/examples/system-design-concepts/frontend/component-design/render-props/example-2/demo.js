function validateRenderProp(render, payload) {
  return {
    callable: typeof render === "function",
    returnsRenderableValue: typeof render === "function" ? render(payload) !== undefined : false
  };
}

console.log(validateRenderProp((value) => value.title, { title: "SSR" }));
console.log(validateRenderProp(null, { title: "SSR" }));
