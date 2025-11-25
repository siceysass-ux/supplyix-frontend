import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateReferralCode(userName: string): Promise<string> {
    const namePrefix = userName
        .replace(/\s+/g, '')
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X');

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `SUPPLYIX-${namePrefix}${randomNum}`;
}

async function main() {
    // Update Berkay Güner specifically
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: { contains: 'berkay' } },
                { email: { contains: 'guner' } },
                { name: { contains: 'Berkay' } }
            ]
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const code = await generateReferralCode(user.name);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            referralCode: code,
            referralCount: 0,
            referralRewards: 0
        }
    });

    console.log(`✅ Updated ${user.name} (${user.email}) with code: ${code}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
