const { selectActivities } = require("../example-1/algorithm");
console.log("Empty:", selectActivities([]));
console.log(selectActivities([{ id: "a", start: 1, end: 3 }, { id: "b", start: 1, end: 3 }]).map((x)=>x.id));
