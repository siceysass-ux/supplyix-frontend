import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const serializeProductForDB = (productData: any) => {
    const serialized: any = {
        name: productData.name,
        sku: productData.sku || null,
        categoryId: productData.categoryId || null,
        subcategoryId: productData.subcategoryId || null,
        images: JSON.stringify(productData.images || []),
        price: JSON.stringify(productData.price || { min: 0, max: 0 }),
        tags: productData.tags ? JSON.stringify(productData.tags) : null,
        description: productData.description || '',
        status: productData.status || 'Aktif',
        minOrder: productData.minOrder || 1,
        isPOD: productData.isPOD || false,
        variations: productData.variations ? JSON.stringify(productData.variations) : null,
        variants: productData.variants ? JSON.stringify(productData.variants) : null,
        shippingInfo: productData.shippingInfo ? JSON.stringify(productData.shippingInfo) : null,
    };
    return serialized;
};

// Helper function to deserialize product data from database
const deserializeProductFromDB = (dbProduct: any) => {
    try {
        return {
            ...dbProduct,
            images: dbProduct.images ? JSON.parse(dbProduct.images) : [],
            price: dbProduct.price ? JSON.parse(dbProduct.price) : { min: 0, max: 0 },
            tags: dbProduct.tags ? JSON.parse(dbProduct.tags) : [],
            variations: dbProduct.variations ? JSON.parse(dbProduct.variations) : [],
            variants: dbProduct.variants ? JSON.parse(dbProduct.variants) : [],
            shippingInfo: dbProduct.shippingInfo ? JSON.parse(dbProduct.shippingInfo) : null,
            // Convert category and subcategory objects to strings
            category: dbProduct.category?.name || '',
            subcategory: dbProduct.subcategory?.name || '',
        };
    } catch (error) {
        console.error('Error deserializing product:', error);
        // Return safe defaults if parsing fails
        return {
            ...dbProduct,
            images: [],
            price: { min: 0, max: 0 },
            tags: [],
            variations: [],
            variants: [],
            shippingInfo: null,
            category: dbProduct.category?.name || '',
            subcategory: dbProduct.subcategory?.name || '',
        };
    }
};

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                subcategory: true
            }
        });
        const deserializedProducts = products.map(deserializeProductFromDB);
        res.json(deserializedProducts);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        console.log('📦 Creating product with data:', JSON.stringify(req.body, null, 2));
        const serializedData = serializeProductForDB(req.body);
        console.log('📦 Serialized data:', JSON.stringify(serializedData, null, 2));

        const product = await prisma.product.create({
            data: serializedData,
            include: {
                category: true,
                subcategory: true
            }
        });

        const deserializedProduct = deserializeProductFromDB(product);
        res.json(deserializedProduct);
    } catch (error: any) {
        console.error('❌ Failed to create product:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
        // Log the full error object to see hidden properties
        console.dir(error, { depth: null });
        res.status(500).json({
            error: 'Failed to create product',
            details: error.message,
            code: error.code
        });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        console.log('📝 Updating product:', req.params.id);
        const serializedData = serializeProductForDB(req.body);

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: serializedData,
            include: {
                category: true,
                subcategory: true
            }
        });

        const deserializedProduct = deserializeProductFromDB(product);
        res.json(deserializedProduct);
    } catch (error: any) {
        console.error('❌ Failed to update product:', error);
        res.status(500).json({
            error: 'Failed to update product',
            details: error.message
        });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await prisma.product.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Product deleted' });
    } catch (error: any) {
        console.error('❌ Failed to delete product:', error);
        res.status(500).json({
            error: 'Failed to delete product',
            details: error.message
        });
    }
});

export default router;
