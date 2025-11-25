# SEO Kontrol Listesi ve Rehber

## ✅ Tamamlanan İyileştirmeler

### Teknik SEO
- [x] Meta title ve description (Türkçe optimize edilmiş)
- [x] Meta keywords (hedef anahtar kelimeler)
- [x] Open Graph tags (Facebook/sosyal medya)
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Hreflang tags (tr-TR)
- [x] Robots meta tag
- [x] Geo tags (Türkiye)
- [x] Theme color
- [x] Apple touch icon
- [x] PWA manifest.json
- [x] robots.txt dosyası
- [x] sitemap.xml dosyası
- [x] Dinamik SEO sistemi (her sayfa için)

### Yapılandırılmış Veri (Schema.org)
- [x] Organization schema
- [x] WebSite schema
- [x] LocalBusiness schema
- [x] FAQPage schema
- [x] BreadcrumbList schema

### İçerik SEO
- [x] H1 tag optimizasyonu (anahtar kelimeler)
- [x] Semantic HTML kullanımı
- [x] Alt text'ler (görseller için)
- [x] Internal linking

---

## 🚀 Yapılacaklar (Deployment Sonrası)

### 1. Google Search Console Kurulumu

**Adımlar:**
1. https://search.google.com/search-console adresine git
2. "Mülk Ekle" > "URL öneki" seç
3. `https://www.supplyix.com` gir
4. Doğrulama yöntemi seç:
   - **HTML tag** (önerilen): Meta tag'i `index.html`'e ekle
   - **HTML dosyası**: Doğrulama dosyasını `/public` klasörüne yükle
   - **Google Analytics**: Zaten kurulu ✅
5. Sitemap gönder: `https://www.supplyix.com/sitemap.xml`

**Yapılacak İşlemler:**
- [ ] Site ownership doğrulama
- [ ] Sitemap gönderimi
- [ ] URL inspection (tüm sayfalar)
- [ ] Mobile usability testi
- [ ] Core Web Vitals kontrolü
- [ ] Index coverage raporu inceleme

### 2. Bing Webmaster Tools

**Adımlar:**
1. https://www.bing.com/webmasters adresine git
2. Google Search Console'dan import et (kolay yol)
3. Veya manuel olarak site ekle
4. Sitemap gönder: `https://www.supplyix.com/sitemap.xml`

**Yapılacak İşlemler:**
- [ ] Site ekleme ve doğrulama
- [ ] Sitemap gönderimi
- [ ] SEO raporu inceleme

### 3. Yandex Webmaster

**Adımlar:**
1. https://webmaster.yandex.com adresine git
2. Site ekle: `https://www.supplyix.com`
3. Doğrulama yap
4. Sitemap gönder

**Yapılacak İşlemler:**
- [ ] Site ekleme
- [ ] Sitemap gönderimi
- [ ] Indexing kontrolü

---

## 📊 SEO Testleri

### Lighthouse Audit
```bash
# Chrome DevTools > Lighthouse
# Veya komut satırı:
npx lighthouse https://www.supplyix.com --view
```

**Hedef Skorlar:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Google Rich Results Test
1. https://search.google.com/test/rich-results
2. URL gir: `https://www.supplyix.com`
3. Tüm schema'ların doğru göründüğünü kontrol et:
   - Organization
   - WebSite
   - LocalBusiness
   - FAQPage

### Mobile-Friendly Test
1. https://search.google.com/test/mobile-friendly
2. URL gir: `https://www.supplyix.com`
3. Tüm sayfaların mobile-friendly olduğunu doğrula

### PageSpeed Insights
1. https://pagespeed.web.dev/
2. URL gir: `https://www.supplyix.com`
3. Hem mobile hem desktop test et
4. Core Web Vitals'ı kontrol et:
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

### Social Media Preview
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

---

## 🔍 Anahtar Kelime Takibi

### Hedef Anahtar Kelimeler (Öncelik Sırası)

**Yüksek Öncelik:**
1. dropshipping türkiye
2. toptan ürün tedarik
3. çin'den toptan alışveriş
4. stoksuz satış

**Orta Öncelik:**
5. 1688 türkiye
6. taobao türkiye
7. alibaba türkiye dropshipping
8. e-ticaret tedarikçi

**Düşük Öncelik (Uzun Kuyruk):**
9. dropshipping ile para kazanma
10. çin'den ürün getirme
11. trendyol için toptan ürün
12. hepsiburada için tedarikçi

### Takip Araçları
- Google Search Console (ücretsiz)
- Google Analytics (ücretsiz, zaten kurulu ✅)
- Ahrefs (ücretli)
- SEMrush (ücretli)
- Ubersuggest (freemium)

---

## 📝 İçerik Stratejisi

### Blog Yazıları (SEO-Friendly)

**Öncelikli Konular:**
1. **"Dropshipping ile Para Kazanma Rehberi 2025"**
   - Hedef: "dropshipping ile para kazanma"
   - Uzunluk: 2000+ kelime
   - İçerik: Adım adım rehber, başarı hikayeleri

2. **"Çin'den Ürün Getirme: 1688 vs Taobao vs Alibaba"**
   - Hedef: "çin'den ürün getirme", "1688 türkiye"
   - Uzunluk: 1500+ kelime
   - İçerik: Karşılaştırma, fiyat analizi

3. **"Trendyol'da Satış Yapmak İçin En İyi Ürünler"**
   - Hedef: "trendyol satıcı", "trendyol için toptan ürün"
   - Uzunluk: 1200+ kelime
   - İçerik: Trend analizi, ürün önerileri

