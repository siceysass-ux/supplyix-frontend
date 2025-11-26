// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting MASSIVE database seeding (100+ records per table)...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.extraFee.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.request.deleteMany();
    await prisma.favoriteCategory.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.referralReward.deleteMany();
    await prisma.influencerCode.deleteMany();
    await prisma.eventPopup.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared\n');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@supplyix.com',
            password: '12345678',
            role: 'admin',
            phone: '+905551234567',
            plan: '1 Sene',
            status: 'Aktif',
            registrationDate: '2025-01-01',
            subscriptionStartDate: '2025-01-01',
            subscriptionEndDate: '2026-01-01',
            totalSpent: 0,
            lastLogin: new Date().toISOString(),
            platforms: JSON.stringify([]),
            referralCode: 'SUPPLYIX-ADMIN',
            emailVerified: true
        }
    });

    console.log('✅ Admin user created\n');

    const user = await prisma.user.create({
        data: {
            name: 'User',
            email: 'user@supplyix.com',
            password: '12345678',
            role: 'user',
            phone: '+905551234567',
            plan: '1 Sene',
            status: 'Aktif',
            registrationDate: '2025-01-01',
            subscriptionStartDate: '2025-01-01',
            subscriptionEndDate: '2026-01-01',
            totalSpent: 0,
            lastLogin: new Date().toISOString(),
            platforms: JSON.stringify([]),
            referralCode: 'SUPPLYIX-USER',
            emailVerified: true
        }
    });
    console.log('✅ User created\n');

    // Create 100 Users
    console.log('👥 Creating 100 users...');
    const users = [admin, user];
    for (let i = 0; i < 100; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: '12345678',
                role: faker.helpers.arrayElement(['member', 'member', 'member', 'admin']),
                phone: `+9055${faker.string.numeric(8)}`,
                tcKimlik: faker.string.numeric(11),
                vergiKimlik: faker.datatype.boolean() ? faker.string.numeric(10) : '',
                plan: faker.helpers.arrayElement(['7 Gün', '1 Ay', '6 Ay', '1 Sene']),
                status: faker.helpers.arrayElement(['Aktif', 'Aktif', 'Aktif', 'Pasif']),
                registrationDate: faker.date.past({ years: 2 }).toISOString().split('T')[0],
                subscriptionStartDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                subscriptionEndDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
                totalSpent: parseFloat(faker.commerce.price({ min: 0, max: 10000 })),
                lastLogin: faker.date.recent({ days: 30 }).toISOString(),
                platforms: JSON.stringify(faker.helpers.arrayElements(['Trendyol', 'Hepsiburada', 'Amazon', 'N11'], { min: 1, max: 4 })),
                referralCode: `SUP-${faker.string.alphanumeric(8).toUpperCase()}`,
                referredBy: faker.datatype.boolean() ? users[faker.number.int({ min: 0, max: users.length - 1 })]?.referralCode : null,
                referralCount: faker.number.int({ min: 0, max: 20 }),
                referralRewards: faker.number.int({ min: 0, max: 500 }),
                emailVerified: faker.datatype.boolean()
            }
        });
        users.push(user);
        if ((i + 1) % 20 === 0) console.log(`  ✓ ${i + 1}/100 users created`);
    }
    console.log('✅ 100 users created\n');

    // Create Categories
    console.log('📁 Creating 10 categories with subcategories...');
    const categoryData = [
        { name: 'Elektronik', subs: ['Telefon', 'Bilgisayar', 'Tablet', 'Aksesuar', 'TV & Ses Sistemleri'] },
        { name: 'Giyim', subs: ['Erkek', 'Kadın', 'Çocuk', 'Ayakkabı', 'Çanta'] },
        { name: 'Ev & Yaşam', subs: ['Mobilya', 'Dekorasyon', 'Mutfak', 'Banyo', 'Aydınlatma'] },
        { name: 'Kozmetik', subs: ['Cilt Bakımı', 'Makyaj', 'Parfüm', 'Saç Bakımı', 'Kişisel Bakım'] },
        { name: 'Spor', subs: ['Fitness', 'Outdoor', 'Takım Sporları', 'Spor Giyim', 'Spor Ayakkabı'] },
        { name: 'Kitap & Kırtasiye', subs: ['Roman', 'Çocuk Kitapları', 'Kırtasiye', 'Hobi', 'Dergi'] },
        { name: 'Oyuncak', subs: ['Bebek Oyuncakları', 'Eğitici Oyuncaklar', 'Puzzle', 'Lego', 'Aksiyon Figürleri'] },
        { name: 'Otomotiv', subs: ['Aksesuar', 'Yedek Parça', 'Bakım Ürünleri', 'Elektronik', 'Lastik'] },
        { name: 'Anne & Bebek', subs: ['Bebek Giyim', 'Bebek Bakım', 'Oyuncak', 'Emzirme', 'Güvenlik'] },
        { name: 'Süpermarket', subs: ['Gıda', 'İçecek', 'Temizlik', 'Kağıt Ürünleri', 'Pet Shop'] }
    ];

    const categories = [];
    for (const cat of categoryData) {
        const category = await prisma.category.create({
            data: {
                name: cat.name,
                subcategories: {
                    create: cat.subs.map(sub => ({ name: sub }))
                }
            },
            include: { subcategories: true }
        });
        categories.push(category);
    }
    console.log('✅ 10 categories with 50 subcategories created\n');

    // Create 200 Products
    console.log('📦 Creating 200 products...');
    const products = [];
    for (let i = 0; i < 200; i++) {
        const category = faker.helpers.arrayElement(categories);
        const subcategory = faker.helpers.arrayElement(category.subcategories);

        const product = await prisma.product.create({
            data: {
                name: `${faker.commerce.productAdjective()} ${faker.commerce.product()} ${i}`,
                sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}`,
                categoryId: category.id,
                subcategoryId: subcategory.id,
                images: JSON.stringify([
                    `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/400/400`,
                    `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/400/400`,
                    `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/400/400`
                ]),
                price: faker.commerce.price({ min: 10, max: 5000 }),
                tags: JSON.stringify(faker.helpers.arrayElements(['Yeni', 'İndirimli', 'Popüler', 'Trend', 'Özel', 'Kampanya'], { min: 1, max: 3 })),
                description: faker.commerce.productDescription(),
                status: faker.helpers.arrayElement(['Aktif', 'Aktif', 'Aktif', 'Pasif']),
                minOrder: faker.number.int({ min: 1, max: 10 }),
                isPOD: faker.datatype.boolean(),
                variations: JSON.stringify([
                    { name: 'Renk', options: ['Kırmızı', 'Mavi', 'Yeşil', 'Siyah', 'Beyaz'] },
                    { name: 'Beden', options: ['S', 'M', 'L', 'XL', 'XXL'] }
                ]),
                variants: JSON.stringify([
                    { sku: `VAR-${faker.string.alphanumeric(6)}`, price: faker.commerce.price({ min: 10, max: 5000 }), stock: faker.number.int({ min: 0, max: 500 }) }
                ]),
                shippingInfo: 'Kargo ücreti alıcıya aittir. 2-3 iş günü içinde kargoya verilir.'
            }
        });
        products.push(product);
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/200 products created`);
    }
    console.log('✅ 200 products created\n');

    // Create 150 Support Tickets
    console.log('🎫 Creating 150 support tickets...');
    for (let i = 0; i < 150; i++) {
        const user = faker.helpers.arrayElement(users);
        const messageCount = faker.number.int({ min: 1, max: 6 });
        const messages = [];

        for (let j = 0; j < messageCount; j++) {
            messages.push({
                text: faker.lorem.paragraph(),
                sender: j % 2 === 0 ? 'user' : 'support',
                timestamp: faker.date.recent({ days: 30 }).toISOString(),
                imageUrls: faker.datatype.boolean() ? [`https://picsum.photos/seed/${faker.string.alphanumeric(8)}/600/400`] : []
            });
        }

        await prisma.supportTicket.create({
            data: {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                subject: faker.lorem.sentence(),
                status: faker.helpers.arrayElement(['Açık', 'Yanıt Bekleniyor', 'Kapalı']),
                isReadByAdmin: faker.datatype.boolean(),
                isReadByUser: faker.datatype.boolean(),
                lastUpdate: faker.date.recent({ days: 30 }).toISOString(),
                messages: JSON.stringify(messages)
            }
        });
        if ((i + 1) % 30 === 0) console.log(`  ✓ ${i + 1}/150 tickets created`);
    }
    console.log('✅ 150 support tickets created\n');

    // Create 120 Requests
    console.log('📝 Creating 120 requests...');
    for (let i = 0; i < 120; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.request.create({
            data: {
                type: faker.helpers.arrayElement(['Ürün Talebi', 'Teknik Destek', 'Fiyat Teklifi', 'Diğer']),
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                title: faker.lorem.sentence(),
                productName: faker.datatype.boolean() ? faker.commerce.productName() : '',
                explanation: faker.lorem.paragraphs(2),
                imageUrls: JSON.stringify(faker.datatype.boolean() ? [
                    `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/600/400`
                ] : []),
                referenceLink: faker.datatype.boolean() ? faker.internet.url() : '',
                status: faker.helpers.arrayElement(['Beklemede', 'İşlemde', 'Tamamlandı', 'İptal']),
                result: faker.helpers.arrayElement(['Onaylandı', 'Reddedildi', 'Beklemede']),
                response: faker.datatype.boolean() ? faker.lorem.paragraph() : '',
                created: faker.date.past({ years: 1 }).toISOString(),
                updated: faker.date.recent({ days: 30 }).toISOString()
            }
        });
        if ((i + 1) % 30 === 0) console.log(`  ✓ ${i + 1}/120 requests created`);
    }
    console.log('✅ 120 requests created\n');

    // Create 100 Extra Fees
    console.log('💰 Creating 100 extra fees...');
    for (let i = 0; i < 100; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.extraFee.create({
            data: {
                userId: user.id,
                item: faker.helpers.arrayElement(['Kargo Farkı', 'Ek Hizmet', 'Özel İşlem', 'Gümrük', 'Sigorta']),
                description: faker.lorem.sentence(),
                amount: faker.commerce.price({ min: 10, max: 1000 }),
                date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                status: faker.helpers.arrayElement(['Ödendi', 'Beklemede', 'İptal'])
            }
        });
        if ((i + 1) % 25 === 0) console.log(`  ✓ ${i + 1}/100 fees created`);
    }
    console.log('✅ 100 extra fees created\n');

    // Create 50 Announcements
    console.log('📢 Creating 50 announcements...');
    for (let i = 0; i < 50; i++) {
        await prisma.announcement.create({
            data: {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(3),
                type: faker.helpers.arrayElement(['Bilgi', 'Uyarı', 'Önemli', 'Kampanya']),
                date: faker.date.recent({ days: 90 }).toISOString()
            }
        });
    }
    console.log('✅ 50 announcements created\n');

    // Create 200 Notifications
    console.log('🔔 Creating 200 notifications...');
    for (let i = 0; i < 200; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: faker.lorem.sentence(),
                message: faker.lorem.paragraph(),
                type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error']),
                isRead: faker.datatype.boolean(),
                createdAt: faker.date.recent({ days: 60 }).toISOString()
            }
        });
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/200 notifications created`);
    }
    console.log('✅ 200 notifications created\n');

    // Create 100 Favorites
    console.log('❤️  Creating 100 favorites...');
    for (let i = 0; i < 100; i++) {
        const user = faker.helpers.arrayElement(users);
        const product = faker.helpers.arrayElement(products);

        try {
            await prisma.favorite.create({
                data: {
                    userId: user.id,
                    productId: product.id
                }
            });
        } catch (e) {
            // Skip duplicates
        }
    }
    console.log('✅ 100 favorites created\n');

    // Create 50 Favorite Categories
    console.log('📁 Creating 50 favorite categories...');
    for (let i = 0; i < 50; i++) {
        const user = faker.helpers.arrayElement(users);
        const categoryProducts = faker.helpers.arrayElements(products, { min: 3, max: 10 });

        await prisma.favoriteCategory.create({
            data: {
                userId: user.id,
                name: faker.commerce.department(),
                productIds: JSON.stringify(categoryProducts.map(p => p.id))
            }
        });
    }
    console.log('✅ 50 favorite categories created\n');

    // Create Settings
    console.log('⚙️  Creating settings...');

    await prisma.plan.createMany({
        data: [
            { name: '7 Gün Deneme', price: '0', duration: '7 gün', features: JSON.stringify(['Temel Özellikler', 'Email Destek']) },
            { name: '1 Ay', price: '299', duration: '1 ay', features: JSON.stringify(['Tüm Özellikler', 'Öncelikli Destek']) },
            { name: '6 Ay', price: '1499', duration: '6 ay', features: JSON.stringify(['Tüm Özellikler', '7/24 Destek', '%15 İndirim']) },
            { name: '1 Sene', price: '2499', duration: '1 yıl', features: JSON.stringify(['Tüm Özellikler', '7/24 Destek', '%30 İndirim', 'Özel Danışman']) }
        ]
    });

    await prisma.eventPopup.create({
        data: {
            enabled: true,
            title: 'Yılbaşı Kampanyası!',
            description: 'Tüm yıllık planlarda %35 indirim. Son 5 gün!',
            imageUrl: 'https://picsum.photos/seed/newyear2025/600/300',
            ctaText: 'Hemen Al',
            ctaLink: '#/kayit-ol'
        }
    });

    await prisma.influencerCode.createMany({
        data: [
            { code: 'WELCOME30', discountRate: 30, affiliateRate: 12, usageCount: faker.number.int({ min: 0, max: 50 }), totalEarnings: faker.number.int({ min: 0, max: 5000 }) },
            { code: 'NEWYEAR35', discountRate: 35, affiliateRate: 15, usageCount: faker.number.int({ min: 0, max: 100 }), totalEarnings: faker.number.int({ min: 0, max: 10000 }) },
            { code: 'INFLUENCER25', discountRate: 25, affiliateRate: 10, usageCount: faker.number.int({ min: 0, max: 75 }), totalEarnings: faker.number.int({ min: 0, max: 7500 }) },
            { code: 'SPECIAL20', discountRate: 20, affiliateRate: 8, usageCount: faker.number.int({ min: 0, max: 30 }), totalEarnings: faker.number.int({ min: 0, max: 3000 }) }
        ]
    });

    console.log('✅ Settings created\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 MASSIVE SEEDING SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Users: 101 (1 admin + 100 members)`);
    console.log(`📁 Categories: 10 with 50 subcategories`);
    console.log(`📦 Products: 200`);
    console.log(`🎫 Support Tickets: 150`);
    console.log(`📝 Requests: 120`);
    console.log(`💰 Extra Fees: 100`);
    console.log(`📢 Announcements: 50`);
    console.log(`🔔 Notifications: 200`);
    console.log(`❤️  Favorites: 100`);
    console.log(`📁 Favorite Categories: 50`);
    console.log(`⚙️  Plans: 4`);
    console.log(`🎁 Influencer Codes: 4`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 Login: admin@supplyix.com / 12345678\n');
    console.log('🎉 MASSIVE DATABASE SEEDING COMPLETED!');
    console.log('💾 Total Records: 1000+');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
