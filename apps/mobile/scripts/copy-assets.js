const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'node_modules', '@expo', 'metro-runtime', 'assets');
const targetDir = path.join(__dirname, '..', 'assets');

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  files.forEach(file => {
    const src = path.join(assetsDir, file);
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
  });
} else {
  console.warn(`Directory ${assetsDir} does not exist. Skipping asset copy.`);
}
