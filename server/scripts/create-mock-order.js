// Mock Order Creation Script
// Run this in Prisma Studio or via API

const mockOrder = {
    id: `#S${Date.now().toString().slice(-4)}`,
    userId: 'user-supplyix', // Supplyix demo user
    creationDate: new Date().toISOString().split('T')[0],
    status: 'Beklemede',
    shippingAddress: {
        fullName: 'Supplyix Demo',
        phone: '+90 555 123 4567',
        address: 'Test Mahallesi, Test Sokak No:1',
        city: 'İstanbul',
        postalCode: '34000',
        country: 'Türkiye'
    },
    products: [
        {
            name: 'Premium T-Shirt',
            sku: 'TS-001-M-BLK',
            variationDetails: 'Beden: M, Renk: Siyah',
            quantity: 2,
            price: '$29.98',
            destination: 'eu',
            podFileUrl: null
        },
        {
            name: 'Hoodie Sweatshirt',
            sku: 'HD-002-L-GRY',
            variationDetails: 'Beden: L, Renk: Gri',
            quantity: 1,
            price: '$49.99',
            destination: 'usa',
            podFileUrl: null
        }
    ],
    subtotal: '$79.97',
    shippingTotal: '$15.00',
    total: '$94.97',
    trackingNumber: null,
    carrier: null
};

// To add this order, you need to:
// 1. Create an Order model in schema.prisma OR
// 2. Store in a JSON file OR
// 3. Use the existing cart/order system

console.log('Mock Order:', JSON.stringify(mockOrder, null, 2));
