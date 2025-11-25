#!/usr/bin/env bash
set -euo pipefail

# -------------------------------------------------
# 1. Sistem hazırlığı
# -------------------------------------------------
echo "=== Sistem güncelleniyor ..."
sudo apt-get update -y && sudo apt-get upgrade -y

# Docker kurulu değilse kur
if ! command -v docker >/dev/null 2>&1; then
  echo "=== Docker kuruluyor ..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
fi

# Docker Compose (isteğe bağlı)
if ! command -v docker-compose >/dev/null 2>&1; then
  echo "=== Docker‑Compose kuruluyor ..."
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# -------------------------------------------------
# 2. PostgreSQL konteyneri (eski varsa temizle)
# -------------------------------------------------
DB_CONTAINER="supplyix-db"
if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER}\$"; then
  echo "=== Eski PostgreSQL konteyneri durdurulup siliniyor ..."
  docker rm -f ${DB_CONTAINER}
fi

# Şifreyi burada tanımlayın (güçlü bir şifre seçin)
POSTGRES_PASSWORD="YOUR_STRONG_PASSWORD"   # <‑‑ Bunu değiştirin
POSTGRES_USER="supplyix_user"
POSTGRES_DB="supplyix_db"

echo "=== PostgreSQL konteyneri başlatılıyor ..."
docker run -d \
  --name ${DB_CONTAINER} \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -e POSTGRES_USER=${POSTGRES_USER} \
  -e POSTGRES_DB=${POSTGRES_DB} \
  -p 5432:5432 \
  --restart always \
  postgres:15

# -------------------------------------------------
# 3. Projeyi klonla
# -------------------------------------------------
APP_DIR="/opt/supplyix"
if [ -d "${APP_DIR}" ]; then
  echo "=== Mevcut proje klasörü siliniyor ..."
  sudo rm -rf "${APP_DIR}"
fi

echo "=== Git üzerinden proje klonlanıyor ..."
git clone https://github.com/your‑username/supplyix.git "${APP_DIR}"
cd "${APP_DIR}"

# -------------------------------------------------
# 4. Node.js (20 LTS) kurulumu
# -------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "=== Node.js 20 kuruluyor ..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

node -v
npm -v

# -------------------------------------------------
# 5. .env dosyasını oluştur
# -------------------------------------------------
cat > server/.env <<EOL
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@$(curl -s ifconfig.me):5432/${POSTGRES_DB}"

# Iyzico prod anahtarları (kullanıcıdan alındı)
IYZICO_API_KEY=5eOELazlpeWLsIAIRDwhXVln2DuxbE85
IYZICO_SECRET_KEY=xkyjOzlf7XHmpjlGL1xc5YzJZMUY8RyM
IYZICO_BASE_URL=https://api.iyzipay.com

# (Diğer env değişkenleri aynı kalabilir)
EOL

# -------------------------------------------------
# 6. Bağımlılıkları kur
# -------------------------------------------------
echo "=== Front‑end bağımlılıkları kuruluyor ..."
npm ci   # kök package‑lock.json

echo "=== Server bağımlılıkları kuruluyor ..."
cd server
npm ci

# -------------------------------------------------
# 7. Prisma – şema push & seed
# -------------------------------------------------
npx prisma generate
npx prisma db push --accept-data-loss
npx ts-node prisma/seed.ts

# -------------------------------------------------
# 8. Uygulamayı pm2 ile servis olarak çalıştır
# -------------------------------------------------
sudo npm install -g pm2
pm2 start src/index.ts --name supplyix-server --interpreter ts-node
pm2 save
pm2 startup   # sistem yeniden başlatıldığında otomatik başlat

# -------------------------------------------------
# 9. (Opsiyonel) Nginx ters proxy + SSL
# -------------------------------------------------
if command -v nginx >/dev/null 2>&1; then
  echo "=== Nginx yapılandırması (opsiyonel) ..."
  sudo tee /etc/nginx/sites-available/supplyix <<NGCONF > /dev/null
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGCONF
  sudo ln -sf /etc/nginx/sites-available/supplyix /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx

  # Let’s Encrypt (ücretsiz SSL)
  sudo apt-get install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com --non-interactive --agree-tos -m your@email.com
fi

echo "=== Tüm adımlar tamamlandı! ���"
echo "Uygulama http://yourdomain.com (veya VPS IP) üzerinden erişilebilir."
