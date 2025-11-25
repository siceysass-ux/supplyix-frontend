import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking extra fees...');

    const fees = await prisma.extraFee.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log(`\nTotal fees: ${fees.length}`);

    if (fees.length > 0) {
        console.log('\nRecent fees:');
        fees.forEach(f => {
            console.log(`- ${f.item} | User: ${f.userId} | Amount: ${f.amount} | Status: ${f.status}`);
        });
    } else {
        console.log('No fees found in database');
    }

    // Also show users for reference
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    console.log('\nAvailable users:');
    users.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
