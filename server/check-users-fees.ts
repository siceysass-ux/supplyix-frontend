import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Users and Fees...');

    const users = await prisma.user.findMany();
    console.log('\nUsers:');
    users.forEach(u => console.log(`- Name: ${u.name}, Email: ${u.email}, ID: ${u.id}`));

    const fees = await prisma.extraFee.findMany();
    console.log('\nExtra Fees:');
    fees.forEach(f => console.log(`- Item: ${f.item}, Assigned User ID: ${f.userId}, Amount: ${f.amount}`));

    // Check for matches
    console.log('\nAnalysis:');
    fees.forEach(f => {
        const assignedUser = users.find(u => u.id === f.userId);
        if (assignedUser) {
            console.log(`✅ Fee "${f.item}" is assigned to existing user: ${assignedUser.name} (${assignedUser.email})`);
        } else {
            console.log(`❌ Fee "${f.item}" is assigned to NON-EXISTENT user ID: ${f.userId}`);
        }
    });
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
