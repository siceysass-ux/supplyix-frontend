import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendSubscriptionExpiryEmail, sendSubscriptionReminderEmail } from './email.service';

const prisma = new PrismaClient();

// Function to check subscriptions and send reminder emails
async function checkSubscriptionExpiry() {
    try {
        console.log('Checking subscription expiry...');

        const now = new Date();
        const users = await prisma.user.findMany({
            where: {
                status: 'Aktif',
                role: 'member'
            }
        });

        for (const user of users) {
            const endDate = new Date(user.subscriptionEndDate);
            const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            // Skip users without a plan
            if (!user.plan) {
                console.log(`Skipping user ${user.email} - no plan assigned`);
                continue;
            }

            // Send reminder email 7, 3, or 1 day before expiry
            if (daysUntilExpiry === 7 || daysUntilExpiry === 3 || daysUntilExpiry === 1) {
                console.log(`Sending ${daysUntilExpiry}-day reminder to ${user.email}`);

                await sendSubscriptionReminderEmail(
                    user.email,
                    user.name,
                    user.plan,
                    user.subscriptionEndDate,
                    daysUntilExpiry
                );
            }

            // Send expiry email on expiry day
            if (daysUntilExpiry === 0) {
                console.log(`Subscription expired for ${user.email}`);

                await sendSubscriptionExpiryEmail(
                    user.email,
                    user.name,
                    user.plan,
                    user.subscriptionEndDate
                );
            }
        }

        console.log('Subscription check completed');
    } catch (error) {
        console.error('Error checking subscriptions:', error);
    }
}

// Schedule cron job to run daily at 9:00 AM
export function startSubscriptionCron() {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        console.log('Running daily subscription check...');
        checkSubscriptionExpiry();
    });

    console.log('Subscription cron job started (runs daily at 9:00 AM)');
}

// Manual trigger for testing
export async function triggerSubscriptionCheck() {
    await checkSubscriptionExpiry();
}
