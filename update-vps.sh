#!/bin/bash

# Supplyix Güncelleme Script
# Mevcut VPS deployment'ını güncellemek için kullanılır

set -e

echo "======================================"
echo "Supplyix Update Script"
echo "======================================"

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /var/www/supplyix

echo -e "${YELLOW}Git'ten son değişiklikler çekiliyor...${NC}"
git pull origin main

echo -e "${YELLOW}Backend güncelleniyor...${NC}"
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

echo -e "${YELLOW}Backend yeniden başlatılıyor...${NC}"
pm2 restart supplyix-backend

echo -e "${YELLOW}Frontend güncelleniyor...${NC}"
cd ..
npm install
npm run build

echo -e "${YELLOW}Nginx yeniden yükleniyor...${NC}"
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}======================================"
echo "Güncelleme tamamlandı!"
echo "======================================${NC}"
echo ""
echo "Uygulama durumu:"
pm2 status
