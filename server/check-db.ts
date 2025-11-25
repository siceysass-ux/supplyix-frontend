import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking database...');

    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const planCount = await prisma.plan.count();

    console.log(`Users: ${userCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Plans: ${planCount}`);

    if (userCount > 0) {
        const users = await prisma.user.findMany({ take: 3 });
        console.log('\nFirst 3 users:');
        users.forEach(u => console.log(`- ${u.email}`));
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
