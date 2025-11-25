import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

// Update user profile information
router.put('/:id/profile', async (req, res) => {
    try {
        const { fullName, email, companyName } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                name: fullName,
                email,
                // Note: companyName field might need to be added to schema
            },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update user password
router.put('/:id/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Password complexity check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ error: 'Yeni şifre en az 8 karakter olmalı ve en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.' });
        }

        // First verify current password
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Update user avatar
router.put('/:id/avatar', async (req, res) => {
    try {
        const { avatar } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { avatar },
        });
        res.json(user);
    } catch (error) {
        console.error('Avatar update error:', error);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});

export default router;
