import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const admin = await prisma.user.upsert({
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
    });

    // Create test user
    const user = await prisma.user.upsert({
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
    });

    // Create second test user
    const user2 = await prisma.user.upsert({
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
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('✅ Test user 1 created:', user.email);
    console.log('✅ Test user 2 created:', user2.email);

    // Create demo requests
    console.log('\n🔄 Creating demo requests...');

    // Check if requests already exist
    const existingRequests = await prisma.request.findMany();

    if (existingRequests.length === 0) {
        const demoRequests = [
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

        for (const request of demoRequests) {
            await prisma.request.create({
                data: request,
            });
        }
        console.log(`✅ ${demoRequests.length} demo requests created`);
    } else {
        console.log(`ℹ️  ${existingRequests.length} requests already exist, skipping...`);
    }

    // Seed Plans
    console.log('💰 Seeding plans...');
    const existingPlans = await prisma.plan.findMany();
    if (existingPlans.length === 0) {
        await prisma.plan.createMany({
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
        });
        console.log('✅ Plans seeded');
    } else {
        console.log(`ℹ️  ${existingPlans.length} plans already exist, skipping...`);
    }

    // Seed Event Popup
    console.log('🎉 Seeding event popup...');
    const existingPopup = await prisma.eventPopup.findFirst();
    if (!existingPopup) {
        await prisma.eventPopup.create({
            data: {
                enabled: false,
                title: 'Yıl Sonu İndirimi!',
                description: 'Tüm yıllık planlarda %25 indirim fırsatını kaçırmayın. Sınırlı süreli teklif!',
                imageUrl: 'https://picsum.photos/seed/promo/600/300',
                ctaText: 'İndirimi Gör',
                ctaLink: '#pricing'
            }
        });
        console.log('✅ Event popup seeded');
    } else {
        console.log('ℹ️  Event popup already exists, skipping...');
    }

    // Seed Influencer Codes
    console.log('🎁 Seeding influencer codes...');
    const existingCodes = await prisma.influencerCode.findMany();
    if (existingCodes.length === 0) {
        await prisma.influencerCode.createMany({
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
        });
        console.log('✅ Influencer codes seeded');
    } else {
        console.log(`ℹ️  ${existingCodes.length} influencer codes already exist, skipping...`);
    }

    console.log('\n📝 Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin: admin@supplyix.com / 12345678');
    console.log('User 1: user@supplyix.com / 12345678');
    console.log('User 2: mehmet@supplyix.com / 12345678');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
