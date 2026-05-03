const { selectActivities } = require("./pattern");
console.table(selectActivities([
  { id: "a", start: 1, end: 3 },
  { id: "b", start: 2, end: 5 },
  { id: "c", start: 4, end: 7 },
  { id: "d", start: 1, end: 8 },
  { id: "e", start: 5, end: 9 },
]));
