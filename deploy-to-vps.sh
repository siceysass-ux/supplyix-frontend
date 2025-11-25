#!/bin/bash

# Supplyix VPS Deployment Script
# Bu script, Supplyix uygulamasını Hostinger VPS'e deploy etmek için gerekli tüm adımları otomatikleştirir.

set -e  # Hata durumunda scripti durdur

echo "======================================"
echo "Supplyix VPS Deployment Script"
echo "======================================"
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kullanıcıdan bilgi alma
read -p "VPS IP adresi: " VPS_IP
read -p "VPS kullanıcı adı (default: root): " VPS_USER
VPS_USER=${VPS_USER:-root}
read -p "Domain adı (opsiyonel, boş bırakılabilir): " DOMAIN

echo ""
echo -e "${YELLOW}Dosyalar VPS'e yükleniyor...${NC}"

# Geçici dizin oluştur
TEMP_DIR=$(mktemp -d)
echo "Geçici dizin: $TEMP_DIR"

# Projeyi geçici dizine kopyala (node_modules hariç)
echo "Proje dosyaları hazırlanıyor..."
rsync -av --progress \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude '*.log' \
  --exclude '.env*' \
  --exclude 'supplyix.tar.gz' \
  . "$TEMP_DIR/"

# Tar dosyası oluştur
echo "Arşiv oluşturuluyor..."
cd "$TEMP_DIR"
tar -czf supplyix.tar.gz *
cd -

# VPS'e yükle
echo -e "${YELLOW}Dosyalar VPS'e yükleniyor...${NC}"
scp "$TEMP_DIR/supplyix.tar.gz" "$VPS_USER@$VPS_IP:/tmp/"

# Geçici dosyaları temizle
rm -rf "$TEMP_DIR"

echo -e "${GREEN}Dosyalar başarıyla yüklendi!${NC}"
echo ""
echo -e "${YELLOW}VPS'e bağlanılıyor ve kurulum yapılıyor...${NC}"

# VPS'te kurulum scriptini çalıştır
ssh "$VPS_USER@$VPS_IP" bash -s <<EOF
set -e

echo "======================================"
echo "VPS Kurulum Başlıyor..."
echo "======================================"

# Sistem güncellemesi
echo "Sistem güncelleniyor..."
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu kontrolü
if ! command -v node &> /dev/null; then
    echo "Node.js kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js zaten kurulu: \$(node -v)"
fi

# Nginx kurulumu kontrolü
if ! command -v nginx &> /dev/null; then
    echo "Nginx kuruluyor..."
    sudo apt install -y nginx
else
    echo "Nginx zaten kurulu"
fi

# PostgreSQL kurulumu kontrolü
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL kuruluyor..."
    sudo apt install -y postgresql postgresql-contrib
else
    echo "PostgreSQL zaten kurulu"
fi

# PM2 kurulumu kontrolü
if ! command -v pm2 &> /dev/null; then
    echo "PM2 kuruluyor..."
    sudo npm install -g pm2
else
    echo "PM2 zaten kurulu"
fi

# Uygulama dizini oluştur
echo "Uygulama dizini hazırlanıyor..."
sudo mkdir -p /var/www/supplyix
sudo chown -R \$USER:\$USER /var/www/supplyix

# Dosyaları çıkart
echo "Dosyalar çıkartılıyor..."
cd /var/www/supplyix
tar -xzf /tmp/supplyix.tar.gz
rm /tmp/supplyix.tar.gz

# Backend kurulumu
echo "Backend bağımlılıkları yükleniyor..."
cd /var/www/supplyix/server
npm install --production

# Frontend kurulumu
echo "Frontend bağımlılıkları yükleniyor..."
cd /var/www/supplyix
npm install

# Frontend build
echo "Frontend build ediliyor..."
npm run build

echo ""
echo "======================================"
echo "Kurulum tamamlandı!"
echo "======================================"
echo ""
echo "Sıradaki adımlar:"
echo "1. VPS'e SSH ile bağlanın: ssh $VPS_USER@$VPS_IP"
echo "2. .env dosyasını oluşturun: nano /var/www/supplyix/server/.env"
echo "3. Veritabanını kurun ve migrate edin"
echo "4. Backend'i başlatın: pm2 start /var/www/supplyix/server/dist/index.js --name supplyix-backend"
echo "5. Nginx'i yapılandırın"
echo ""
echo "Detaylı talimatlar için deployment guide'a bakın."
EOF

echo ""
echo -e "${GREEN}======================================"
echo "Deployment tamamlandı!"
echo "======================================${NC}"
echo ""
echo "Sıradaki adımlar:"
echo "1. VPS'e bağlanın: ssh $VPS_USER@$VPS_IP"
echo "2. .env dosyasını yapılandırın"
echo "3. Veritabanını kurun"
echo "4. Uygulamayı başlatın"
echo ""
echo "Detaylı talimatlar için hostinger-deployment-guide.md dosyasına bakın."
