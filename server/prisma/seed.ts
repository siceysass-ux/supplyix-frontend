import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@supplyix.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@supplyix.com',
            password: '123', // In production, hash this!
            role: 'admin',
            status: 'Aktif',
            registrationDate: new Date().toISOString(),
            subscriptionStartDate: new Date().toISOString(),
            subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date().toISOString(),
            platforms: '[]',
            plan: 'Premium'
        },
    });

    // Create Standard User
    const user = await prisma.user.upsert({
        where: { email: 'user@supplyix.com' },
        update: {},
        create: {
            name: 'Demo User',
            email: 'user@supplyix.com',
            password: '123', // In production, hash this!
            role: 'member',
            status: 'Aktif',
            registrationDate: new Date().toISOString(),
            subscriptionStartDate: new Date().toISOString(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date().toISOString(),
            platforms: '[]',
            plan: 'Standart'
        },
    });

    console.log({ admin, user });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
