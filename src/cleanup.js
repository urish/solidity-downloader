const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../contracts');

for (const name of fs.readdirSync(baseDir)) {
  if (name.endsWith('.sol')) {
    const fullPath = path.join(baseDir, name);
    const content = fs.readFileSync(fullPath, 'utf-8');
    if (
      !content.includes('pragma') &&
      !content.includes('contract') &&
      !content.includes('library')
    ) {
      fs.unlinkSync(fullPath);
    }
  }
}
