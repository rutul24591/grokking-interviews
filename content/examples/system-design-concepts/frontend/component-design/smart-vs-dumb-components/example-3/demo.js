function leaksSideEffects(component) {
  return /(fetch|localStorage|sessionStorage|navigator\.sendBeacon)/.test(component.source);
}

console.log(leaksSideEffects({ source: "return <List items={items} />" }));
console.log(leaksSideEffects({ source: "useEffect(() => fetch(/api/articles))" }));
