const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting MASSIVE database seeding...\n');

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
    console.log('✅ Cleared\n');

    // Admin
    console.log('👤 Creating admin...');
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
            referralCode: 'ADMIN',
            emailVerified: true
        }
    });
    console.log('✅ Admin created\n');

    // 100 Users
    console.log('👥 Creating 100 users...');
    const users = [admin];
    for (let i = 0; i < 100; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: '12345678',
                role: 'member',
                phone: `+9055${faker.string.numeric(8)}`,
                plan: faker.helpers.arrayElement(['1 Ay', '6 Ay', '1 Sene']),
                status: 'Aktif',
                registrationDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                subscriptionStartDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                subscriptionEndDate: faker.date.future({ years: 1 }).toISOString().split('T')[0],
                totalSpent: parseFloat(faker.commerce.price({ min: 0, max: 5000 })),
                lastLogin: faker.date.recent({ days: 30 }).toISOString(),
                platforms: JSON.stringify(['Trendyol', 'Hepsiburada']),
                referralCode: `SUP${faker.string.alphanumeric(6).toUpperCase()}`,
                emailVerified: true
            }
        });
        users.push(user);
        if ((i + 1) % 25 === 0) console.log(`  ✓ ${i + 1}/100`);
    }
    console.log('✅ 100 users\n');

    // Categories
    console.log('📁 Creating categories...');
    const cats = ['Elektronik', 'Giyim', 'Ev', 'Kozmetik', 'Spor'];
    const categories = [];
    for (const cat of cats) {
        const category = await prisma.category.create({
            data: {
                name: cat,
                subcategories: {
                    create: [
                        { name: `${cat} 1` },
                        { name: `${cat} 2` }
                    ]
                }
            },
            include: { subcategories: true }
        });
        categories.push(category);
    }
    console.log('✅ 5 categories\n');

    // 200 Products
    console.log('📦 Creating 200 products...');
    const products = [];
    for (let i = 0; i < 200; i++) {
        const cat = faker.helpers.arrayElement(categories);
        const sub = faker.helpers.arrayElement(cat.subcategories);
        const product = await prisma.product.create({
            data: {
                name: `${faker.commerce.product()} ${i}`,
                sku: `SKU${faker.string.alphanumeric(8).toUpperCase()}`,
                categoryId: cat.id,
                subcategoryId: sub.id,
                images: JSON.stringify([`https://picsum.photos/400/400?random=${i}`]),
                price: faker.commerce.price({ min: 10, max: 1000 }),
                tags: JSON.stringify(['Yeni']),
                description: faker.commerce.productDescription(),
                status: 'Aktif',
                minOrder: 1,
                isPOD: false
            }
        });
        products.push(product);
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/200`);
    }
    console.log('✅ 200 products\n');

    // 150 Tickets
    console.log('🎫 Creating 150 tickets...');
    for (let i = 0; i < 150; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.supportTicket.create({
            data: {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                subject: faker.lorem.sentence(),
                status: faker.helpers.arrayElement(['Açık', 'Kapalı']),
                isReadByAdmin: false,
                isReadByUser: true,
                lastUpdate: new Date().toISOString(),
                messages: JSON.stringify([{
                    text: faker.lorem.paragraph(),
                    sender: 'user',
                    timestamp: new Date().toISOString(),
                    imageUrls: []
                }])
            }
        });
        if ((i + 1) % 50 === 0) console.log(`  ✓ ${i + 1}/150`);
    }
    console.log('✅ 150 tickets\n');

    // 120 Requests
    console.log('📝 Creating 120 requests...');
    for (let i = 0; i < 120; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.request.create({
            data: {
                type: 'Ürün Talebi',
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                title: faker.lorem.sentence(),
                explanation: faker.lorem.paragraph(),
                imageUrls: JSON.stringify([]),
                status: 'Beklemede',
                result: 'Beklemede',
                response: '',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            }
        });
        if ((i + 1) % 40 === 0) console.log(`  ✓ ${i + 1}/120`);
    }
    console.log('✅ 120 requests\n');

    // 100 Fees
    console.log('💰 Creating 100 fees...');
    for (let i = 0; i < 100; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.extraFee.create({
            data: {
                userId: user.id,
                item: 'Kargo',
                description: faker.lorem.sentence(),
                amount: faker.commerce.price({ min: 10, max: 500 }),
                date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                status: 'Ödendi'
            }
        });
    }
    console.log('✅ 100 fees\n');

    // 50 Announcements
    console.log('📢 Creating 50 announcements...');
    for (let i = 0; i < 50; i++) {
        await prisma.announcement.create({
            data: {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                type: 'Bilgi',
                date: new Date().toISOString()
            }
        });
    }
    console.log('✅ 50 announcements\n');

    // 200 Notifications
    console.log('🔔 Creating 200 notifications...');
    for (let i = 0; i < 200; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: faker.lorem.sentence(),
                message: faker.lorem.paragraph(),
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
    console.log('🎉 COMPLETED! Total: 900+ records');
    console.log('📝 Login: admin@supplyix.com / 12345678\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
