import re
import os

components = [
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
]

components_path = r"c:\Users\sicey\Desktop\Supplyix\components"

for component in components:
    file_path = os.path.join(components_path, f"{component}.tsx")
    
    if os.path.exists(file_path):
        print(f"Processing {component}.tsx...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove dark: classes from className attributes
        content = re.sub(r'\s+dark:[^\s"]+', '', content)
        
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        
        print(f"  ✓ Completed")
    else:
        print(f"  ✗ File not found: {file_path}")

print("\nAll done!")
