import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate a unique referral code for a user
 * Format: SUPPLYIX-{NAME_PREFIX}{RANDOM_NUMBER}
 * Example: SUPPLYIX-AHM123456
 */
export async function generateReferralCode(userName: string): Promise<string> {
    // Get first 3 letters of name (uppercase, no spaces)
    const namePrefix = userName
        .replace(/\s+/g, '')
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X'); // Pad with X if name is too short

    // Generate 6-digit random number
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const code = `SUPPLYIX-${namePrefix}${randomNum}`;

    // Check if code already exists
    const existing = await prisma.user.findUnique({
        where: { referralCode: code }
    });

    // If exists, recursively generate new code
    if (existing) {
        return generateReferralCode(userName);
    }

    return code;
}

export default { generateReferralCode };
