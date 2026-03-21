const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node fix-code-blocks.js <file>');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Find the component function and add code variables
const componentMatch = content.match(/export default function (\w+)\(\) \{/);
if (!componentMatch) {
  console.error('Could not find component function');
  process.exit(1);
}

const componentName = componentMatch[1];
let codeVarIndex = 0;
const codeVars = [];

// Replace all code blocks with template literals
content = content.replace(/<code>\{`([\s\S]*?)`}\{\/code>/g, (match, code) => {
  // Escape backticks and ${} in the code
  const escapedCode = code
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  
  const varName = `codeBlock${codeVarIndex++}`;
  codeVars.push(`  const ${varName} = \`${escapedCode}\`;`);
  
  return `<code>{${varName}}{</code>`;
});

// Insert code variables after component function start
const insertPos = content.indexOf(`return (`);
if (insertPos === -1) {
  console.error('Could not find return statement');
  process.exit(1);
}

const codeVarsStr = codeVars.join('\n') + '\n\n';
content = content.slice(0, insertPos) + codeVarsStr + content.slice(insertPos);

fs.writeFileSync(filePath, content);
console.log(`Fixed ${filePath} with ${codeVars.length} code blocks`);
