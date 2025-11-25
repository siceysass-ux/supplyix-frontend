import fs from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client, { R2_BUCKET_NAME } from '../config/r2';

const BACKUP_DIR = path.join(__dirname, '../../backups');
const DB_PATH = path.join(__dirname, '../../prisma/dev.db');
const MAX_BACKUPS = 7; // Keep last 7 days

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const createBackup = async (): Promise<string> => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-${timestamp}.db`;
        const backupPath = path.join(BACKUP_DIR, backupFileName);

        // Copy database file
        fs.copyFileSync(DB_PATH, backupPath);

        console.log(`✅ Backup created: ${backupFileName}`);

        // Upload to R2
        const fileContent = fs.readFileSync(backupPath);
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: `backups/${backupFileName}`,
            Body: fileContent,
            ContentType: 'application/x-sqlite3',
        });

        await r2Client.send(command);
        console.log(`✅ Backup uploaded to R2: ${backupFileName}`);

        // Clean old backups
        cleanOldBackups();

        return backupPath;
    } catch (error) {
        console.error('❌ Backup failed:', error);
        throw error;
    }
};

const cleanOldBackups = () => {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('backup-') && file.endsWith('.db'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_DIR, file),
                time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        // Delete old backups (keep only MAX_BACKUPS)
        if (files.length > MAX_BACKUPS) {
            files.slice(MAX_BACKUPS).forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`🗑️  Deleted old backup: ${file.name}`);
            });
        }
    } catch (error) {
        console.error('Error cleaning old backups:', error);
    }
};

export const restoreBackup = (backupPath: string): void => {
    try {
        if (!fs.existsSync(backupPath)) {
            throw new Error('Backup file not found');
        }

        fs.copyFileSync(backupPath, DB_PATH);
        console.log(`✅ Database restored from: ${backupPath}`);
    } catch (error) {
        console.error('❌ Restore failed:', error);
        throw error;
    }
};
