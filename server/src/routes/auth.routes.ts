import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmailVerification } from '../services/email.service';

const router = Router();
const prisma = new PrismaClient();

// Login
router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body);
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log('User found:', user);

        // Hybrid password check - support both hashed and plain text (backward compatibility)
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
        }

        let passwordMatch = false;

        // Try bcrypt first (for new users with hashed passwords)
        try {
            passwordMatch = await bcrypt.compare(password, user.password);
        } catch (e) {
            // If bcrypt fails, password might be plain text (old users)
            console.log('Bcrypt failed, trying plain text comparison');
        }

        // Fallback to plain text comparison for existing users
        if (!passwordMatch && user.password === password) {
            passwordMatch = true;
            console.log('Plain text password matched - consider migrating to hashed password');

            // Auto-migrate: Hash the password on successful login
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
            console.log('Password auto-migrated to hash');
        }

        if (!passwordMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
        }

        // Check account status
        if (user.status === 'Askıya Alındı') {
            console.log('Account suspended');
            return res.status(403).json({ error: 'Hesabınız askıya alınmış. Lütfen destek ekibi ile iletişime geçin.' });
        }

        if (user.status === 'İnceleniyor') {
            console.log('Account under review');
            return res.status(403).json({ error: 'Hesabınız inceleme aşamasında. Lütfen bekleyin.' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date().toISOString() },
        });

        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Giriş yapılamadı' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration attempt with data:', JSON.stringify(req.body, null, 2));

        const { name, email, password, referralCode, platforms, ...otherData } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            console.error('❌ Missing required fields');
            return res.status(400).json({ error: 'Ad, email ve şifre zorunludur' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.error('❌ User already exists:', email);
            return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
        }

        // Generate unique referral code for new user
        const userReferralCode = await generateUniqueReferralCode(name);
        console.log('✅ Generated referral code:', userReferralCode);

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed');

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Convert platforms array to JSON string if it's an array
        const platformsString = Array.isArray(platforms)
            ? JSON.stringify(platforms)
            : (platforms || JSON.stringify([]));

        console.log('📦 Platforms:', platformsString);

        // Create user with all data
        const userData = {
            name,
            email,
            password: hashedPassword,
            platforms: platformsString,
            ...otherData,
            referralCode: userReferralCode,
            referredBy: referralCode || null,
            referralCount: 0,
            referralRewards: 0,
            emailVerified: false,
            emailVerificationToken,
            emailVerificationExpires
        };

        console.log('💾 Creating user with data:', JSON.stringify(userData, null, 2));

        const user = await prisma.user.create({
            data: userData
        });

        console.log('✅ User created successfully:', user.id);

        // If user was referred, handle reward
        if (referralCode) {
            await handleReferralReward(referralCode);
            console.log('🎁 Referral reward handled');
        }

        // Send verification email
        try {
            await sendEmailVerification(email, name, emailVerificationToken);
            console.log('📧 Verification email sent to:', email);
        } catch (emailError) {
            console.error('⚠️ Failed to send verification email:', emailError);
            // Don't fail registration if email fails
        }

        res.json(user);
    } catch (error: any) {
        console.error('❌ Registration error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);

        // Send more specific error message
        const errorMessage = error.message || 'Kayıt başarısız oldu';
        res.status(500).json({
            error: 'Kayıt başarısız oldu',
            details: errorMessage
        });
    }
});

/**
 * Generate unique referral code
 */
async function generateUniqueReferralCode(userName: string): Promise<string> {
    const namePrefix = userName
        .replace(/\s+/g, '')
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X');

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const code = `SUPPLYIX-${namePrefix}${randomNum}`;

    const existing = await prisma.user.findUnique({
        where: { referralCode: code }
    });

    if (existing) {
        return generateUniqueReferralCode(userName);
    }

    return code;
}

/**
 * Handle referral reward when someone signs up with a referral code
 */
async function handleReferralReward(referralCode: string) {
    try {
        const referrer = await prisma.user.findUnique({
            where: { referralCode }
        });

        if (!referrer) return;

        // Increment referral count
        const updatedReferrer = await prisma.user.update({
            where: { id: referrer.id },
            data: {
                referralCount: referrer.referralCount + 1
            }
        });

        // Check if user reached 3 referrals
        if (updatedReferrer.referralCount % 3 === 0 && updatedReferrer.referralCount > 0) {
            // Add 1 month to subscription
            const currentEndDate = new Date(updatedReferrer.subscriptionEndDate);
            const newEndDate = new Date(currentEndDate);
            newEndDate.setMonth(newEndDate.getMonth() + 1);

            await prisma.user.update({
                where: { id: referrer.id },
                data: {
                    subscriptionEndDate: newEndDate.toISOString().split('T')[0],
                    referralRewards: updatedReferrer.referralRewards + 1
                }
            });

            // Create reward record
            await prisma.referralReward.create({
                data: {
                    userId: referrer.id,
                    rewardType: '1_MONTH_FREE',
                    seen: false
                }
            });
        }
    } catch (error) {
        console.error('Referral reward error:', error);
    }
}

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Always return success message to prevent email enumeration
        if (!user) {
            return res.json({ message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama linki gönderildi.' });
        }

        // Generate secure reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetTokenExpiry
            }
        });

        // Send reset email
        const { sendPasswordResetEmail } = require('../services/email.service');
        try {
            await sendPasswordResetEmail(user.email, user.name, resetToken);
            console.log('Password reset email sent to:', user.email);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Still return success to user for security
        }

        res.json({ message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token ve yeni şifre gereklidir.' });
        }

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gte: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş token.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        console.log('Password reset successful for:', user.email);

        res.json({ message: 'Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Şifre sıfırlanamadı. Lütfen tekrar deneyin.' });
    }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token gereklidir' });
        }

        // Find user with this token
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: {
                    gte: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş doğrulama linki' });
        }

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null
            }
        });

        res.json({ message: 'Email adresiniz başarıyla doğrulandı!', user });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'Email doğrulanamadı' });
    }
});

// Resend Verification Email
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email gereklidir' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email adresi zaten doğrulanmış' });
        }

        // Generate new token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken,
                emailVerificationExpires
            }
        });

        // Send email
        await sendEmailVerification(email, user.name, emailVerificationToken);

        res.json({ message: 'Doğrulama emaili tekrar gönderildi' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ error: 'Email gönderilemedi' });
    }
});


export default router;
