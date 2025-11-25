# Script to remove dark mode classes from landing page components
$components = @(
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
)

$componentsPath = "c:\Users\sicey\Desktop\Supplyix\components"

foreach ($component in $components) {
    $filePath = Join-Path $componentsPath "$component.tsx"
    
    if (Test-Path $filePath) {
        Write-Host "Processing $component.tsx..." -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw
        
        # Remove dark: classes from className attributes
        $content = $content -replace '\s+dark:[^\s"]+', ''
        
        Set-Content $filePath $content -NoNewline
        Write-Host "  ✓ Completed" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ File not found: $filePath" -ForegroundColor Yellow
    }
}

Write-Host "All done!" -ForegroundColor Green

