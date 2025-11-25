#!/bin/bash

# Supplyix VPS Kurulum Yardımcı Script
# Bu script VPS üzerinde çalıştırılmalıdır

set -e

echo "======================================"
echo "Supplyix VPS Setup Helper"
echo "======================================"

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kullanıcıdan bilgi alma
echo -e "${BLUE}Veritabanı bilgilerini girin:${NC}"
read -p "Database kullanıcı adı (default: supplyix_user): " DB_USER
DB_USER=${DB_USER:-supplyix_user}

read -sp "Database şifresi: " DB_PASS
echo ""

read -p "Database adı (default: supplyix): " DB_NAME
DB_NAME=${DB_NAME:-supplyix}

read -p "Domain adınız (opsiyonel): " DOMAIN

# PostgreSQL veritabanı oluştur
echo ""
echo -e "${YELLOW}PostgreSQL veritabanı oluşturuluyor...${NC}"
sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

echo -e "${GREEN}Veritabanı oluşturuldu!${NC}"

# .env dosyası oluştur
echo ""
echo -e "${YELLOW}.env dosyası oluşturuluyor...${NC}"

cat > /var/www/supplyix/server/.env <<EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"

# Server
PORT=3001
NODE_ENV=production

# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=

# Iyzico Payment
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=https://api.iyzipay.com

# Email (Natro SMTP)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# Sentry (opsiyonel)
SENTRY_DSN=
EOF

echo -e "${GREEN}.env dosyası oluşturuldu!${NC}"
echo -e "${YELLOW}Lütfen /var/www/supplyix/server/.env dosyasını düzenleyerek eksik bilgileri doldurun.${NC}"

# Prisma migration
echo ""
echo -e "${YELLOW}Veritabanı migration yapılıyor...${NC}"
cd /var/www/supplyix/server
npx prisma generate
npx prisma migrate deploy

# Seed data (opsiyonel)
read -p "Örnek veri eklemek ister misiniz? (y/n): " SEED_CHOICE
if [ "$SEED_CHOICE" = "y" ]; then
    npx prisma db seed
    echo -e "${GREEN}Örnek veriler eklendi!${NC}"
fi

# Backend build
echo ""
echo -e "${YELLOW}Backend build ediliyor...${NC}"
npm run build

# PM2 ile başlat
echo ""
echo -e "${YELLOW}Backend PM2 ile başlatılıyor...${NC}"
pm2 start dist/index.js --name supplyix-backend
pm2 save
pm2 startup

echo -e "${GREEN}Backend başlatıldı!${NC}"

# Nginx konfigürasyonu
echo ""
echo -e "${YELLOW}Nginx konfigürasyonu oluşturuluyor...${NC}"

if [ -z "$DOMAIN" ]; then
    SERVER_NAME="_"
else
    SERVER_NAME="$DOMAIN www.$DOMAIN"
fi

sudo tee /etc/nginx/sites-available/supplyix > /dev/null <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    # Frontend (React)
    location / {
        root /var/www/supplyix/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # File uploads
    client_max_body_size 50M;
}
EOF

# Nginx'i aktif et
sudo ln -sf /etc/nginx/sites-available/supplyix /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx test ve restart
sudo nginx -t
sudo systemctl restart nginx

echo -e "${GREEN}Nginx yapılandırıldı!${NC}"

# UFW güvenlik duvarı
echo ""
echo -e "${YELLOW}Güvenlik duvarı yapılandırılıyor...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable

echo -e "${GREEN}Güvenlik duvarı yapılandırıldı!${NC}"

# SSL sertifikası (opsiyonel)
if [ ! -z "$DOMAIN" ]; then
    read -p "SSL sertifikası (Let's Encrypt) kurmak ister misiniz? (y/n): " SSL_CHOICE
    if [ "$SSL_CHOICE" = "y" ]; then
        echo -e "${YELLOW}Certbot kuruluyor...${NC}"
        sudo apt install -y certbot python3-certbot-nginx
        
        echo -e "${YELLOW}SSL sertifikası alınıyor...${NC}"
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
        
        echo -e "${GREEN}SSL sertifikası kuruldu!${NC}"
    fi
fi

echo ""
echo -e "${GREEN}======================================"
echo "Kurulum tamamlandı!"
echo "======================================${NC}"
echo ""
echo "Uygulama durumu:"
pm2 status
echo ""
echo "Nginx durumu:"
sudo systemctl status nginx --no-pager
echo ""
if [ -z "$DOMAIN" ]; then
    echo "Uygulamanıza şu adresten erişebilirsiniz: http://$(curl -s ifconfig.me)"
else
    echo "Uygulamanıza şu adresten erişebilirsiniz: http://$DOMAIN"
fi
echo ""
echo "Faydalı komutlar:"
echo "  - Backend logları: pm2 logs supplyix-backend"
echo "  - Backend yeniden başlat: pm2 restart supplyix-backend"
echo "  - Nginx logları: sudo tail -f /var/log/nginx/error.log"
echo "  - Nginx yeniden yükle: sudo systemctl reload nginx"
