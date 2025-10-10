import React from 'react';
import PageHeader from '../shared/PageHeader';
import { AcademicCapIcon } from '../icons/outline';
import EmptyState from '../shared/EmptyState';

const appointments = [
    { topic: 'Pazaryeri Entegrasyonu', date: '15.10.2025', time: '14:00', status: 'Tamamlandı' },
    { topic: 'Reklam Stratejileri', date: '20.10.2025', time: '11:00', status: 'Onaylandı' },
];

const ConsultingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const hasAppointments = appointments.length > 0;
    
    return (
        <div>
            <PageHeader
                title="Danışmanlık"
                subtitle="Uzmanlarımızdan destek alın, randevularınızı yönetin."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Request Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center text-dark-blue mb-4">
                            <AcademicCapIcon className="h-8 w-8 text-primary mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold">Kalan Danışmanlık Hakkı</h3>
                                <p className="text-2xl font-bold">120 <span className="text-lg font-normal">dakika</span></p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <h4 className="font-semibold text-dark-blue mb-4">Yeni Danışmanlık Talebi</h4>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Konu</label>
                                <input type="text" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tercih Edilen Tarih</label>
                                <input type="date" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300 text-gray-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Notlarınız</label>
                                <textarea rows={3} className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors">
                                Talep Gönder
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column - Appointments List */}
                <div className="lg:col-span-2">
                     {hasAppointments ? (
                         <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konu</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saat</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {appointments.map(app => (
                                            <tr key={app.topic}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-blue">{app.topic}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{app.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     ) : (
                        <EmptyState 
                            icon={<AcademicCapIcon className="h-12 w-12 text-gray-400" />}
                            title="Henüz danışmanlık talebiniz yok"
                            message="E-ticaret yolculuğunuzda uzmanlarımızdan destek almak için yeni bir talep oluşturun."
                        />
                     )}
                </div>
            </div>
        </div>
    );
};

export default ConsultingPage;
