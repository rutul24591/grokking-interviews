const renders = [
  { props: { id: "1", selected: false } },
  { props: { id: "1", selected: false } },
  { props: { id: "1", selected: true } },
];

function shallowEqual(left, right) {
  return Object.keys(left).every((key) => left[key] === right[key]) && Object.keys(right).every((key) => right[key] === left[key]);
}

for (let index = 1; index < renders.length; index += 1) {
  console.log(`render ${index} -> ${shallowEqual(renders[index - 1].props, renders[index].props) ? "skip" : "re-render"}`);
}
