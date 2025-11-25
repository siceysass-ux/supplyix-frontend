import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany();
        console.log('Total users in database:', users.length);
        console.log('Users:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error querying users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
