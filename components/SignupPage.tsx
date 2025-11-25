import React, { useState, useEffect } from 'react';
import PaymentFailureModal from './dashboard/shared/PaymentFailureModal';
import PaymentModal from './dashboard/shared/PaymentModal';
import { InfluencerCode } from './dashboard/types';

interface SignupPageProps {
    navigate: (path: string) => void;
    plan: string | null;
    price: string | null;
    influencerCodes: InfluencerCode[];
    onCreateUser: (userData: {
        fullName: string;
        email: string;
        password: string;
        phone: string;
        tcKimlik: string;
        vergiKimlik: string;
        referans: string;
        platforms: string[];
        plan: string;
        price: number;
    }) => void;
}

const platformsData = [
    { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/64px-2021_Facebook_icon.svg.png" },
    { name: "Wix", logo: "https://logo.clearbit.com/wix.com" },
    { name: "WooCommerce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/WooCommerce_logo.svg/128px-WooCommerce_logo.svg.png" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/128px-Amazon_logo.svg.png" },
    { name: "Etsy", logo: "https://logo.clearbit.com/etsy.com" },
    { name: "Tiktok", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/128px-TikTok_logo.svg.png" },
    { name: "Shopify", logo: "https://logo.clearbit.com/shopify.com" },
    { name: "eBay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/128px-EBay_logo.svg.png" },
    { name: "Diğer", logo: null }
];

const privacyPolicyTitle = "Supplyix Aydınlatma Metni";
const privacyPolicyText = `Kişisel Verilerin Korunması Hakkında Aydınlatma Metni

Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, Supplyix tarafından veri sorumlusu sıfatıyla hazırlanmıştır.

1. Veri Sorumlusu:
Supplyix (“Şirket”), kullanıcıların kişisel verilerini KVKK ve ilgili mevzuata uygun şekilde işler.

2. İşlenen Kişisel Veriler:
Ad, soyad, e-posta adresi, telefon numarası, IP bilgisi, ödeme bilgileri, işlem geçmişi, talep ve şikayet kayıtları gibi veriler işlenebilir.

3. İşleme Amaçları:
- Platformun işletilmesi, üyelik oluşturma ve hizmet sunumu,
- Sipariş, ödeme ve tedarik süreçlerinin yürütülmesi,
- Müşteri ilişkilerinin yönetimi,
- Hukuki yükümlülüklerin yerine getirilmesi,
- Hizmet kalitesinin artırılması ve kullanıcı deneyiminin geliştirilmesi.

4. Aktarım:
Veriler; yasal yükümlülüklerin gerektirdiği durumlarda resmi kurumlara, tedarikçilere, iş ortaklarına, ödeme kuruluşlarına ve yurt dışında veri saklama hizmeti sunan altopı sağlayıcılara aktarılabilir.

5. Saklama Süresi:
Veriler, ilgili mevzuatta öngörülen veya işleme amaçları için gerekli süre boyunca saklanır; sonrasında güvenli şekilde silinir veya anonimleştirilir.

6. Haklarınız:
KVKK m.11 kapsamında kullanıcılar; verilerine erişme, düzeltilmesini talep etme, silinmesini veya aktarılmasını isteme haklarına sahiptir. Bu talepler, [destek@supplyix.com](mailto:destek@supplyix.com) adresine e-posta gönderilerek iletilebilir.

7. Sorumluluk Reddi:
Supplyix, kullanıcıların platform üzerinden paylaştığı verilerin doğruluğundan sorumlu değildir. Kullanıcılar, paylaştıkları verilerin doğruluğundan ve güncelliğinden bizzat sorumludur.`;

const termsOfServiceTitle = "Supplyix Üyelik Sözleşmesi";
const termsOfServiceText = `ÜYELİK SÖZLEŞMESİ
İşbu sözleşme, Supplyix platformuna (“Platform”) üye olan gerçek veya tüzel kişi (“Üye”) ile Supplyix arasında akdedilmiştir.

1. Taraflar ve Kabul:
Üye, Platform’a üye olurken bu sözleşmede yer alan koşulları elektronik ortamda onayladığında, işbu sözleşmenin tüm hükümlerini kabul etmiş sayılır.

2. Hizmetin Konusu:
Supplyix, tedarikçi havuzu, ürün listeleme ve sipariş yönlendirme hizmeti sunar. Platform, yalnızca aracı rolündedir; ürünlerin tedarik, kalite, teslimat, kargo veya müşteri ilişkilerinden doğacak hiçbir doğrudan sorumluluğu bulunmaz.

3. Üyenin Yükümlülükleri:
- Platformu sadece yasal amaçlarla kullanmak,
- Ürün ve içerik bilgilerinin doğruluğunu sağlamak,
- Müşterilerine karşı tüm satış, teslimat ve iade süreçlerinden münhasıran sorumlu olmak,
- Üçüncü kişilerin haklarını ihlal etmeyecek şekilde hareket etmek,
- Platformda kendi hesabının güvenliğinden bizzat sorumlu olmak.

4. Supplyix’in Hakları ve Sorumluluk Reddi:
- Supplyix, hizmetleri dilediği zaman değiştirme, askıya alma veya sona erdirme hakkına sahiptir.
- Platform, kullanıcılar arası işlemlerde yalnızca aracıdır; hiçbir satış veya teslimat işleminin tarafı değildir.
- Üye’nin eylemleri veya ihlalleri nedeniyle doğacak zararlardan Supplyix sorumlu tutulamaz.
- Platform, teknik sorunlar veya üçüncü taraf hizmet sağlayıcılarından kaynaklanan aksaklıklardan dolayı herhangi bir tazmin yükümlülüğü altına girmez.

5. Fikri Mülkiyet:
Platformdaki tüm yazılım, tasarım, logo ve içeriklerin telif hakkı Supplyix’e aittir. Üye, bunları izinsiz kullanamaz.

6. Fesih:
Supplyix, üyelik koşullarına aykırılık tespit edilmesi halinde üyeliği tek taraflı olarak iptal edebilir. Üye de dilediği an üyeliğini sonlandırabilir.

7. Uygulanacak Hukuk ve Yetki:
İşbu sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Taraflar, tüm uyuşmazlıklarda İstanbul Merkez Mahkemeleri ve İcra Dairelerinin yetkili olduğunu kabul eder.

8. Yürürlük:
Üye, Platform’a kayıt olarak işbu sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder.`;


interface LegalModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ title, content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-200 transition-colors text-3xl font-light" aria-label="Kapat">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto" style={{ whiteSpace: 'pre-line' }}>
                    {content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 dark:text-slate-300">{paragraph}</p>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-slate-700 text-right">
                    <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">Kapat</button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    return <div className="absolute w-2 h-4" style={style}></div>;
};

const RegistrationSuccess: React.FC = () => {
    const confettiColors = ['#ff6a00', '#042d4d', '#FBBF24', '#34D399'];
    const confettiPieces = Array.from({ length: 150 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * -80}%`,
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
        };
        return <ConfettiPiece key={i} style={style} />;
    });

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none z-0">{confettiPieces}</div>
            <div className="relative bg-white dark:bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl animate-scale-in z-10">
                <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-dark-blue dark:text-slate-100 mb-4">Hoş Geldiniz!</h1>
                <p className="text-gray-600 dark:text-slate-300">
                    Kaydınız başarıyla tamamlandı.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-6">
                    Giriş yapma sayfasına yönlendiriliyorsunuz...
                </p>
            </div>
            <style>{`
                @keyframes confetti-fall {
                    from { transform: translateY(0) rotate(0); opacity: 1; }
                    to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </main>
    );
};


const SignupPage: React.FC<SignupPageProps> = ({ navigate, plan, price, influencerCodes, onCreateUser }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        tcKimlik: '',
        vergiKimlik: '',
        referans: '',
        acceptTerms: false,
        acceptPrivacy: false,
        platforms: [] as string[],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [modalContent, setModalContent] = useState<{ title: string, content: string } | null>(null);
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
    const [showPaymentFailure, setShowPaymentFailure] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Discount state
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; rate: number } | null>(null);
    const [referralFeedback, setReferralFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const originalPrice = price ? parseFloat(price) : 0;
    const finalPrice = appliedDiscount
        ? originalPrice * (1 - appliedDiscount.rate / 100)
        : originalPrice;

    useEffect(() => {
        document.title = 'Supplyix - Kayıt Ol';
        if (!plan) {
            navigate('/'); // Redirect to home if no plan is selected
        }
    }, [plan, navigate]);

    const handleReferralCodeCheck = (codeValue: string) => {
        setReferralFeedback(null);
        setAppliedDiscount(null);

        if (!codeValue.trim()) {
            return;
        }

        const code = influencerCodes.find(c => c.code.toLowerCase() === codeValue.trim().toLowerCase());

        if (code) {
            // Check if code is valid for the selected plan
            if (code.validPlans && code.validPlans.length > 0 && plan && !code.validPlans.includes(plan)) {
                setReferralFeedback({
                    message: `Bu kod seçtiğiniz "${plan}" paketi için geçerli değildir.`,
                    type: 'error'
                });
                return;
            }

            if (code.discountRate) {
                setAppliedDiscount({ code: code.code, rate: code.discountRate });
                setReferralFeedback({ message: `Başarılı! %${code.discountRate} indirim kazandınız.`, type: 'success' });
            } else {
                setReferralFeedback({ message: 'Referans kodu geçerli ancak indirim içermiyor.', type: 'error' });
            }
        } else {
            setReferralFeedback({ message: 'Geçersiz referans kodu.', type: 'error' });
        }
    };
    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Ad Soyad zorunludur.';
        if (!formData.email.trim()) newErrors.email = 'E-posta zorunludur.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçersiz e-posta adresi.';
        if (!formData.password) newErrors.password = 'Şifre zorunludur.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor.';
        if (!formData.phone.trim()) newErrors.phone = 'Telefon numarası zorunludur.';
        if (!formData.tcKimlik.trim()) newErrors.tcKimlik = 'T.C. Kimlik No zorunludur.';
        if (!formData.acceptTerms || !formData.acceptPrivacy) newErrors.agreements = 'Sözleşmeleri kabul etmelisiniz.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (formData.platforms.length === 0) {
            newErrors.platforms = 'Lütfen en az bir platform seçin.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const validateStep3 = () => {
        // No validation needed, PaymentModal handles card validation
        return true;
    }

    const handleNext = () => {
        let isValid = false;
        if (step === 1) isValid = validateStep1();
        if (step === 2) isValid = validateStep2();

        if (isValid) {
            setStep(s => s + 1);
        }
    };

    const handleBack = () => {
        setErrors({});
        setStep(s => s - 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            const matches = v.match(/\d{4,16}/g);
            const match = (matches && matches[0]) || '';
            const parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            const formatted = parts.length ? parts.join(' ') : value;
            if (formatted.length <= 19) { // 16 digits + 3 spaces
                setFormData(prev => ({ ...prev, cardNumber: formatted }));
            }
            return;
        }

        // Format expiry date with slash
        if (name === 'cardExpiry') {
            const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            const formatted = v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
            if (formatted.length <= 5) {
                setFormData(prev => ({ ...prev, cardExpiry: formatted }));
            }
            return;
        }

        // Format CVC (only numbers, max 3 digits)
        if (name === 'cardCVC') {
            const formatted = value.replace(/\D/g, '').substring(0, 3);
            setFormData(prev => ({ ...prev, cardCVC: formatted }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'referans') {
            setReferralFeedback(null);
            setAppliedDiscount(null);
        }
    };

    const handlePlatformChange = (platform: string) => {
        setFormData(prev => {
            const newPlatforms = prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform];
            return { ...prev, platforms: newPlatforms };
        });
        if (errors.platforms) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.platforms;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep3()) {
            // Just open payment modal, let it handle the payment
            setShowPaymentModal(true);
        }
    };

    const handlePaymentSuccess = async (paymentId: string) => {
        console.log('Payment successful:', paymentId);
        setShowPaymentModal(false);

        // Track influencer code usage if applied
        if (appliedDiscount) {
            try {
                await fetch('/api/settings/influencer-codes/use/' + appliedDiscount.code, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: finalPrice })
                });
            } catch (error) {
                console.error('Failed to track code usage:', error);
            }
        }

        // Create user
        onCreateUser({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            tcKimlik: formData.tcKimlik,
            vergiKimlik: formData.vergiKimlik,
            referans: formData.referans,
            platforms: formData.platforms,
            plan: plan || '',
            price: finalPrice,
        });

        setIsRegistrationComplete(true);
        setTimeout(() => {
            navigate('/giris');
        }, 5000);
    };

    const handlePaymentFailure = (error: string) => {
        console.error('Payment failed:', error);
        setShowPaymentModal(false);
        setShowPaymentFailure(true);
    };

    if (isRegistrationComplete) {
        return <RegistrationSuccess />;
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100 mb-4">Adım 1: Kişisel Bilgiler</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ad Soyad *" className={`w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`} />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email *" className={`w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`} />
                            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Şifre *" className={`w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`} />
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Şifreyi Doğrula *" className={`w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`} />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon Numarası *" className={`w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`} />
                            <input name="tcKimlik" value={formData.tcKimlik} onChange={handleChange} placeholder="T.C. Kimlik No *" className={`w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border ${errors.tcKimlik ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`} />
                            <input name="vergiKimlik" value={formData.vergiKimlik} onChange={handleChange} placeholder="Vergi Kimlik No (Opsiyonel)" className="w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border border-gray-300 dark:border-slate-600" />
                            <div>
                                <input name="referans" value={formData.referans} onChange={handleChange} onBlur={(e) => handleReferralCodeCheck(e.target.value)} placeholder="Referans Kodu (Opsiyonel)" className="w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border border-gray-300 dark:border-slate-600" />
                                {referralFeedback && (
                                    <p className={`text-xs mt-1 ${referralFeedback.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                        {referralFeedback.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <label className="flex items-start text-sm text-gray-600 dark:text-slate-300">
                                <input type="checkbox" name="acceptPrivacy" checked={formData.acceptPrivacy} onChange={handleChange} className="mt-1 mr-2 h-4 w-4" />
                                <span>Supplyix’e üye olarak kişisel verilerimin, <button type="button" onClick={() => setModalContent({ title: privacyPolicyTitle, content: privacyPolicyText })} className="text-primary underline font-semibold">Aydınlatma Metni</button> kapsamında işlenmesini kabul ediyorum.</span>
                            </label>
                            <label className="flex items-start text-sm text-gray-600 dark:text-slate-300">
                                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 mr-2 h-4 w-4" />
                                <span>Bununla birlikte <button type="button" onClick={() => setModalContent({ title: termsOfServiceTitle, content: termsOfServiceText })} className="text-primary underline font-semibold">Üyelik Sözleşmesi</button>’ni okudum ve kabul ediyorum.</span>
                            </label>
                            {errors.agreements && <p className="text-red-500 text-sm">{errors.agreements}</p>}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100 mb-4">Adım 2: Kullandığınız Platformlar</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {platformsData.map(p => (
                                <label key={p.name} className={`p-4 border rounded-lg cursor-pointer text-center font-semibold flex items-center justify-center h-20 transition-colors ${formData.platforms.includes(p.name) ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 dark:text-slate-200 hover:border-gray-400 dark:hover:border-slate-500'}`}>
                                    <input type="checkbox" className="hidden" onChange={() => handlePlatformChange(p.name)} />
                                    {p.logo && <img src={p.logo} alt={`${p.name} logo`} className="h-6 max-w-[24px] object-contain mr-2" />}
                                    <span className="text-sm">{p.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.platforms && <p className="text-red-500 text-sm mt-4 text-center">{errors.platforms}</p>}
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100 mb-6">Adım 3: Ödeme Onayı</h2>
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mb-6 text-center">
                            {appliedDiscount ? (
                                <>
                                    <p className="font-bold text-dark-blue dark:text-slate-200">
                                        Seçilen Plan: <span className="text-primary">{plan}</span>
                                    </p>
                                    <div className="mt-2 flex items-center justify-center gap-2">
                                        <span className="text-xl line-through text-slate-500 dark:text-slate-400">${originalPrice.toFixed(2)}</span>
                                        <span className="text-2xl font-extrabold text-dark-blue dark:text-slate-100">${finalPrice.toFixed(2)}</span>
                                        <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">%{appliedDiscount.rate} İNDİRİM</span>
                                    </div>
                                </>
                            ) : (
                                <p className="font-bold text-dark-blue dark:text-slate-200">Seçilen Plan: <span className="text-primary">{plan}</span> - <span className="text-primary">${price}</span></p>
                            )}
                        </div>

                        {appliedDiscount && (
                            <div className="mb-6 text-center">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Uygulanan Referans Kodu</p>
                                <p className="text-lg font-bold text-green-600 bg-green-100 dark:bg-green-500/20 px-3 py-1 rounded-md inline-block mt-1">
                                    {appliedDiscount.code} (%{appliedDiscount.rate} İNDİRİM)
                                </p>
                            </div>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-center">
                            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                                "Kaydı Tamamla" butonuna tıkladığınızda güvenli ödeme sayfası açılacaktır.
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Ödeme işlemi İyzico güvenli ödeme sistemi ile gerçekleştirilecektir.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    const steps = ['Kişisel Bilgiler', 'Platformlar', 'Ödeme'];

    // Prepare buyer data for payment
    const buyerData = {
        id: `user-${Date.now()}`,
        name: formData.fullName.split(' ')[0] || 'Ad',
        surname: formData.fullName.split(' ').slice(1).join(' ') || 'Soyad',
        email: formData.email,
        gsmNumber: formData.phone || '+905350000000',
        address: 'Adres bilgisi',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
        identityNumber: formData.tcKimlik || '11111111111',
        registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const paymentItem = {
        name: plan || 'Plan',
        price: finalPrice,
        description: `${plan} üyelik paketi`
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            {modalContent && <LegalModal title={modalContent.title} content={modalContent.content} onClose={() => setModalContent(null)} />}
            {showPaymentFailure && <PaymentFailureModal onClose={() => setShowPaymentFailure(false)} />}
            {showPaymentModal && (
                <PaymentModal
                    item={paymentItem}
                    buyer={buyerData}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                />
            )}
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <img src="/logo.png" alt="Supplyix Logo" className="h-16 w-auto mx-auto" />
                    </a>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-8 px-4">
                    {steps.map((s, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step > i ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                                    {step > i ? '✓' : i + 1}
                                </div>
                                <p className={`mt-2 text-xs text-center font-semibold ${step > i ? 'text-primary' : 'text-gray-500 dark:text-slate-400'}`}>{s}</p>
                            </div>
                            {i < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > i + 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-700'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl">
                    <form onSubmit={handleSubmit} noValidate>
                        {renderStep()}
                        <div className="mt-8 flex justify-between">
                            {step > 1 ? (
                                <button type="button" onClick={handleBack} className="bg-gray-200 dark:bg-slate-600 text-dark-blue dark:text-slate-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500">Geri</button>
                            ) : <div></div>}

                            {step < 3 ? (
                                <button type="button" onClick={handleNext} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus">Devam</button>
                            ) : (
                                <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus">Kaydı Tamamla</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default SignupPage;