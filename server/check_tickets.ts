
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTickets() {
    try {
        const tickets = await prisma.supportTicket.findMany();
        console.log('Found tickets:', tickets.length);
        if (tickets.length > 0) {
            console.log('First ticket:', JSON.stringify(tickets[0], null, 2));
            console.log('Ticket numbers:', tickets.map(t => t.ticketNumber));
        } else {
            console.log('No tickets found.');
        }
    } catch (error) {
        console.error('Error checking tickets:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTickets();
