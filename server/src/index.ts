import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import './sentry'; // Initialize Sentry

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import orderRoutes from './routes/orders.routes';
import userRoutes from './routes/users.routes';
import profileRoutes from './routes/profile.routes';
import requestRoutes from './routes/requests.routes';
import extraFeesRoutes from './routes/extraFees.routes';
import announcementsRoutes from './routes/announcements.routes';
import notificationsRoutes from './routes/notifications.routes';
import supportTicketsRoutes from './routes/supportTickets.routes';
import settingsRoutes from './routes/settings.routes';
import uploadRoutes from './routes/upload.routes';
import categoriesRoutes from './routes/categories.routes';
import cartRoutes from './routes/cart.routes';
import favoritesRoutes from './routes/favorites.routes';
import favoriteCategoriesRoutes from './routes/favoriteCategories.routes';
import referralRoutes from './routes/referral.routes';
import adminRoutes from './routes/admin.routes';
import blogRoutes from './routes/blog';
import paymentRoutes from './routes/payment.routes';
import { startSubscriptionCron } from './services/subscription.cron';
import { startBackupCron } from './services/backup.cron';


dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002; // Use PORT from .env

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Basic health check
app.get('/', (req, res) => {
    res.send('Supplyix API is running');
});

// Image Proxy to bypass CORS
app.get('/api/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const contentType = response.headers.get('content-type');
        if (contentType) res.setHeader('Content-Type', contentType);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.send(buffer);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Failed to fetch image');
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/extra-fees', extraFeesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/support-tickets', supportTicketsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/favorite-categories', favoriteCategoriesRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/payment', paymentRoutes);

// In-memory store for active sessions
// Map<sessionId, { timestamp: number, type: 'landing' | 'dashboard' }>
const activeSessions = new Map<string, { timestamp: number, type: 'landing' | 'dashboard' }>();

// Heartbeat endpoint
app.post('/api/heartbeat', (req, res) => {
    const { type, socketId } = req.body;
    if (!socketId || !type) {
        return res.status(400).send('Missing socketId or type');
    }

    activeSessions.set(socketId, {
        timestamp: Date.now(),
        type: type as 'landing' | 'dashboard'
    });

    res.sendStatus(200);
});

// Active users analytics endpoint
app.get('/api/analytics/active-users', (req, res) => {
    const now = Date.now();
    const THRESHOLD = 30 * 1000; // 30 seconds

    // Clean up old sessions
    for (const [id, session] of activeSessions.entries()) {
        if (now - session.timestamp > THRESHOLD) {
            activeSessions.delete(id);
        }
    }

    // Count active users by type
    let landingCount = 0;
    let dashboardCount = 0;

    for (const session of activeSessions.values()) {
        if (session.type === 'landing') landingCount++;
        else if (session.type === 'dashboard') dashboardCount++;
    }

    res.json({
        landing: landingCount,
        dashboard: dashboardCount,
        total: landingCount + dashboardCount
    });
});


// Start cron jobs
startSubscriptionCron();
startBackupCron(); // Daily backups at 3:00 AM

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
