import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Login (Simple check for now)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date().toISOString() },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: req.body,
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

export default router;
