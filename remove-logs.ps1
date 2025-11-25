# PowerShell script to remove console.log statements
$files = Get-ChildItem -Path "c:\Users\sicey\Desktop\Supplyix" -Include *.ts,*.tsx,*.js,*.jsx -Recurse | Where-Object { $_.FullName -notmatch 'node_modules' -and $_.FullName -notmatch '\.git' }

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -and $content -match 'console\.log') {
        # Remove console.log lines
        $newContent = $content -replace '(?m)^\s*console\.log\([^\)]*\);?\s*[\r\n]*', ''
        
        if ($content -ne $newContent) {
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "✓ Cleaned: $($file.FullName)"
            $count++
        }
    }
}

Write-Host "`n✅ Removed console.log from $count files!"
