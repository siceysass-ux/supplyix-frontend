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
    onMarkTicketAsRead: (ticketId: string) => void;
    onUploadFile: (file: File) => Promise<string>;
}

import Pagination from '../shared/Pagination';

// ... existing imports

const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ tickets, onSendMessage, onCreateTicket, onMarkTicketAsRead, onUploadFile }) => {
    const TABS: TicketStatus[] = ['Açık', 'Yanıt Bekleniyor', 'Çözüldü'];
    const [activeTab, setActiveTab] = useState<TicketStatus>('Açık');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset page when tab changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => t.status === activeTab).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    }, [tickets, activeTab]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const currentTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const selectedTicket = useMemo(() =>
        tickets.find(t => t.id === selectedTicketId) || null,
        [tickets, selectedTicketId]);

    // Mark as read when opening a ticket
    React.useEffect(() => {
        if (selectedTicket && !selectedTicket.isReadByUser) {
            onMarkTicketAsRead(selectedTicket.id);
        }
    }, [selectedTicket, onMarkTicketAsRead]);

    if (selectedTicket) {
        return (
            <div>
                <PageHeader
                    title={`Destek Talebi #${selectedTicket.ticketNumber}`}
                    subtitle={selectedTicket.subject}
                />
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <button onClick={() => setSelectedTicketId(null)} className="text-sm font-semibold text-primary hover:underline">
                            &larr; Tüm Taleplere Geri Dön
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Durum:</span>
                            <StatusBadge status={selectedTicket.status as any} />
                        </div>
                    </div>
                    <ChatView
                        messages={Array.isArray(selectedTicket.messages) ? selectedTicket.messages : []}
                        onSendMessage={(message) => onSendMessage(selectedTicket.id, message, 'user')}
                        isUserMessage={(sender) => sender === 'user'}
                        isClosed={selectedTicket.status === 'Çözüldü'}
                        onUploadFile={onUploadFile}
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
                    <PlusIcon className="w-5 h-5" />
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
                                className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors focus:outline-none ${activeTab === tab
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
                                <th scope="col" className="px-6 py-3">Talep No</th>
                                <th scope="col" className="px-6 py-3">Konu</th>
                                <th scope="col" className="px-6 py-3">Son Güncelleme</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {currentTickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${!ticket.isReadByUser ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                    <td className="px-6 py-4 font-semibold text-primary">
                                        <div className="flex items-center gap-2">
                                            #{ticket.ticketNumber}
                                            {!ticket.isReadByUser && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 ${!ticket.isReadByUser ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-dark-blue dark:text-slate-100'}`}>{ticket.subject}</td>
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default SupportCenterPage;