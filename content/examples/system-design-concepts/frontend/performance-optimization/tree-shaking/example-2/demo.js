const imports = [
  "import { map } from 'lodash-es';",
  "const { map } = require('lodash');",
  "import * as icons from './icons';",
];
for (const statement of imports) {
  const treeShakeable = statement.startsWith("import {") && !statement.includes("* as");
  console.log(`${statement} -> ${treeShakeable ? "tree-shake friendly" : "tree-shake hostile"}`);
}
