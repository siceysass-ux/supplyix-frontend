const fs = require('fs');
const path = require('path');

const landingComponents = [
    'YouTubeSection.tsx',
    'FAQSection.tsx',
    'CategoriesSection.tsx',
    'FeatureSteps.tsx',
    'MarketplaceMarquee.tsx',
    'EventPopup.tsx',
    'ContactPage.tsx',
    'Footer.tsx'
];

const componentsDir = path.join(__dirname, 'components');

landingComponents.forEach(filename => {
    const filePath = path.join(componentsDir, filename);

    if (fs.existsSync(filePath)) {
        console.log(`Processing ${filename}...`);

        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Remove all dark: classes
        content = content.replace(/\s+dark:[^\s"'`>]+/g, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✓ Updated ${filename}`);
        } else {
            console.log(`  - No changes needed for ${filename}`);
        }
    } else {
        console.log(`  ✗ File not found: ${filename}`);
    }
});

console.log('\nDone!');
