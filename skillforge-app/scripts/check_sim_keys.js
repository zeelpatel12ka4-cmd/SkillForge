const fs = require('fs');
const content = fs.readFileSync('src/data/simulationsData.ts', 'utf8');
const lines = content.split('\n');
const foundKeys = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^\s*([A-Z0-9_]+):\s*\{/)) {
    const key = line.match(/^\s*([A-Z0-9_]+):\s*\{/)[1];
    if (key !== 'SIMULATIONS_DATA') {
      foundKeys.push(key);
    }
  }
}
console.log('Found top-level keys in simulationsData:', foundKeys);