4. **"Dropshipping Nedir? Başlangıç Rehberi"**
   - Hedef: "dropshipping nedir"
   - Uzunluk: 1800+ kelime
   - İçerik: Temel bilgiler, avantajlar, dezavantajlar

5. **"E-Ticaret Başarı Hikayeleri: Supplyix Kullanıcıları"**
   - Hedef: Brand awareness
   - Uzunluk: 1000+ kelime
   - İçerik: Müşteri testimonials, kazanç örnekleri

### İçerik Takvimi
- Haftalık 1 blog yazısı
- Ayda 4-5 kaliteli içerik
- Her yazıda:
  - Hedef anahtar kelime
  - Internal linkler
  - External linkler (authority sites)
  - Görseller (alt text ile)
  - CTA (Call to Action)

---

## 🔗 Backlink Stratejisi

### 1. Guest Posting (Misafir Yazılar)
**Hedef Siteler:**
- Webrazzi (teknoloji/startup)
- ShiftDelete.Net (teknoloji)
- E-ticaret Mag (e-ticaret)
- Pazarlamasyon (pazarlama)
- Dijital Pazarlama Blog'ları

**Yaklaşım:**
- Kaliteli, değer katan içerik sun
- Dofollow link iste
- Yazarın bio'sunda Supplyix linki

### 2. Forum Katılımı
**Hedef Forumlar:**
- Webrazzi Forum
- Donanım Haber Forum
- E-ticaret forumları
- Reddit (r/ecommerce, r/dropshipping)

**Yaklaşım:**
- Spam yapma
- Gerçek değer kat
- Signature'da link

### 3. Directory Submissions
**Türk Dizinler:**
- Google İşletme Profili (öncelik!)
- Yandex Haritalar
- Bing Places
- Foursquare
- Yelp

### 4. Influencer İşbirlikleri
**Hedef Influencer'lar:**
- E-ticaret YouTube kanalları
- Dropshipping Instagram hesapları
- TikTok e-ticaret creators

**Yaklaşım:**
- Sponsorlu içerik
- Affiliate program
- Ürün inceleme videoları

### 5. Press Release
**Hedef Medya:**
- Webrazzi
- Startup.ist
- TechCrunch (Türkiye)
- E-ticaret haberleri

---

## 🌍 Yerel SEO (Local SEO)

### Google İşletme Profili
**Yapılacaklar:**
- [ ] Profil oluştur
- [ ] İşletme bilgileri ekle
- [ ] Kategori: "E-ticaret Hizmeti", "Toptan Satıcı"
- [ ] Türkiye lokasyonu ekle
- [ ] Çalışma saatleri: 7/24
- [ ] Fotoğraflar ekle (logo, ofis, vb.)
- [ ] İlk 5 yorum topla
- [ ] Düzenli post paylaş

### Yerel Anahtar Kelimeler
- "dropshipping türkiye"
- "toptan ürün tedarik istanbul"
- "e-ticaret tedarikçi ankara"
- "stoksuz satış izmir"

---

## 📈 Performans Takibi

### Haftalık Kontroller
- [ ] Google Search Console - Index coverage
- [ ] Google Analytics - Organik trafik
- [ ] Anahtar kelime sıralamaları
- [ ] Backlink sayısı

### Aylık Raporlar
- [ ] Organik trafik artışı
- [ ] Anahtar kelime sıralamalarındaki değişim
- [ ] Conversion rate (kayıt/satış)
- [ ] Bounce rate
- [ ] Average session duration
- [ ] Pages per session

### KPI'lar (Key Performance Indicators)
- **Organik Trafik**: Aylık %20+ artış hedefi
- **Anahtar Kelime Sıralaması**: İlk 10'a giriş
- **Conversion Rate**: %2+ hedefi
- **Bounce Rate**: %50 altı hedefi
- **Domain Authority**: 30+ (6 ay içinde)

---

## 🛠️ Teknik İyileştirmeler (Devam Eden)

### Performans
- [ ] TailwindCSS CDN'den build-time'a geçiş
- [ ] Image optimization (WebP)
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Minification
- [ ] Compression (gzip/brotli)
- [ ] CDN kullanımı

### Güvenlik
- [x] HTTPS (zaten var ✅)
- [ ] Security headers
- [ ] CSP (Content Security Policy)

---

## 📞 İletişim ve Destek

SEO ile ilgili sorularınız için:
- Google Search Console Help
- Bing Webmaster Help
- SEO toplulukları (Reddit, Facebook grupları)
- SEO uzmanı danışmanlık (gerekirse)

---

## 🎯 Beklenen Sonuçlar

### 1-3 Ay
- Google indexlenme ✅
- Branded aramalar için 1. sıra ("supplyix")
- İlk 10 sayfada görünürlük (bazı anahtar kelimeler)
- 100-500 aylık organik ziyaretçi

### 3-6 Ay
- Ana anahtar kelimeler için ilk 3 sayfa
- 500-2000 aylık organik ziyaretçi
- Organik trafik artışı %200+
- Domain authority 20-30

### 6-12 Ay
- "Dropshipping Türkiye" için ilk 5
- Uzun kuyruk kelimelerde 1. sıra
- 2000-5000+ aylık organik ziyaretçi
- Domain authority 30-40
- Organik trafik dominasyonu

---

> **Not:** SEO bir maraton, sprint değildir. Sabırlı olun ve sürekli iyileştirme yapın!
