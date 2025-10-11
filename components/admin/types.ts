import { Category } from "../../data/categories";

export type UserStatus = 'Aktif' | 'Askıya Alındı' | 'İnceleniyor';
export type UserRole = 'member' | 'admin' | 'product lister' | 'influencer';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    tcKimlik?: string;
    vergiKimlik?: string;
    referans?: string;
    plan: '7 Günlük Deneme' | '1 Ay' | '6 Ay' | '1 Sene';
    status: UserStatus;
    registrationDate: string; // YYYY-MM-DD
    subscriptionStartDate: string; // YYYY-MM-DD
    subscriptionEndDate: string; // YYYY-MM-DD
    totalSpent: number;
    platforms: string[];
    lastLogin: string; // ISO string
}

export const initialUsers: User[] = [
    {
        id: 'user-1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@sirket.com',
        role: 'member',
        phone: '555-123-4567',
        tcKimlik: '12345678901',
        vergiKimlik: '1234567890',
        referans: 'REF123',
        plan: '1 Ay',
        status: 'Aktif',
        registrationDate: '2025-09-10',
        subscriptionStartDate: '2025-10-10',
        subscriptionEndDate: '2025-11-10',
        totalSpent: 10.00,
        platforms: ['Shopify', 'Amazon'],
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        id: 'user-2',
        name: 'Ayşe Kaya',
        email: 'ayse.kaya@example.com',
        role: 'member',
        phone: '555-987-6543',
        tcKimlik: '10987654321',
        plan: '6 Ay',
        status: 'Aktif',
        registrationDate: '2025-08-15',
        subscriptionStartDate: '2025-08-20',
        subscriptionEndDate: '2026-02-20',
        totalSpent: 50.00,
        platforms: ['WooCommerce'],
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    },
    {
        id: 'user-3',
        name: 'Mehmet Çelik',
        email: 'm.celik@test.net',
        role: 'member',
        phone: '555-456-1234',
        tcKimlik: '11223344556',
        plan: '7 Günlük Deneme',
        status: 'Askıya Alındı',
        registrationDate: '2025-10-01',
        subscriptionStartDate: '2025-10-01',
        subscriptionEndDate: '2025-10-08',
        totalSpent: 1.00,
        platforms: ['Facebook', 'Tiktok'],
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
        id: 'user-4',
        name: 'Zeynep Solmaz',
        email: 'zeynep.s@domain.org',
        role: 'product lister',
        tcKimlik: '66554433221',
        plan: '1 Sene',
        status: 'İnceleniyor',
        registrationDate: '2025-10-05',
        subscriptionStartDate: '2025-10-05',
        subscriptionEndDate: '2026-10-05',
        totalSpent: 100.00,
        platforms: ['Etsy'],
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
        plan: '1 Sene',
        status: 'Aktif',
        registrationDate: '2025-01-01',
        subscriptionStartDate: '2025-01-01',
        subscriptionEndDate: '2026-01-01',
        totalSpent: 0,
        platforms: [],
        lastLogin: new Date().toISOString(),
    },
];