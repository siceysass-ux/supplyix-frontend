# Supplyix VPS Deployment Script (PowerShell)
# Windows'tan VPS'e deployment için kullanılır

param(
    [string]$VpsIp,
    [string]$VpsUser = "root",
    [string]$Domain = ""
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Supplyix VPS Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Kullanıcıdan bilgi alma
if (-not $VpsIp) {
    $VpsIp = Read-Host "VPS IP adresi"
}

if (-not $VpsUser) {
    $VpsUser = Read-Host "VPS kullanıcı adı (default: root)"
    if ([string]::IsNullOrWhiteSpace($VpsUser)) {
        $VpsUser = "root"
    }
}

if (-not $Domain) {
    $Domain = Read-Host "Domain adı (opsiyonel, boş bırakılabilir)"
}

Write-Host ""
Write-Host "VPS'e bağlanılıyor ve kurulum yapılıyor..." -ForegroundColor Yellow

# Proje dizini
$ProjectDir = "C:\Users\sicey\Desktop\Supplyix"

# SSH ile VPS'e bağlan ve kurulum yap
$SshCommand = @'
set -e

echo '======================================'
echo 'VPS Kurulum Başlıyor...'
echo '======================================'

# Sistem güncellemesi
echo 'Sistem güncelleniyor...'
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu kontrolü
if ! command -v node &> /dev/null; then
    echo 'Node.js kuruluyor...'
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo 'Node.js zaten kurulu: $(node -v)'
fi

# Nginx kurulumu kontrolü
if ! command -v nginx &> /dev/null; then
    echo 'Nginx kuruluyor...'
    sudo apt install -y nginx
else
    echo 'Nginx zaten kurulu'
fi

# PostgreSQL kurulumu kontrolü
if ! command -v psql &> /dev/null; then
    echo 'PostgreSQL kuruluyor...'
    sudo apt install -y postgresql postgresql-contrib
else
    echo 'PostgreSQL zaten kurulu'
fi

# PM2 kurulumu kontrolü
if ! command -v pm2 &> /dev/null; then
    echo 'PM2 kuruluyor...'
    sudo npm install -g pm2
else
    echo 'PM2 zaten kurulu'
fi

# Uygulama dizini oluştur
echo 'Uygulama dizini hazırlanıyor...'
sudo mkdir -p /var/www/supplyix
sudo chown -R $USER:$USER /var/www/supplyix

echo ''
echo 'Dosyalar hazır. Şimdi dosyaları yükleyin:'
echo 'scp -r C:\Users\sicey\Desktop\Supplyix/* root@IP:/var/www/supplyix/'
echo ''
'@

ssh "${VpsUser}@${VpsIp}" $SshCommand

Write-Host ""
Write-Host "VPS hazır! Şimdi dosyaları yüklüyoruz..." -ForegroundColor Yellow

# SCP ile dosyaları yükle (node_modules ve dist hariç)
Write-Host "Frontend dosyaları yükleniyor..." -ForegroundColor Gray
scp -r "$ProjectDir\components" "$ProjectDir\contexts" "$ProjectDir\data" "$ProjectDir\public" "$ProjectDir\src" "${VpsUser}@${VpsIp}:/var/www/supplyix/"

Write-Host "Kök dosyalar yükleniyor..." -ForegroundColor Gray
scp "$ProjectDir\*.tsx" "$ProjectDir\*.ts" "$ProjectDir\*.json" "$ProjectDir\*.html" "$ProjectDir\*.md" "$ProjectDir\*.sh" "${VpsUser}@${VpsIp}:/var/www/supplyix/" 2>$null

Write-Host "Server dosyaları yükleniyor..." -ForegroundColor Gray
scp -r "$ProjectDir\server\src" "$ProjectDir\server\prisma" "${VpsUser}@${VpsIp}:/var/www/supplyix/server/"

Write-Host "Server kök dosyaları yükleniyor..." -ForegroundColor Gray  
scp "$ProjectDir\server\*.json" "$ProjectDir\server\tsconfig.json" "${VpsUser}@${VpsIp}:/var/www/supplyix/server/" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dosyalar başarıyla yüklendi!" -ForegroundColor Green
}
else {
    Write-Host "Bazı dosyalar yüklenemedi ama devam ediyoruz..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Backend ve frontend kuruluyor..." -ForegroundColor Yellow

# Backend ve frontend kurulumu
$SetupCommand = @'
cd /var/www/supplyix/server
npm install
npx prisma generate

cd /var/www/supplyix
npm install
npm run build

echo ''
echo '======================================'
echo 'Kurulum tamamlandı!'
echo '======================================'
'@

ssh "${VpsUser}@${VpsIp}" $SetupCommand

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Deployment tamamlandı!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Sıradaki adımlar:" -ForegroundColor Cyan
Write-Host "1. VPS'e bağlanın: ssh ${VpsUser}@${VpsIp}" -ForegroundColor Yellow
Write-Host "2. Setup helper scriptini çalıştırın: bash /var/www/supplyix/vps-setup-helper.sh" -ForegroundColor Yellow
Write-Host "3. Veya manuel olarak .env dosyasını yapılandırın" -ForegroundColor Yellow
Write-Host ""
Write-Host "Detaylı talimatlar için hostinger-deployment-guide.md dosyasına bakın." -ForegroundColor Gray
