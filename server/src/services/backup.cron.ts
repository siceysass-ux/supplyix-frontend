import cron from 'node-cron';
import { createBackup } from './backup.service';

export const startBackupCron = () => {
    // Run daily at 3:00 AM
    cron.schedule('0 3 * * *', async () => {
        console.log('🔄 Starting scheduled backup...');
        try {
            await createBackup();
            console.log('✅ Scheduled backup completed');
        } catch (error) {
            console.error('❌ Scheduled backup failed:', error);
        }
    });

    console.log('📅 Backup cron job started (daily at 3:00 AM)');
};
