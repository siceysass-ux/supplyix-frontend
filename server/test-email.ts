import { sendPasswordResetEmail, sendSubscriptionExpiryEmail, sendSubscriptionReminderEmail } from './src/services/email.service';

async function testEmails() {
    const testEmail = 'siceysa@gmail.com'; // Test email adresi
    const testUser = 'Test Kullanıcı';
    const testPlan = 'Premium Plan';
    const testDate = '2024-12-01';

    console.log('Email testleri başlatılıyor...\n');

    try {
        // 1. Şifre Sıfırlama Email Testi
        console.log('1️⃣ Şifre sıfırlama emaili gönderiliyor...');
        await sendPasswordResetEmail(testEmail, testUser, 'test-token-123456789');
        console.log('✅ Şifre sıfırlama emaili gönderildi!\n');

        // 2. Abonelik Hatırlatma (7 gün) Testi
        console.log('2️⃣ Abonelik hatırlatma emaili (7 gün) gönderiliyor...');
        await sendSubscriptionReminderEmail(testEmail, testUser, testPlan, testDate, 7);
        console.log('✅ 7 günlük hatırlatma emaili gönderildi!\n');

        // 3. Abonelik Hatırlatma (3 gün) Testi
        console.log('3️⃣ Abonelik hatırlatma emaili (3 gün) gönderiliyor...');
        await sendSubscriptionReminderEmail(testEmail, testUser, testPlan, testDate, 3);
        console.log('✅ 3 günlük hatırlatma emaili gönderildi!\n');

        // 4. Abonelik Sona Erme Testi
        console.log('4️⃣ Abonelik sona erme emaili gönderiliyor...');
        await sendSubscriptionExpiryEmail(testEmail, testUser, testPlan, testDate);
        console.log('✅ Abonelik sona erme emaili gönderildi!\n');

        console.log('🎉 Tüm test emailleri başarıyla gönderildi!');
        console.log(`📧 Email kutunuzu kontrol edin: ${testEmail}`);

    } catch (error) {
        console.error('❌ Email gönderme hatası:', error);
    }
}

testEmails();
