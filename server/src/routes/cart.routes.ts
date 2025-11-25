import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            return res.json([]);
        }

        // Check for price changes and stock status
        for (const item of cart.items) {
            const product = item.product;
            const variants = product.variants ? JSON.parse(product.variants) : [];
            const variant = variants.find((v: any) => v.sku === item.variantSku);

            if (!variant) continue;

            const currentPrice = variant.price;

            // Check if price changed
            if (item.priceAtAddition && item.priceAtAddition !== currentPrice) {
                // Create notification if not exists recently (simplified: just create one)
                // To avoid spam, we could check if we already notified for this item recently.
                // For now, we'll update priceAtAddition to currentPrice so we don't notify again.

                await prisma.notification.create({
                    data: {
                        userId,
                        title: 'Fiyat Değişikliği',
                        message: `Sepetinizdeki "${product.name}" ürününün fiyatı değişti. Eski: $${item.priceAtAddition}, Yeni: $${currentPrice}`,
                        type: 'info',
                        link: '/dashboard/cart'
                    }
                });

                await prisma.cartItem.update({
                    where: { id: item.id },
                    data: { priceAtAddition: currentPrice }
                });
            }

            // Check if product is passive
            if (product.status === 'Pasif') {
                // Create notification
                // We should probably check if we already notified, but for now update priceAtAddition as a flag? 
                // Or just notify. To avoid spam, maybe check if notification exists.
                const existingNotif = await prisma.notification.findFirst({
                    where: {
                        userId,
                        title: 'Ürün Stokta Yok',
                        message: { contains: product.name },
                        read: false
                    }
                });

                if (!existingNotif) {
                    await prisma.notification.create({
                        data: {
                            userId,
                            title: 'Ürün Stokta Yok',
                            message: `Sepetinizdeki "${product.name}" ürünü artık mevcut değil.`,
                            type: 'warning',
                            link: '/dashboard/cart'
                        }
                    });
                }
            }
        }

        // Transform to match frontend CartItem interface
        const cartItems = cart.items.map(item => ({
            id: item.id,
            product: {
                ...item.product,
                images: JSON.parse(item.product.images),
                price: JSON.parse(item.product.price),
                shippingInfo: item.product.shippingInfo ? JSON.parse(item.product.shippingInfo) : undefined,
                variations: item.product.variations ? JSON.parse(item.product.variations) : [],
                variants: item.product.variants ? JSON.parse(item.product.variants) : [],
                tags: item.product.tags ? JSON.parse(item.product.tags) : [],
            },
            variant: {
                sku: item.variantSku,
                ...JSON.parse(item.product.variants || '[]').find((v: any) => v.sku === item.variantSku) || {}
            },
            quantity: item.quantity,
            destination: item.destination as 'eu' | 'usa',
            podFile: undefined,
            podFileUrl: item.podFileUrl,
            priceAtAddition: item.priceAtAddition
        }));

        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userId, product, variant, quantity, destination, podFileUrl } = req.body;

        let cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // Check if item exists
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: product.id,
                variantSku: variant.sku,
                destination
            }
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                    priceAtAddition: variant.price // Update price to current
                }
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: product.id,
                    variantSku: variant.sku,
                    quantity,
                    destination,
                    podFileUrl,
                    priceAtAddition: variant.price
                }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;

        // We need to find the cart item by its ID, but ensure it belongs to the user's cart
        // For simplicity, we'll trust the itemId for now, but in prod verify ownership

        if (quantity <= 0) {
            await prisma.cartItem.delete({ where: { id: itemId } });
        } else {
            await prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Remove item from cart
router.delete('/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        await prisma.cartItem.delete({ where: { id: itemId } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// Clear cart
router.post('/clear', async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

// Update POD file for cart item
router.put('/:itemId/pod-file', async (req, res) => {
    try {
        const { itemId } = req.params;
        const { podFileUrl } = req.body;

        await prisma.cartItem.update({
            where: { id: itemId },
            data: { podFileUrl }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating POD file:', error);
        res.status(500).json({ error: 'Failed to update POD file' });
    }
});

export default router;
