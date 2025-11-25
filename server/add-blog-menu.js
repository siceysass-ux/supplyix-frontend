const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addBlogMenuItem() {
    try {
        // Check if blog menu item already exists
        const existing = await prisma.navItem.findFirst({
            where: {
                label: 'Blog Yönetimi',
                type: 'admin'
            }
        });

        if (existing) {
            console.log('✅ Blog Yönetimi menu item already exists!');
            console.log('Menu item:', existing);
        } else {
            // Add blog menu item
            const newMenuItem = await prisma.navItem.create({
                data: {
                    label: 'Blog Yönetimi',
                    path: '/admin/blog',
                    type: 'admin',
                    order: 7
                }
            });
            console.log('✅ Blog Yönetimi menu item added successfully!');
            console.log('New menu item:', newMenuItem);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addBlogMenuItem();
