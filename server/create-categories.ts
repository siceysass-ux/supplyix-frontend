import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📦 Creating categories...');

    const categories = [
        {
            name: 'Elektronik',
            subcategories: ['Telefon', 'Bilgisayar', 'Kulaklık', 'Tablet']
        },
        {
            name: 'Giyim',
            subcategories: ['Tişört', 'Pantolon', 'Elbise', 'Ayakkabı']
        },
        {
            name: 'Ev & Yaşam',
            subcategories: ['Mutfak', 'Banyo', 'Dekorasyon', 'Mobilya']
        },
        {
            name: 'Spor & Outdoor',
            subcategories: ['Fitness', 'Kamp', 'Bisiklet', 'Koşu']
        }
    ];

    for (const cat of categories) {
        const existing = await prisma.category.findUnique({
            where: { name: cat.name }
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    name: cat.name,
                    productCount: 0,
                    subcategories: {
                        create: cat.subcategories.map(sub => ({ name: sub }))
                    }
                }
            });
            console.log(`✅ Created category: ${cat.name}`);
        } else {
            console.log(`ℹ️  Category already exists: ${cat.name}`);
        }
    }

    console.log('🎉 Categories created successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
