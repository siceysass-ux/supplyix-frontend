import React from 'react';

interface FooterProps {
  navigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {

  const footerLinks = {
    company: [
      { name: 'Blog', path: '/blog' },
      { name: 'İletişim', path: '/iletisim' },
    ],
    legal: [
      { name: 'Gizlilik Politikası', path: '/privacy-policy' },
      { name: 'Mesafeli Satış Sözleşmesi', path: '/sales-agreement' },
      { name: 'Teslimat ve İade', path: '/delivery-returns' },
    ],
  };

  return (
    <>
      {/* Trust Badges Section */}
      <section className="py-8 bg-slate-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* 7/24 Support Badge */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-dark-blue dark:text-white text-sm">7/24 Destek</h3>
                <p className="text-xs text-gray-600 dark:text-slate-400">Her zaman yanınızdayız</p>
              </div>
            </div>

            {/* SSL Certificate Badge */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-dark-blue dark:text-white text-sm">SSL Güvenliği</h3>
                <p className="text-xs text-gray-600 dark:text-slate-400">Sectigo Sertifikalı</p>
              </div>
            </div>

            {/* Secure Payment Badge with iyzico */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-dark-blue dark:text-white text-sm">Güvenli Ödeme</h3>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src="/Gerekli belgeler/iyzico-logo-pack/footer_iyzico_ile_ode/Colored/logo_band_colored@2x.png"
                    alt="iyzico ile öde"
                    className="h-5 object-contain"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t-2 border-primary">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

            {/* Company Info */}
            <div>
              <div className="mb-4">
                <img src="/logo.png" alt="Supplyix" className="h-10" />
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                Dropshipping işinizi büyütmenin en kolay yolu. Stoksuz satış yapın, kazancınızı artırın.
              </p>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                <p className="font-semibold text-dark-blue dark:text-white mb-1">Supplyix Inc.</p>
                <p>İstanbul, Zeytinburnu</p>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold text-dark-blue dark:text-white mb-4">Şirket</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links + Social Media */}
            <div>
              <h3 className="text-lg font-bold text-dark-blue dark:text-white mb-4">Yasal</h3>
              <ul className="space-y-2 mb-6">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div>
                <p className="text-sm font-semibold text-dark-blue dark:text-white mb-2">Bizi Takip Edin</p>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/supplyix/?hl=tr" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-slate-400 hover:text-primary transition-colors" aria-label="Instagram">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" /></svg>
                  </a>
                  <a href="https://www.youtube.com/@Supplyix" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-slate-400 hover:text-primary transition-colors" aria-label="YouTube">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.802 5.513c.844.23 1.522.908 1.752 1.762C22 8.84 22 12 22 12s0 3.16-.446 4.725c-.23.854-.908 1.532-1.752 1.762C18.26 19 12 19 12 19s-6.26 0-7.802-.513c-.844-.23-1.522-.908-1.752-1.762C2 15.16 2 12 2 12s0-3.16.446-4.725c.23-.854.908-1.532 1.752-1.762C5.74 5 12 5 12 5s6.26 0 7.802.513zM9.545 15.455V8.545L15.364 12 9.545 15.455z" clipRule="evenodd" /></svg>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-slate-400 text-center">
              © {new Date().getFullYear()} Supplyix Inc. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;