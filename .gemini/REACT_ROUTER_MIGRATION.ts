/**
 * REACT ROUTER MIGRATION PLAN
 * Hash (#) sisteminden React Router'a geçiş
 */

// =============================================================================
// ADIM 1: Ana App.tsx Yapısı
// =============================================================================

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Ana App component'i BrowserRouter ile sarmalayın
function App() {
    return (
        <BrowserRouter>
        <ThemeProvider>
        <AppContent />
        </ThemeProvider>
        </BrowserRouter>
    );
}

// =============================================================================
// ADIM 2: Route Yapısı
// =============================================================================

function AppContent() {
    const navigate = useNavigate(); // Hash yerine bu kullanılacak

    return (
        <Routes>
        {/* Landing Page */ }
        < Route path = "/" element = {< LandingPage />} />

{/* Auth Routes */ }
<Route path="/giris" element = {< LoginPage />} />
    < Route path = "/kayit-ol" element = {< SignupPage />} />
        < Route path = "/forgot-password" element = {< ForgotPasswordPage />} />
            < Route path = "/reset-password" element = {< ResetPasswordPage />} />
                < Route path = "/verify-email" element = {< EmailVerificationPage />} />

{/* Static Pages */ }
<Route path="/iletisim" element = {< ContactPage />} />
    < Route path = "/privacy-policy" element = {< PrivacyPolicyPage />} />
        < Route path = "/sales-agreement" element = {< SalesAgreementPage />} />
            < Route path = "/delivery-returns" element = {< DeliveryReturnsPage />} />

{/* Blog */ }
<Route path="/blog" element = {< BlogListPage />} />
    < Route path = "/blog/:slug" element = {< BlogPostPage />} />

{/* Dashboard - Protected Route */ }
<Route path="/dashboard/*" element = {< DashboardPage />} />

{/* Admin - Protected Route */ }
<Route path="/admin/*" element = {< AdminPage />} />

{/* 404 */ }
<Route path="*" element = {< Navigate to = "/" replace />} />
    </Routes>
    );
}

// =============================================================================
// ADIM 3: Navigate Kullanımı
// =============================================================================

// ÖNCESİ (Hash):
const navigate = (path: string) => {
    window.location.hash = path;
};

// SONRASI (React Router):
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();

    // Kullanım:
    navigate('/dashboard');
    navigate('/admin/users');
    navigate(-1); // Geri git
}

// =============================================================================
// ADIM 4: Link Component Kullanımı
// =============================================================================

// ÖNCESİ:
<a href="#/dashboard" > Dashboard </a>

// SONRASI:
import { Link } from 'react-router-dom';
<Link to="/dashboard" > Dashboard </Link>

// =============================================================================
// ADIM 5: useEffect Değişiklikleri
// =============================================================================

// ÖNCESİ:
useEffect(() => {
    const handleHashChange = () => {
        setCurrentPath(window.location.hash.substring(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
}, []);

// SONRASI:
import { useLocation } from 'react-router-dom';

function MyComponent() {
    const location = useLocation();

    useEffect(() => {
        // location.pathname otomatik olarak güncellenir
        console.log('Current path:', location.pathname);
    }, [location.pathname]);
}

// =============================================================================
// ADIM 6: Protected Routes
// =============================================================================

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        return <Navigate to="/giris" replace />;
    }

    return <>{ children } </>;
}

// Kullanım:
<Route 
    path="/dashboard/*"
element = {
        < ProtectedRoute >
    <DashboardPage />
    </ProtectedRoute>
    } 
/>

// =============================================================================
// ADIM 7: URL Parameters
// =============================================================================

// ÖNCESİ:
const urlParams = new URLSearchParams(currentPath.split('?')[1]);
const plan = urlParams.get('plan');

// SONRASI:
import { useSearchParams } from 'react-router-dom';

function SignupPage() {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan');
    const price = searchParams.get('price');
}

// =============================================================================
// ADIM 8: Nested Routes (Dashboard & Admin)
// =============================================================================

// Dashboard içinde:
function DashboardPage() {
    return (
        <Routes>
        <Route path= "/" element = {< DashboardHome />} />
            < Route path = "/profile" element = {< ProfilePage />} />
                < Route path = "/orders" element = {< OrdersPage />} />
                    < Route path = "/requests" element = {< RequestsPage />} />
{/* ... diğer routes */ }
</Routes>
    );
}

// =============================================================================
// ADIM 9: Vite Config (Gerekli!)
// =============================================================================

// vite.config.ts
export default defineConfig({
    // ...
    server: {
        historyApiFallback: true, // SPA routing için gerekli
    }
});

// =============================================================================
// ADIM 10: Deployment Config
// =============================================================================

// public/_redirects (Netlify için):
/*    /index.html   200

// vercel.json (Vercel için):
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}

// =============================================================================
// DEĞİŞTİRİLMESİ GEREKEN DOSYALAR
// =============================================================================

/**
 * 1. App.tsx - Ana routing yapısı
 * 2. Header.tsx - Link component'leri
 * 3. Footer.tsx - Link component'leri
 * 4. DashboardPage.tsx - Nested routes
 * 5. AdminPage.tsx - Nested routes
 * 6. Tüm navigate prop'ları - useNavigate hook'u
 * 7. vite.config.ts - History API fallback
 */

// =============================================================================
// AVANTAJLAR
// =============================================================================

/**
 * ✅ SEO dostu URL'ler (# yok)
 * ✅ Browser history çalışır (back/forward)
 * ✅ Daha temiz URL yapısı
 * ✅ Protected routes kolay
 * ✅ Nested routing desteği
 * ✅ URL parameters kolay
 * ✅ Programmatic navigation
 * ✅ Link prefetching
 */

// =============================================================================
// CRUD VERİ YENİLEME - REACT ROUTER İLE
// =============================================================================

/**
 * React Router ile veri yenileme daha kolay:
 */

// Örnek: Kullanıcı oluşturduktan sonra
const handleCreateUser = async (userData) => {
    try {
        await api.createUser(userData);

        // Otomatik refetch için location değiştir
        navigate('/admin/users', { replace: true });
        // veya
        navigate(0); // Sayfayı yenile

    } catch (error) {
        console.error(error);
    }
};

// useEffect ile otomatik refetch:
useEffect(() => {
    const fetchUsers = async () => {
        const data = await api.getUsers();
        setUsers(data);
    };
    fetchUsers();
}, [location.pathname]); // Path değiştiğinde yenile

export { };
