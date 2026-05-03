const { bfsLevels } = require("./pattern");
const tree = { value: 1, left: { value: 2, left: null, right: null }, right: { value: 3, left: { value: 4, left: null, right: null }, right: null } };
console.log(bfsLevels(tree));
