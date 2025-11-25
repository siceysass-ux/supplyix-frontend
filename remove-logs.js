// Script to remove all console.log statements
const fs = require('fs');
const path = require('path');

function removeConsoleLogs(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                removeConsoleLogs(filePath);
            }
        } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;

            // Remove console.log lines (handles multiline console.logs too)
            content = content.replace(/^\s*console\.log\([^]*?\);?\s*$/gm, '');

            // Remove empty lines that were left behind
            content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✓ Cleaned: ${filePath}`);
            }
        }
    });
}

console.log('Starting console.log removal...\n');
removeConsoleLogs('c:\\Users\\sicey\\Desktop\\Supplyix');
console.log('\n✅ All console.log statements removed!');
