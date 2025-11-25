const fs = require('fs');
const path = require('path');

const components = [
    "FeaturesSection",
    "LiveDemoSection",
    "PricingSection",
    "CategoriesSection",
    "FAQSection",
    "YouTubeSection",
    "MarketplaceMarquee",
    "FeatureSteps",
    "EventPopup",
    "ContactPage",
    "LoginPage",
    "SignupPage",
    "ForgotPasswordPage",
    "Footer"
];

const componentsPath = "c:\\Users\\sicey\\Desktop\\Supplyix\\components";

components.forEach(component => {
    const filePath = path.join(componentsPath, `${component}.tsx`);

    if (fs.existsSync(filePath)) {
        console.log(`Processing ${component}.tsx...`);

        let content = fs.readFileSync(filePath, 'utf8');

        // Remove dark: classes from className attributes
        content = content.replace(/\s+dark:[^\s"]+/g, '');

        fs.writeFileSync(filePath, content, 'utf8');

        console.log(`  ✓ Completed`);
    } else {
        console.log(`  ✗ File not found: ${filePath}`);
    }
});

console.log("\nAll done!");
