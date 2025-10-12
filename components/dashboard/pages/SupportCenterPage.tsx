import React, { useState, useMemo } from 'react';
import PageHeader from '../shared/PageHeader';
import ChatView from '../shared/ChatView';
import { SupportTicket, TicketStatus, ChatMessage } from '../types';
import StatusBadge from '../shared/StatusBadge';
import { PlusIcon } from '../icons/outline';
import CreateTicketModal from '../shared/CreateTicketModal';

interface SupportCenterPageProps {
    tickets: SupportTicket[];
    onSendMessage: (ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => void;
    onCreateTicket: (subject: string, initialMessage: Pick<ChatMessage, 'text' | 'imageUrls'>) => void;
}

const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ tickets, onSendMessage, onCreateTicket }) => {
    const TABS: TicketStatus[] = ['Açık', 'Yanıt Bekleniyor', 'Çözüldü'];
    const [activeTab, setActiveTab] = useState<TicketStatus>('Açık');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => t.status === activeTab).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    }, [tickets, activeTab]);

    if (selectedTicket) {
        return (
            <div>
                 <PageHeader
                    title={`Destek Talebi #${selectedTicket.id}`}
                    subtitle={selectedTicket.subject}
                />
                 <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                         <button onClick={() => setSelectedTicket(null)} className="text-sm font-semibold text-primary hover:underline">
                            &larr; Tüm Taleplere Geri Dön
                         </button>
                         <div className="flex items-center gap-2">
                             <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Durum:</span>
                             <StatusBadge status={selectedTicket.status as any} />
                         </div>
                    </div>
                    <ChatView
                        messages={selectedTicket.messages}
                        onSendMessage={(message) => onSendMessage(selectedTicket.id, message, 'user')}
                        isUserMessage={(sender) => sender === 'user'}
                        isClosed={selectedTicket.status === 'Çözüldü'}
                    />
                </div>
            </div>
        );
    }
    
    return (
        <div>
            {isCreateModalOpen && <CreateTicketModal onClose={() => setCreateModalOpen(false)} onCreateTicket={onCreateTicket} />}
            <PageHeader
                title="Destek Merkezi"
                subtitle="Tüm destek taleplerinizi buradan yönetebilirsiniz."
            >
                <button onClick={() => setCreateModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5"/>
                    Talep Aç
                </button>
            </PageHeader>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                {/* Filter Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <div className="flex px-2">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors focus:outline-none ${
                                    activeTab === tab 
                                    ? 'border-b-2 border-primary text-primary' 
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Ticket List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Talep ID</th>
                                <th scope="col" className="px-6 py-3">Konu</th>
                                <th scope="col" className="px-6 py-3">Son Güncelleme</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                                    <td className="px-6 py-4 font-semibold text-primary">{ticket.id}</td>
                                    <td className="px-6 py-4 font-medium text-dark-blue dark:text-slate-100">{ticket.subject}</td>
                                    <td className="px-6 py-4">{new Date(ticket.lastUpdate).toLocaleString('tr-TR')}</td>
                                    <td className="px-6 py-4"><StatusBadge status={ticket.status as any} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredTickets.length === 0 && (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Bu kategoride destek talebi bulunmuyor.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportCenterPage;