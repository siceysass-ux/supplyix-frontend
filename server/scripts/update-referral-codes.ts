import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateReferralCode(userName: string): Promise<string> {
    const namePrefix = userName
        .replace(/\s+/g, '')
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X');

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const code = `SUPPLYIX-${namePrefix}${randomNum}`;

    const existing = await prisma.user.findFirst({
        where: { referralCode: code }
    });

    if (existing) {
        return generateReferralCode(userName);
    }

    return code;
}

async function main() {
    console.log('🔄 Updating existing users with referral codes...');

    // Get all users without referral codes
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { referralCode: null },
                { referralCode: '' }
            ]
        }
    });

    console.log(`Found ${users.length} users without referral codes`);

    for (const user of users) {
        const code = await generateReferralCode(user.name);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                referralCode: code,
                referralCount: 0,
                referralRewards: 0
            }
        });
        console.log(`✅ Updated ${user.name} with code: ${code}`);
    }

    console.log('🎉 All users updated!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
