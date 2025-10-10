import React from 'react';

interface DashboardPageProps {
    navigate: (path: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
    
    const handleLogout = () => {
        // Here you would typically clear user session, tokens, etc.
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-neutral">
            {/* Dashboard Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <img src="/logo.png" alt="Supplyix Logo" className="h-12 w-auto" />
                    <button 
                        onClick={handleLogout}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-dark-blue mb-4">Hoş Geldiniz!</h1>
                    <p className="text-gray-600">
                        Supplyix kontrol panelinize başarıyla giriş yaptınız. Burası sizin başlangıç noktanız.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
