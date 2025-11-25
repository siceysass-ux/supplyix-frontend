import React from 'react';

interface SalesAgreementPageProps {
    navigate?: (path: string) => void;
}

const SalesAgreementPage: React.FC<SalesAgreementPageProps> = ({ navigate }) => {
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

                <h1 className="text-4xl font-bold text-dark-blue dark:text-white mb-8">Mesafeli Satış Sözleşmesi</h1>

                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300">
                    <p className="mb-6"><strong>Yürürlük Tarihi:</strong> 05.11.2025</p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">1. Taraflar</h2>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
                        <p className="font-bold mb-2">Satıcı (Hizmet Sağlayıcı):</p>
                        <p><strong>Unvan:</strong> Supplyix</p>
                        <p><strong>Adres:</strong> İstanbul, Zeytinburnu</p>
                        <p><strong>E-posta:</strong> supplyix@supplyix.com</p>
                    </div>
                    <p className="mb-6">Bu sözleşmede "Satıcı" olarak anılacaktır.</p>
                    <p className="mb-6">
                        <strong>Alıcı (Tüketici / Kullanıcı):</strong> Supplyix platformu üzerinden elektronik ortamda alışveriş yapan kişi veya kurumu ifade eder.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">2. Sözleşmenin Konusu</h2>
                    <p className="mb-6">
                        Bu sözleşme, Alıcı'nın Supplyix platformu üzerinden elektronik ortamda siparişini verdiği ürünün satışı,
                        teslimi, ödeme koşulları ve tarafların yükümlülüklerini düzenler.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">3. Sözleşmenin Kurulması</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Alıcı, siparişini tamamlayıp onayladığında, bu sözleşmenin tüm koşullarını kabul etmiş sayılır.</li>
                        <li>Satıcı, sipariş onayını verdikten sonra sözleşme yürürlüğe girer.</li>
                        <li>Satıcı, ürün stok veya tedarik sorunları nedeniyle siparişi iptal etme veya teslim süresini uzatma hakkını saklı tutar.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">4. Ürün Bilgileri ve Fiyatlandırma</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Ürünlerin nitelikleri, satış fiyatları ve teslimat koşulları sipariş ekranında belirtilmiştir.</li>
                        <li>Fiyatlar, ödeme anındaki döviz kuru üzerinden hesaplanır.</li>
                        <li>Teknik veya sistemsel hatalardan kaynaklanan fiyat yanlışlıklarında Satıcı siparişi iptal edebilir; bu durumda ücret iadesi yapılır.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">5. Teslimat ve Gönderim Şartları</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Teslimat, Alıcı'nın belirttiği adrese uluslararası kargo firması aracılığıyla yapılır.</li>
                        <li><strong>Ortalama teslimat süresi 7 ila 21 iş günü</strong> arasındadır; ülkeye ve kargo sürecine göre değişiklik gösterebilir.</li>
                        <li>Gümrük, ithalat vergileri veya ek masraflar Alıcı'ya aittir.</li>
                        <li className="text-red-600 dark:text-red-400 font-semibold">Kargoya verilen ürünlerde iptal veya iade yapılamaz.</li>
                        <li>Teslimat sırasında ürünün hasarsız olduğunun kontrolü Alıcı'ya aittir; teslimden sonra bildirilmeyen hasarlardan Satıcı sorumlu değildir.</li>
                        <li>Alıcı'nın adres hatası, gümrük ödemesi yapmaması veya teslimatı reddetmesi nedeniyle gönderi geri dönerse, yeniden gönderim veya iade masrafları Alıcı'ya yansıtılır.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">6. Ödeme Koşulları</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Ödeme, platformda sunulan yöntemlerle yapılır (kredi kartı, sanal POS, transfer vb.).</li>
                        <li>Satıcı, ödemesi tamamlanmayan siparişleri onaylamama hakkını saklı tutar.</li>
                        <li>Döviz kuru farkı, banka ve ödeme sağlayıcı politikalarına tabidir; Satıcı bu farklardan sorumlu değildir.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">7. Cayma Hakkı ve İade Şartları</h2>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">7.1. Cayma Hakkı</h3>
                    <p className="mb-4">
                        Alıcı, ürünü teslim aldıktan sonra <strong>14 gün içinde</strong> cayma hakkını kullanabilir.
                        Ancak bu hak aşağıdaki durumlarda geçerli değildir:
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Kişisel kullanım veya hijyen gerektiren ürünler (iç giyim, kozmetik, sağlık ürünleri)</li>
                            <li>Gıda, takviye veya taze ürünler</li>
                            <li>Kişiye özel veya siparişe göre üretilen ürünler</li>
                            <li><strong>Kargoya verilmiş veya sevkiyat sürecine alınmış ürünler</strong></li>
                        </ul>
                    </div>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">7.2. İade Süreci</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>İade talebi <a href="mailto:supplyix@supplyix.com" className="text-primary hover:underline">supplyix@supplyix.com</a> adresine yazılı olarak yapılır.</li>
                        <li>İade onayı verilmeden gönderilen ürünler kabul edilmez.</li>
                        <li>İade kargo bedeli, ürün hatalı değilse Alıcı'ya aittir.</li>
                        <li>İade edilen ürün tedarikçiye ulaştıktan sonra incelenir; kullanılmamış, hasarsız ve orijinal ambalajında ise 7–10 iş günü içinde iade bedeli yapılır.</li>
                        <li>Ürün iade şartlarına uymuyorsa Satıcı, ürünü Alıcı'ya geri gönderme hakkını saklı tutar.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">7.3. İade Edilemeyen Durumlar</h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Ürün kullanılmış, hasar görmüş veya ambalajı açılmışsa iade kabul edilmez.</li>
                            <li>Uluslararası gönderimlerde gümrük işlemleri tamamlanmış veya teslim sürecinde olan ürünler geri alınamaz.</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">8. Garanti ve Sorumluluk</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Satıcı, ürünün sipariş formunda belirtilen özelliklere uygun olmasını sağlar.</li>
                        <li>Üretici veya tedarikçiden kaynaklanan kusurlarda Satıcı, yeni ürün gönderme veya iade seçeneği sunabilir.</li>
                        <li>Satıcı, üçüncü taraf kargo veya gümrük gecikmelerinden sorumlu değildir.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">9. Mücbir Sebepler</h2>
                    <p className="mb-6">
                        Doğal afet, savaş, grev, ithalat yasağı, uluslararası taşıma kısıtlamaları, gümrük yoğunluğu veya resmi engeller
                        nedeniyle yaşanabilecek gecikme ve aksaklıklardan Satıcı sorumlu tutulamaz.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">10. Yetki ve Uygulanacak Hukuk</h2>
                    <p className="mb-6">
                        Bu sözleşmeden doğan uyuşmazlıklarda Türk Hukuku uygulanır.
                        Yetkili mahkeme İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra Daireleridir.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">11. Yürürlük ve Kabul</h2>
                    <p className="mb-6">
                        Alıcı, siparişi onaylayarak bu sözleşmenin tüm koşullarını okuduğunu, anladığını ve kabul ettiğini beyan eder.
                        Bu sözleşme elektronik ortamda kurulmuş olup ayrıca fiziki imza gerektirmez.
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

export default SalesAgreementPage;
