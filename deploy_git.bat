@echo off
echo ==========================================
echo Supplyix GitHub Deployment Script
echo ==========================================

echo.
echo 1. Lutfen once yerel degisikliklerinizi GitHub'a gonderin:
echo    git push origin main
echo.
echo (Eger gonderdiyseniz bir tusa basin...)
pause

echo.
echo 2. Sunucuya baglaniliyor ve GitHub'dan son surum cekiliyor...
echo (Sifre sorarsa girin: 5470452Bmm..)
echo.

ssh -o StrictHostKeyChecking=no root@72.61.185.171 "
    echo '--- Sunucuya Baglanildi ---'
    
    # Klasor yoksa klonla, varsa guncelle
    if [ ! -d 'Supplyix' ]; then
        echo 'Repo klonlaniyor...'
        git clone https://github.com/siceysass-ux/supplyix-frontend.git Supplyix
    else
        echo 'Repo guncelleniyor...'
        cd Supplyix && git pull origin main
    fi

    cd Supplyix


    echo '--- Bagimliliklar Yukleniyor ---'
    npm install
    cd server && npm install
    
    echo '--- Veritabani Hazirlaniyor ---'
    # .env dosyasini olustur (Eger yoksa)
    if [ ! -f .env ]; then
        echo 'DATABASE_URL=\"postgresql://supplyix_user:5470452Bmm..@localhost:5432/supplyix_db\"' > .env
        echo 'IYZICO_API_KEY=\"5eOELazlpeWLsIAIRDwhXVln2DuxbE85\"' >> .env
        echo 'IYZICO_SECRET_KEY=\"xkyjOzlf7XHmpjlGL1xc5YzJZMUY8RyM\"' >> .env
        echo 'IYZICO_BASE_URL=\"https://api.iyzipay.com\"' >> .env
        echo 'PORT=3000' >> .env
    fi
    
    npx prisma generate
    npx prisma db push

    echo '--- Frontend Derleniyor ---'
    cd ..
    npm run build
    
    # Frontend build'i server public klasorune tasi
    rm -rf server/public
    mkdir -p server/public
    cp -r dist/* server/public/

    echo '--- Uygulama Baslatiliyor ---'
    cd server
    npm install -g pm2
    pm2 stop supplyix || true
    pm2 delete supplyix || true
    pm2 start src/index.ts --name 'supplyix' --interpreter ./node_modules/.bin/ts-node
    pm2 save

    echo '--- ISLEM TAMAMLANDI ---'
"

echo.
echo ==========================================
echo Siteniz yayinda: http://supplyix.com
echo ==========================================
pause
