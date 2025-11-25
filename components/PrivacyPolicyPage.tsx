import React from 'react';

interface PrivacyPolicyPageProps {
    navigate?: (path: string) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ navigate }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                {navigate && (
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Ana Sayfaya Dön
                    </button>
                )}

                <h1 className="text-4xl font-bold text-dark-blue dark:text-white mb-8">Gizlilik Politikası</h1>

                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300">
                    <p className="mb-6"><strong>Yürürlük Tarihi:</strong> 05.11.2025</p>

                    <p className="mb-6">
                        Bu Gizlilik Politikası, Supplyix ("Şirket") tarafından işletilen hizmetlerde, kullanıcıların ("Kullanıcı")
                        kişisel verilerinin toplanması, kullanılması, saklanması ve korunmasına ilişkin esasları açıklamaktadır.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">1. Veri Sorumlusu Bilgileri</h2>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
                        <p><strong>Şirket Adı:</strong> Supplyix</p>
                        <p><strong>Adres:</strong> İstanbul, Zeytinburnu</p>
                        <p><strong>E-posta:</strong> supplyix@supplyix.com</p>
                    </div>
                    <p className="mb-6">
                        Supplyix, 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında "Veri Sorumlusu" sıfatını taşır.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">2. Toplanan Kişisel Veriler ve Toplama Yöntemi</h2>
                    <p className="mb-4">Supplyix, kullanıcıların hizmetlerden yararlanması sırasında aşağıdaki kişisel verileri toplayabilir:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (gerekliyse), firma bilgileri</li>
                        <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgisi</li>
                        <li><strong>Finansal Bilgiler:</strong> Fatura ve ödeme bilgileri (ödeme sağlayıcılar aracılığıyla)</li>
                        <li><strong>İşlem Bilgileri:</strong> Sipariş geçmişi, tedarik talepleri, platform içi mesajlaşma kayıtları</li>
                        <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı tipi, cihaz bilgileri, çerez (cookie) verileri</li>
                    </ul>
                    <p className="mb-6">
                        Bu veriler; kullanıcı kayıt formları, sipariş süreçleri, destek talepleri ve çerezler aracılığıyla otomatik veya manuel yollarla toplanabilir.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">3. Kişisel Verilerin İşlenme Amaçları</h2>
                    <p className="mb-4">Toplanan kişisel veriler şu amaçlarla işlenebilir:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Hizmetin sunulması, yönetilmesi ve geliştirilmesi</li>
                        <li>Sipariş, ödeme ve teslimat süreçlerinin yürütülmesi</li>
                        <li>Kullanıcı destek hizmetlerinin sağlanması</li>
                        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                        <li>Güvenlik ve dolandırıcılığın önlenmesi</li>
                        <li>Kullanıcı memnuniyetinin ölçülmesi ve platform deneyiminin iyileştirilmesi</li>
                        <li>Tanıtım, kampanya ve bilgilendirme faaliyetlerinin yürütülmesi (onay verilmesi halinde)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">4. Kişisel Verilerin Aktarımı</h2>
                    <p className="mb-4">Kullanıcı verileri, aşağıdaki durumlarda üçüncü taraflarla paylaşılabilir:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Hizmetin sağlanması için iş ortakları, tedarikçiler ve teknik altyapı sağlayıcılarla</li>
                        <li>Ödeme işlemleri için yetkili finansal kuruluşlarla</li>
                        <li>Yasal zorunluluk durumlarında yetkili kamu kurumlarıyla</li>
                        <li>Kullanıcının açık rızası alınmak suretiyle iş ortaklarıyla</li>
                    </ul>
                    <p className="mb-6">
                        <strong>Supplyix, kişisel verileri hiçbir koşulda ticari amaçla satmaz veya izinsiz paylaşmaz.</strong>
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">5. Kişisel Verilerin Saklanma Süresi</h2>
                    <p className="mb-6">
                        Kişisel veriler, işleme amacının ortadan kalkması veya yasal saklama süresinin sona ermesiyle birlikte
                        güvenli bir şekilde silinir, yok edilir veya anonim hale getirilir.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">6. Veri Güvenliği Önlemleri</h2>
                    <p className="mb-6">
                        Supplyix, kişisel verilerin gizliliğini ve bütünlüğünü korumak amacıyla uygun teknik ve idari tedbirleri alır.
                        Bu önlemler; şifreleme, erişim kısıtlamaları, güvenlik duvarları ve düzenli güvenlik testlerini içerir.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">7. Çerez (Cookie) Kullanımı</h2>
                    <p className="mb-6">
                        Supplyix, kullanıcı deneyimini geliştirmek amacıyla çerezler kullanabilir.
                        Kullanıcılar, tarayıcı ayarlarından çerez tercihlerini değiştirebilir veya devre dışı bırakabilir.
                        Ancak bu durumda bazı hizmetlerin doğru çalışmaması mümkündür.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">8. Kullanıcı Hakları (KVKK Madde 11)</h2>
                    <p className="mb-4">Kullanıcılar, Supplyix'e başvurarak aşağıdaki haklara sahiptir:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Kişisel verilerinin işlenip işlenmediğini öğrenme</li>
                        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                        <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                        <li>Verilerin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme</li>
                        <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
                        <li>İşlemenin yalnızca otomatik sistemler aracılığıyla analiz edilmesi sonucu aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                        <li>Kanuna aykırı işleme nedeniyle zarara uğraması hâlinde tazminat talep etme</li>
                    </ul>
                    <p className="mb-6">
                        Bu haklarınızı kullanmak için <a href="mailto:supplyix@supplyix.com" className="text-primary hover:underline">supplyix@supplyix.com</a> adresine e-posta gönderebilirsiniz.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">9. Gizlilik Politikasındaki Değişiklikler</h2>
                    <p className="mb-6">
                        Supplyix, bu politikada değişiklik yapma hakkını saklı tutar. Güncellenmiş politika, yürürlük tarihinin
                        güncellenmesiyle birlikte web sitesinde yayımlandığında geçerli olur.
                    </p>

                    <div className="bg-primary/10 border-l-4 border-primary p-6 mt-8">
                        <h3 className="font-bold text-dark-blue dark:text-white mb-2">İletişim</h3>
                        <p>Supplyix</p>
                        <p>İstanbul, Zeytinburnu</p>
                        <p>📧 supplyix@supplyix.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
