function isPresentationalProps(props) {
  return !Object.keys(props).some((key) => /(fetch|dispatch|load|setState)/i.test(key));
}

console.log(isPresentationalProps({ items: [], emptyLabel: "No results" }));
console.log(isPresentationalProps({ items: [], fetchArticles: true }));
