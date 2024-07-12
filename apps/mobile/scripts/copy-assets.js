const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'node_modules', '@expo', 'metro-runtime', 'assets');
const targetDir = path.join(__dirname, '..', 'assets');

if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir);
}

fs.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.png')) {
        fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
    }
});
