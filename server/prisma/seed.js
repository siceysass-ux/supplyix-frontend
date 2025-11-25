"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var admin, user, user2, existingRequests, demoRequests, _i, demoRequests_1, request, existingPlans, existingPopup, existingCodes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@supplyix.com' },
                            update: {},
                            create: {
                                name: 'Admin User',
                                email: 'admin@supplyix.com',
                                password: '12345678',
                                role: 'admin',
                                phone: '+905551234567',
                                tcKimlik: '12345678901',
                                vergiKimlik: '',
                                referans: '',
                                plan: '1 Sene',
                                status: 'Aktif',
                                registrationDate: '2025-01-01',
                                subscriptionStartDate: '2025-01-01',
                                subscriptionEndDate: '2026-01-01',
                                totalSpent: 0,
                                lastLogin: new Date().toISOString(),
                                platforms: JSON.stringify([]),
                                referralCode: 'SUPPLYIX-ADM999999',
                                referredBy: null,
                                referralCount: 0,
                                referralRewards: 0,
                                emailVerified: true
                            }
                        })];
                case 1:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'user@supplyix.com' },
                            update: {},
                            create: {
                                name: 'Ahmet Yılmaz',
                                email: 'user@supplyix.com',
                                password: '12345678',
                                role: 'member',
                                phone: '+905559876543',
                                tcKimlik: '98765432109',
                                vergiKimlik: '1234567890',
                                referans: '',
                                plan: '1 Ay',
                                status: 'Aktif',
                                registrationDate: '2025-11-22',
                                subscriptionStartDate: '2025-11-22',
                                subscriptionEndDate: '2025-12-22',
                                totalSpent: 10,
                                lastLogin: new Date().toISOString(),
                                platforms: JSON.stringify(['Shopify', 'Amazon']),
                                referralCode: 'SUPPLYIX-AHM123456',
                                referredBy: null,
                                referralCount: 0,
                                referralRewards: 0,
                                emailVerified: true
                            }
                        })];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'mehmet@supplyix.com' },
                            update: {},
                            create: {
                                name: 'Mehmet Demir',
                                email: 'mehmet@supplyix.com',
                                password: '12345678',
                                role: 'member',
                                phone: '+905559871234',
                                tcKimlik: '11122233344',
                                vergiKimlik: '9876543210',
                                referans: 'REF001',
                                plan: '6 Ay',
                                status: 'Aktif',
                                registrationDate: '2025-10-15',
                                subscriptionStartDate: '2025-10-15',
                                subscriptionEndDate: '2026-04-15',
                                totalSpent: 1499,
                                lastLogin: new Date().toISOString(),
                                platforms: JSON.stringify(['Amazon', 'eBay']),
                                referralCode: 'SUPPLYIX-MEH789012',
                                referredBy: null,
                                referralCount: 0,
                                referralRewards: 0,
                                emailVerified: true
                            }
                        })];
                case 3:
                    user2 = _a.sent();
                    console.log('✅ Admin user created:', admin.email);
                    console.log('✅ Test user 1 created:', user.email);
                    console.log('✅ Test user 2 created:', user2.email);
                    // Create demo requests
                    console.log('\n🔄 Creating demo requests...');
                    return [4 /*yield*/, prisma.request.findMany()];
                case 4:
                    existingRequests = _a.sent();
                    if (!(existingRequests.length === 0)) return [3 /*break*/, 9];
                    demoRequests = [
                        {
                            type: 'Danışmanlık',
                            userId: user.id,
                            title: 'Amazon FBA Kurulumu',
                            explanation: 'Amazon FBA için hesap kurulumu ve ürün listeleme konusunda danışmanlık almak istiyorum.',
                            status: 'Bekliyor',
                            result: null,
                            response: null,
                        },
                        {
                            type: 'Tedarik',
                            userId: user.id,
                            productName: 'iPhone 15 Pro Max',
                            explanation: '256GB, Mavi renk, 10 adet tedarik edilmesini istiyorum.',
                            imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569']),
                            referenceLink: 'https://www.apple.com/iphone-15-pro/',
                            status: 'Tamamlandı',
                            result: 'Başarılı',
                            response: 'Talebiniz değerlendirildi. Ürünler tedarik edildi ve kargoya verildi.',
                        },
                        {
                            type: 'Danışmanlık',
                            userId: user2.id,
                            title: 'eBay Mağaza Optimizasyonu',
                            explanation: 'eBay mağazamın görünürlüğünü artırmak için SEO optimizasyonu yapılmasını istiyorum.',
                            status: 'Tamamlandı',
                            result: 'Başarılı',
                            response: 'SEO optimizasyonu tamamlandı. Mağazanızın görünürlüğü %40 arttı.',
                        },
                        {
                            type: 'Tedarik',
                            userId: user2.id,
                            productName: 'Kablosuz Kulaklık',
                            explanation: 'Toptan satış için 50 adet kablosuz kulaklık tedarik edilmesini istiyorum.',
                            imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e']),
                            referenceLink: 'https://www.amazon.com/wireless-earbuds',
                            status: 'Bekliyor',
                            result: null,
                            response: null,
                        },
                    ];
                    _i = 0, demoRequests_1 = demoRequests;
                    _a.label = 5;
                case 5:
                    if (!(_i < demoRequests_1.length)) return [3 /*break*/, 8];
                    request = demoRequests_1[_i];
                    return [4 /*yield*/, prisma.request.create({
                            data: request,
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("\u2705 ".concat(demoRequests.length, " demo requests created"));
                    return [3 /*break*/, 10];
                case 9:
                    console.log("\u2139\uFE0F  ".concat(existingRequests.length, " requests already exist, skipping..."));
                    _a.label = 10;
                case 10:
                    // Seed Plans
                    console.log('💰 Seeding plans...');
                    return [4 /*yield*/, prisma.plan.findMany()];
                case 11:
                    existingPlans = _a.sent();
                    if (!(existingPlans.length === 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, prisma.plan.createMany({
                            data: [
                                {
                                    name: '1 Ay',
                                    price: 299,
                                    durationText: '/ aylık',
                                    popular: false,
                                    buttonText: 'Planı Seç'
                                },
                                {
                                    name: '6 Ay',
                                    price: 1499,
                                    durationText: '/ 6 aylık',
                                    popular: true,
                                    buttonText: 'Planı Seç'
                                },
                                {
                                    name: '1 Sene',
                                    price: 2499,
                                    durationText: '/ yıllık',
                                    popular: false,
                                    buttonText: 'Planı Seç'
                                }
                            ]
                        })];
                case 12:
                    _a.sent();
                    console.log('✅ Plans seeded');
                    return [3 /*break*/, 14];
                case 13:
                    console.log("\u2139\uFE0F  ".concat(existingPlans.length, " plans already exist, skipping..."));
                    _a.label = 14;
                case 14:
                    // Seed Event Popup
                    console.log('🎉 Seeding event popup...');
                    return [4 /*yield*/, prisma.eventPopup.findFirst()];
                case 15:
                    existingPopup = _a.sent();
                    if (!!existingPopup) return [3 /*break*/, 17];
                    return [4 /*yield*/, prisma.eventPopup.create({
                            data: {
                                enabled: false,
                                title: 'Yıl Sonu İndirimi!',
                                description: 'Tüm yıllık planlarda %25 indirim fırsatını kaçırmayın. Sınırlı süreli teklif!',
                                imageUrl: 'https://picsum.photos/seed/promo/600/300',
                                ctaText: 'İndirimi Gör',
                                ctaLink: '#pricing'
                            }
                        })];
                case 16:
                    _a.sent();
                    console.log('✅ Event popup seeded');
                    return [3 /*break*/, 18];
                case 17:
                    console.log('ℹ️  Event popup already exists, skipping...');
                    _a.label = 18;
                case 18:
                    // Seed Influencer Codes
                    console.log('🎁 Seeding influencer codes...');
                    return [4 /*yield*/, prisma.influencerCode.findMany()];
                case 19:
                    existingCodes = _a.sent();
                    if (!(existingCodes.length === 0)) return [3 /*break*/, 21];
                    return [4 /*yield*/, prisma.influencerCode.createMany({
                            data: [
                                {
                                    code: 'INFLUENCER10',
                                    discountRate: 10,
                                    affiliateRate: 5,
                                    usageCount: 0,
                                    totalEarnings: 0
                                },
                                {
                                    code: 'WELCOME20',
                                    discountRate: 20,
                                    affiliateRate: 10,
                                    usageCount: 0,
                                    totalEarnings: 0
                                }
                            ]
                        })];
                case 20:
                    _a.sent();
                    console.log('✅ Influencer codes seeded');
                    return [3 /*break*/, 22];
                case 21:
                    console.log("\u2139\uFE0F  ".concat(existingCodes.length, " influencer codes already exist, skipping..."));
                    _a.label = 22;
                case 22:
                    console.log('\n📝 Login credentials:');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('Admin: admin@supplyix.com / 12345678');
                    console.log('User 1: user@supplyix.com / 12345678');
                    console.log('User 2: mehmet@supplyix.com / 12345678');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('\n🎉 Database seed completed successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
