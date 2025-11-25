
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    try {
        const userCount = await prisma.user.count();
        const ticketCount = await prisma.supportTicket.count();
        const users = await prisma.user.findMany({ select: { email: true, name: true } });
        const tickets = await prisma.supportTicket.findMany({ select: { ticketNumber: true, subject: true } });

        console.log(`\n📊 CURRENT DATABASE STATUS (PostgreSQL):`);
        console.log(`----------------------------------------`);
        console.log(`👥 Total Users: ${userCount}`);
        users.forEach(u => console.log(`   - ${u.name} (${u.email})`));

        console.log(`\n🎫 Total Tickets: ${ticketCount}`);
        tickets.forEach(t => console.log(`   - #${t.ticketNumber}: ${t.subject}`));
        console.log(`----------------------------------------\n`);

    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
