
import React, { useState } from 'react';
import { Announcement } from '../../dashboard/types';
import { TrashIcon } from '../../dashboard/icons/outline';

interface AnnouncementsPageProps {
    announcements: Announcement[];
    onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
    onDeleteAnnouncement: (id: string) => void;
}

const announcementTypeOptions: { value: Announcement['type']; label: string }[] = [
    { value: 'primary', label: 'Genel (Turuncu)' },
    { value: 'blue', label: 'Güncelleme (Mavi)' },
    { value: 'green', label: 'Yeni Özellik (Yeşil)' },
];

const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ announcements, onAddAnnouncement, onDeleteAnnouncement }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<Announcement['type']>('primary');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError('Başlık ve açıklama alanları zorunludur.');
            return;
        }
        onAddAnnouncement({ title, content, type });
        setTitle('');
        setContent('');
        setType('primary');
        setError('');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue mb-4">Yeni Duyuru Oluştur</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Duyuru Başlığı *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 p-2 rounded-md border border-slate-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Açıklama *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-50 p-2 rounded-md border border-slate-300"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Duyuru Türü</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as Announcement['type'])}
                            className="w-full bg-slate-50 p-2 rounded-md border border-slate-300"
                        >
                            {announcementTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">
                            Duyuruyu Yayınla
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue mb-4">Mevcut Duyurular</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Başlık</th>
                                <th className="px-6 py-3">Tarih</th>
                                <th className="px-6 py-3">Tür</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {announcements.map(announcement => (
                                <tr key={announcement.id}>
                                    <td className="px-6 py-4 font-medium text-dark-blue">{announcement.title}</td>
                                    <td className="px-6 py-4">{announcement.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${announcement.type === 'primary' ? 'bg-orange-100 text-orange-800' :
                                            announcement.type === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {announcementTypeOptions.find(o => o.value === announcement.type)?.label.split(' ')[0]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onDeleteAnnouncement(announcement.id)} className="p-2 text-red-600 hover:bg-red-500/10 rounded-md" title="Sil">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsPage;
