import React from 'react';

interface DeliveryReturnsPageProps {
    navigate?: (path: string) => void;
}

const DeliveryReturnsPage: React.FC<DeliveryReturnsPageProps> = ({ navigate }) => {
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

                <h1 className="text-4xl font-bold text-dark-blue dark:text-white mb-8">Teslimat ve İade Politikası</h1>

                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300">
                    <p className="mb-6"><strong>Yürürlük Tarihi:</strong> 05.11.2025</p>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
                        <p><strong>Şirket:</strong> Supplyix</p>
                        <p><strong>Adres:</strong> İstanbul, Zeytinburnu</p>
                        <p><strong>E-posta:</strong> supplyix@supplyix.com</p>
                    </div>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">1. Teslimat Koşulları</h2>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">1.1. Genel Bilgi</h3>
                    <p className="mb-6">
                        Supplyix üzerinden verilen tüm siparişler, Türkiye'den yurt dışına gönderilmektedir.
                        Siparişler, tedarikçiler tarafından hazırlanır ve uluslararası kargo firmaları aracılığıyla teslim edilir.
                    </p>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">1.2. Teslim Süresi</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Teslimat süresi, ülkeye ve kargo şirketine göre değişmekle birlikte genellikle <strong>7 ila 21 iş günü</strong> arasındadır.</li>
                        <li>Gümrük işlemleri, resmi tatiller ve yoğun dönemlerde teslimat süresi uzayabilir.</li>
                        <li>Supplyix, kargo firması kaynaklı gecikmelerden sorumlu değildir; ancak kullanıcı destek ekibimiz süreç boyunca yardımcı olur.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">1.3. Gümrük ve Vergiler</h3>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
                        <p><strong>Önemli:</strong> Gönderim yapılan ülkenin gümrük mevzuatına göre gümrük vergileri, ithalat vergileri veya ek ücretler alıcıya ait olabilir.</p>
                        <p className="mt-2">Bu ücretler, varış ülkesindeki gümrük yetkilileri tarafından belirlenir ve Supplyix tarafından kontrol edilemez.</p>
                        <p className="mt-2">Alıcının gümrük işlemlerini tamamlamaması veya ödemeleri yapmaması nedeniyle teslimatın gerçekleşmemesi durumunda ücret iadesi yapılmaz.</p>
                    </div>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">1.4. Kargo Takibi</h3>
                    <p className="mb-6">
                        Sipariş onaylandıktan sonra gönderi numarası ve takip bilgisi, kullanıcının Supplyix hesabındaki "Siparişlerim" bölümüne eklenir.
                        Kullanıcı, gönderi durumunu buradan görüntüleyebilir ve kargo firmasının web sitesine yönlendirilerek detaylı takip yapabilir.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">2. İade Koşulları</h2>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">2.1. Genel Şartlar</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>İade işlemleri, ürün teslim tarihinden itibaren <strong>14 gün içinde</strong> başlatılabilir.</li>
                        <li>Ürün kullanılmamış, orijinal ambalajında ve yeniden satılabilir durumda olmalıdır.</li>
                        <li>Uluslararası iade süreçlerinde, iade kargo ücreti alıcıya aittir.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">2.2. İade Edilemeyen Ürünler</h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                        <p className="font-bold mb-2">Aşağıdaki durumlarda iade kabul edilmez:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Kişisel kullanım veya hijyen gerektiren ürünler (ör. iç giyim, kozmetik)</li>
                            <li>Gıda ve takviye ürünleri</li>
                            <li>Özel üretim veya kişiye özel tasarlanmış ürünler</li>
                            <li><strong>Kargoya teslim edilmiş veya sevkiyat sürecine alınmış ürünler</strong></li>
                        </ul>
                        <p className="mt-2 font-semibold">
                            Sipariş onaylandıktan ve ürün kargoya verildikten sonra, gönderim iptal edilemez veya iade talebi oluşturulamaz.
                        </p>
                    </div>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">2.3. Hasarlı veya Hatalı Ürünler</h3>
                    <p className="mb-6">
                        Ürün tesliminde fiziksel hasar veya eksiklik tespit edilirse, kullanıcı <strong>48 saat içinde</strong> <a href="mailto:supplyix@supplyix.com" className="text-primary hover:underline">supplyix@supplyix.com</a> adresine bilgi vermelidir.
                        Tedarikçi onayının ardından ürün yeniden gönderilebilir veya bedeli iade edilir.
                    </p>

                    <h3 className="text-xl font-bold text-dark-blue dark:text-white mt-6 mb-3">2.4. İade Süreci</h3>
                    <ol className="list-decimal pl-6 mb-6 space-y-2">
                        <li>İade talebi e-posta ile yapılır. Onay sonrası kullanıcıya iade adresi ve kargo bilgileri paylaşılır.</li>
                        <li>İade edilen ürün tedarikçiye ulaştıktan sonra kontrol edilir.</li>
                        <li>Onaydan sonra <strong>7–10 iş günü içinde</strong> ücret iadesi yapılır.</li>
                        <li>İade tutarları, ödeme yapılan para birimi (örneğin USD veya EUR) üzerinden gerçekleştirilir. Döviz kuru farklarından doğan küçük farklılıklar kullanıcıya yansıyabilir.</li>
                    </ol>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">3. Değişim İşlemleri</h2>
                    <p className="mb-6">
                        Uluslararası gönderimlerde değişim işlemleri yalnızca hatalı veya hasarlı ürünlerde mümkündür.
                        Beğeniye dayalı değişim yapılmamaktadır.
                    </p>

                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mt-8 mb-4">4. Teslimatın Gerçekleşmemesi Durumları</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Alıcının yanlış veya eksik adres bilgisi vermesi</li>
                        <li>Gümrük ödemelerinin yapılmaması</li>
                        <li>Kargo firmasının teslimatı gerçekleştirememesi durumlarında, ürün geri dönerse yeniden gönderim ücreti kullanıcıya aittir.</li>
                    </ul>
                    <p className="mb-6">
                        Bu durumlarda ürün bedelinden kargo ve işlem ücretleri düşülerek iade yapılabilir.
                    </p>

                    <div className="bg-primary/10 border-l-4 border-primary p-6 mt-8">
                        <h3 className="font-bold text-dark-blue dark:text-white mb-2">5. İletişim</h3>
                        <p>Teslimat veya iade işlemleriyle ilgili her türlü soru için:</p>
                        <p className="mt-2">📧 supplyix@supplyix.com</p>
                        <p>📍 İstanbul, Zeytinburnu</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryReturnsPage;
