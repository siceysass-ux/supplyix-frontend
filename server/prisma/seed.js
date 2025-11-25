const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...\n');

    // Clear
    console.log('🗑️  Clearing...');
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
    await prisma.user.deleteMany();
    console.log('✅ Cleared\n');

    // Admin
    console.log('👤 Admin...');
    const admin = await prisma.user.create({
        data: {
            name: 'Admin',
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
            platforms: '[]',
            referralCode: 'ADMIN',
            emailVerified: true
        }
    });
    console.log('✅ Admin\n');

    // 100 Users
    console.log('👥 100 users...');
    const users = [admin];
    for (let i = 0; i < 100; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: `user${i}@test.com`,
                password: '12345678',
                role: 'member',
                phone: `+9055${faker.string.numeric(8)}`,
                plan: '1 Ay',
                status: 'Aktif',
                registrationDate: '2025-01-01',
                subscriptionStartDate: '2025-01-01',
                subscriptionEndDate: '2026-01-01',
                totalSpent: 0,
                lastLogin: new Date().toISOString(),
                platforms: '["Trendyol"]',
                referralCode: `USER${i}`,
                emailVerified: true
            }
        });
        users.push(user);
        if ((i + 1) % 25 === 0) console.log(`  ✓ ${i + 1}/100`);
    }
    console.log('✅ 100 users\n');

    // 5 Categories
    console.log('📁 Categories...');
    const categories = [];
    for (let i = 0; i < 5; i++) {
        const cat = await prisma.category.create({
            data: {
                name: `Kategori ${i + 1}`,
                subcategories: {
                    create: [
                        { name: `Alt Kategori ${i + 1}-1` },
                        { name: `Alt Kategori ${i + 1}-2` }
                    ]
                }
            },
            include: { subcategories: true }
        });
        categories.push(cat);
    }
    console.log('✅ 5 categories\n');

    // 200 Products
    console.log('📦 200 products...');
    for (let i = 0; i < 200; i++) {
        const cat = faker.helpers.arrayElement(categories);
        const sub = faker.helpers.arrayElement(cat.subcategories);
        await prisma.product.create({
            data: {
                name: `Ürün ${i + 1}`,
                sku: `SKU${i}`,
                categoryId: cat.id,
                subcategoryId: sub.id,
                images: '["https://picsum.photos/400"]',
                price: '99.99',
                tags: '["Yeni"]',
                description: 'Ürün açıklaması',
                status: 'Aktif',
                minOrder: 1,
                isPOD: false
            }
        });
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/200`);
    }
    console.log('✅ 200 products\n');

    // 150 Tickets
    console.log('🎫 150 tickets...');
    for (let i = 0; i < 150; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.supportTicket.create({
            data: {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                subject: `Ticket ${i + 1}`,
                status: 'Açık',
                isReadByAdmin: false,
                isReadByUser: true,
                lastUpdate: new Date().toISOString(),
                messages: '[{"text":"Test mesaj","sender":"user","timestamp":"' + new Date().toISOString() + '","imageUrls":[]}]'
            }
        });
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/150`);
    }
    console.log('✅ 150 tickets\n');

    // 120 Requests
    console.log('📝 120 requests...');
    for (let i = 0; i < 120; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.request.create({
            data: {
                type: 'Ürün Talebi',
                userId: user.id,
                title: `Talep ${i + 1}`,
                explanation: 'Açıklama',
                imageUrls: '[]',
                status: 'Beklemede',
                result: 'Beklemede',
                response: ''
            }
        });
        if ((i + 1) % 40 === 0) console.log(`  ✓ ${i + 1}/120`);
    }
    console.log('✅ 120 requests\n');

    // 100 Fees
    console.log('💰 100 fees...');
    for (let i = 0; i < 100; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.extraFee.create({
            data: {
                userId: user.id,
                item: 'Kargo',
                description: 'Kargo ücreti',
                amount: '50',
                date: '2025-01-01',
                status: 'Ödendi'
            }
        });
    }
    console.log('✅ 100 fees\n');

    // 50 Announcements
    console.log('📢 50 announcements...');
    for (let i = 0; i < 50; i++) {
        await prisma.announcement.create({
            data: {
                title: `Duyuru ${i + 1}`,
                content: 'Duyuru içeriği',
                type: 'Bilgi',
                date: new Date().toISOString()
            }
        });
    }
    console.log('✅ 50 announcements\n');

    // 200 Notifications
    console.log('🔔 200 notifications...');
    for (let i = 0; i < 200; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: `Bildirim ${i + 1}`,
                message: 'Bildirim mesajı',
                type: 'info',
                isRead: false,
                createdAt: new Date().toISOString()
            }
        });
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/200`);
    }
    console.log('✅ 200 notifications\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👥 Users: 101');
    console.log('📁 Categories: 5');
    console.log('📦 Products: 200');
    console.log('🎫 Tickets: 150');
    console.log('📝 Requests: 120');
    console.log('💰 Fees: 100');
    console.log('📢 Announcements: 50');
    console.log('🔔 Notifications: 200');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 COMPLETED! 900+ records');
    console.log('📝 admin@supplyix.com / 12345678\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
