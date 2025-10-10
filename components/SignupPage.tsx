import React, { useState, useEffect } from 'react';

interface SignupPageProps {
    navigate: (path: string) => void;
    plan: string | null;
    price: string | null;
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
Veriler; yasal yükümlülüklerin gerektirdiği durumlarda resmi kurumlara, tedarikçilere, iş ortaklarına, ödeme kuruluşlarına ve yurt dışında veri saklama hizmeti sunan altyapı sağlayıcılara aktarılabilir.

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
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-dark-blue">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors text-3xl font-light" aria-label="Kapat">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto" style={{ whiteSpace: 'pre-line' }}>
                    {content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200 text-right">
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
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none z-0">{confettiPieces}</div>
            <div className="relative bg-white p-8 md:p-12 rounded-xl shadow-2xl animate-scale-in z-10">
                <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-dark-blue mb-4">Hoş Geldiniz!</h1>
                <p className="text-gray-600">
                    Kaydınız başarıyla tamamlandı.
                </p>
                <p className="text-sm text-gray-500 mt-6">
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


const SignupPage: React.FC<SignupPageProps> = ({ navigate, plan, price }) => {
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
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [modalContent, setModalContent] = useState<{title: string, content: string} | null>(null);
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

    useEffect(() => {
        if (!plan) {
            navigate('/'); // Redirect to home if no plan is selected
        }
    }, [plan, navigate]);

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
        const newErrors: Record<string, string> = {};
        if (!formData.cardName.trim()) newErrors.cardName = 'Kart sahibi adı zorunludur.';
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Kart numarası zorunludur.';
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Son kullanma tarihi zorunludur.';
        if (!formData.cardCVC.trim()) newErrors.cardCVC = 'CVC zorunludur.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep3()) {
            // Simulate final submission
            console.log("Form Submitted: ", formData);
            setIsRegistrationComplete(true);
            setTimeout(() => {
                navigate('/login');
            }, 5000); // Redirect after 5 seconds
        }
    };
    
    if (isRegistrationComplete) {
        return <RegistrationSuccess />;
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-xl font-bold text-dark-blue mb-4">Adım 1: Kişisel Bilgiler</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ad Soyad *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Şifre *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Şifreyi Doğrula *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon Numarası *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="tcKimlik" value={formData.tcKimlik} onChange={handleChange} placeholder="T.C. Kimlik No *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.tcKimlik ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="vergiKimlik" value={formData.vergiKimlik} onChange={handleChange} placeholder="Vergi Kimlik No (Opsiyonel)" className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300" />
                            <input name="referans" value={formData.referans} onChange={handleChange} placeholder="Referans Kodu (Opsiyonel)" className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300" />
                        </div>
                        <div className="mt-4 space-y-2">
                            <label className="flex items-start text-sm text-gray-600">
                                <input type="checkbox" name="acceptPrivacy" checked={formData.acceptPrivacy} onChange={handleChange} className="mt-1 mr-2 h-4 w-4" />
                                <span>Supplyix’e üye olarak kişisel verilerimin, <button type="button" onClick={() => setModalContent({ title: privacyPolicyTitle, content: privacyPolicyText })} className="text-primary underline font-semibold">Aydınlatma Metni</button> kapsamında işlenmesini kabul ediyorum.</span>
                            </label>
                            <label className="flex items-start text-sm text-gray-600">
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
                        <h2 className="text-xl font-bold text-dark-blue mb-4">Adım 2: Kullandığınız Platformlar</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {platformsData.map(p => (
                                <label key={p.name} className={`p-4 border rounded-lg cursor-pointer text-center font-semibold flex items-center justify-center h-20 transition-colors ${formData.platforms.includes(p.name) ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`}>
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
                         <h2 className="text-xl font-bold text-dark-blue mb-6">Adım 3: Ödeme Bilgileri</h2>
                         <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mb-6 text-center">
                            <p className="font-bold text-dark-blue">Seçilen Plan: <span className="text-primary">{plan}</span> - <span className="text-primary">${price}</span></p>
                         </div>
                         <div className="space-y-4">
                            <input name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Kart Üzerindeki İsim *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`} />
                            <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Kart Numarası *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`} />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} placeholder="MM/YY *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'}`} />
                                <input name="cardCVC" value={formData.cardCVC} onChange={handleChange} placeholder="CVC *" className={`w-full bg-gray-50 p-3 rounded-lg border ${errors.cardCVC ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                         </div>
                    </div>
                );
        }
    };
    
    const steps = ['Kişisel Bilgiler', 'Platformlar', 'Ödeme'];

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            {modalContent && <LegalModal title={modalContent.title} content={modalContent.content} onClose={() => setModalContent(null)} />}
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
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step > i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {step > i ? '✓' : i + 1}
                                </div>
                                <p className={`mt-2 text-xs text-center font-semibold ${step > i ? 'text-primary' : 'text-gray-500'}`}>{s}</p>
                            </div>
                            {i < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > i + 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-xl">
                    <form onSubmit={handleSubmit} noValidate>
                        {renderStep()}
                        <div className="mt-8 flex justify-between">
                            {step > 1 ? (
                                <button type="button" onClick={handleBack} className="bg-gray-200 text-dark-blue font-bold py-3 px-8 rounded-lg hover:bg-gray-300">Geri</button>
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