import { Router } from 'express';
import multer from 'multer';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import r2Client, { R2_BUCKET_NAME, R2_PUBLIC_URL } from '../config/r2';

const router = Router();

// Configure Multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await r2Client.send(command);

        // Return public URL
        const publicUrl = `${R2_PUBLIC_URL}/${fileName}`;

        res.json({
            success: true,
            url: publicUrl,
            fileName: fileName,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadPromises = req.files.map(async (file) => {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname.replace(/\s/g, '-')}`;

            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await r2Client.send(command);

            return {
                url: `${R2_PUBLIC_URL}/${fileName}`,
                fileName: fileName,
            };
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        res.json({
            success: true,
            files: uploadedFiles,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// Delete image
router.delete('/image', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Extract filename from URL
        const fileName = url.replace(`${R2_PUBLIC_URL}/`, '');

        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
        });

        await r2Client.send(command);

        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;
