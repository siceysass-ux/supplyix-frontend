
import React, { useState } from 'react';
import { UserRole } from '../types';

interface CreateUserModalProps {
    onClose: () => void;
    onSave: (user: { email: string, password?: string, role: UserRole }) => void | Promise<void>;
}

const roles: { role: UserRole, name: string, description: string }[] = [
    { role: 'member', name: 'Member', description: 'Normal üye, kullanıcı paneline erişir.' },
    { role: 'admin', name: 'Admin', description: 'Tüm admin paneli özelliklerine tam erişim.' },
    { role: 'product lister', name: 'Product Lister', description: 'Sadece ürünleri ve kategorileri yönetebilir.' },
    { role: 'influencer', name: 'Influencer', description: 'Özel influencer paneline erişim sağlar.' },
];

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<UserRole>('member');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = () => {
        setError('');
        setStep(2);
    };

    const handleBack = () => {
        setError('');
        setStep(1);
    };

    const handleSave = async () => {
        // Validation
        if (!email.trim() || !password.trim()) {
            setError('E-posta ve şifre alanları zorunludur.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Geçersiz e-posta adresi.');
            return;
        }
        if (password.length < 8) {
            setError('Şifre en az 8 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onSave({ email, password, role });
            // Success - close modal
            onClose();
        } catch (err: any) {
            // Handle error
            setError(err?.message || 'Kullanıcı oluşturulurken bir hata oluştu.');
            console.error('Create user error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">Yeni Kullanıcı Oluştur (Adım {step}/2)</h2>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                    {step === 1 && (
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3">1. Rol Seçimi</h3>
                            <div className="space-y-2">
                                {roles.map(r => (
                                    <label
                                        key={r.role}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${role === r.role ? 'bg-primary/10 border-primary' : 'border-slate-300 hover:border-slate-400'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={r.role}
                                            checked={role === r.role}
                                            onChange={() => setRole(r.role)}
                                            className="h-4 w-4 text-primary focus:ring-primary"
                                        />
                                        <span className="ml-3 flex flex-col">
                                            <span className="font-bold text-dark-blue">{r.name}</span>
                                            <span className="text-xs text-slate-500">{r.description}</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3">2. Kimlik Bilgileri</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Seçilen Rol</label>
                                    <p className="font-bold text-primary mt-1">{roles.find(r => r.role === role)?.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">E-posta Adresi *</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Şifre *</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 flex justify-between rounded-b-xl">
                    {step === 1 ? (
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            İptal
                        </button>
                    ) : (
                        <button
                            onClick={handleBack}
                            disabled={isLoading}
                            className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Geri
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Devam
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLoading ? 'Oluşturuluyor...' : 'Kullanıcıyı Oluştur'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;