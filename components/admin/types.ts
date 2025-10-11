
export type UserStatus = 'Aktif' | 'Askıya Alındı' | 'İnceleniyor';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    plan: '7 Günlük Deneme' | '1 Ay' | '6 Ay' | '1 Sene';
    status: UserStatus;
    registrationDate: string; // YYYY-MM-DD
    lastLogin: string; // "YYYY-MM-DD HH:mm"
    totalSpent: number;
}

export const initialUsers: User[] = [
    {
        id: 'user-1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@sirket.com',
        avatar: 'https://i.pravatar.cc/150?u=supplyix',
        plan: '1 Ay',
        status: 'Aktif',
        registrationDate: '2025-10-10',
        lastLogin: '2025-10-12 09:30',
        totalSpent: 197.00
    },
    {
        id: 'user-2',
        name: 'Ayşe Kaya',
        email: 'ayse.kaya@ornek.com',
        avatar: 'https://i.pravatar.cc/150?u=ayse',
        plan: '6 Ay',
        status: 'Aktif',
        registrationDate: '2025-08-15',
        lastLogin: '2025-10-11 14:00',
        totalSpent: 350.50
    },
    {
        id: 'user-3',
        name: 'Mehmet Çelik',
        email: 'm.celik@test.net',
        avatar: 'https://i.pravatar.cc/150?u=mehmet',
        plan: '7 Günlük Deneme',
        status: 'Askıya Alındı',
        registrationDate: '2025-10-01',
        lastLogin: '2025-10-05 11:20',
        totalSpent: 1.00
    },
    {
        id: 'user-4',
        name: 'Fatma Demir',
        email: 'fatma.d@eposta.org',
        avatar: 'https://i.pravatar.cc/150?u=fatma',
        plan: '1 Sene',
        status: 'İnceleniyor',
        registrationDate: '2025-05-20',
        lastLogin: '2025-10-10 18:45',
        totalSpent: 980.00
    },
];
