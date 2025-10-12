import React, { useState, useMemo, useEffect } from 'react';
import { SupportTicket, TicketStatus, ChatMessage } from '../../dashboard/types';
import ChatView from '../../dashboard/shared/ChatView';
import { ChevronDownIcon, EnvelopeIcon, EnvelopeOpenIcon } from '../icons';
import StatusBadge from '../../dashboard/shared/StatusBadge';

interface ManageSupportPageProps {
    supportTickets: SupportTicket[];
    onSendMessageToTicket: (ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => void;
    onChangeTicketStatus: (ticketId: string, status: TicketStatus) => void;
    onMarkTicketAsRead: (ticketId: string) => void;
}

const ManageSupportPage: React.FC<ManageSupportPageProps> = ({ supportTickets, onSendMessageToTicket, onChangeTicketStatus, onMarkTicketAsRead }) => {
    const TABS: TicketStatus[] = ['Açık', 'Yanıt Bekleniyor', 'Çözüldü'];
    const [activeTab, setActiveTab] = useState<TicketStatus>('Açık');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

    const filteredTickets = useMemo(() => {
        return supportTickets
            .filter(t => t.status === activeTab)
            .sort((a, b) => {
                if (a.isReadByAdmin !== b.isReadByAdmin) {
                    return a.isReadByAdmin ? 1 : -1; // Unread first
                }
                return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime(); // Then by last update
            });
    }, [supportTickets, activeTab]);

    const selectedTicket = useMemo(() => {
        return supportTickets.find(t => t.id === selectedTicketId);
    }, [supportTickets, selectedTicketId]);

    useEffect(() => {
        // Automatically select the first ticket in the current filter if none is selected
        if (!selectedTicketId && filteredTickets.length > 0) {
            setSelectedTicketId(filteredTickets[0].id);
        }
        // If the selected ticket is no longer in the filtered list, clear selection
        if (selectedTicketId && !filteredTickets.some(t => t.id === selectedTicketId)) {
            setSelectedTicketId(filteredTickets.length > 0 ? filteredTickets[0].id : null);
        }
    }, [filteredTickets, selectedTicketId]);
    
    useEffect(() => {
        if (selectedTicket && !selectedTicket.isReadByAdmin) {
            onMarkTicketAsRead(selectedTicket.id);
        }
    }, [selectedTicket, onMarkTicketAsRead]);

    const handleStatusChange = (status: TicketStatus) => {
        if (selectedTicket) {
            onChangeTicketStatus(selectedTicket.id, status);
        }
        setIsStatusMenuOpen(false);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Ticket List */}
            <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-dark-blue dark:text-slate-100">Destek Talepleri</h2>
                </div>
                {/* Filter Tabs */}
                <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
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
                {/* Ticket Items */}
                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.map(ticket => (
                        <button
                            key={ticket.id}
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className={`w-full text-left p-4 border-b border-slate-200 dark:border-slate-700 flex items-start gap-3 transition-colors ${
                                selectedTicketId === ticket.id ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <div className="flex-shrink-0 pt-1">
                                {ticket.isReadByAdmin ? <EnvelopeOpenIcon className="w-5 h-5 text-slate-400" /> : <EnvelopeIcon className="w-5 h-5 text-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-dark-blue dark:text-slate-100 truncate">{ticket.userName}</p>
                                    {!ticket.isReadByAdmin && <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 ml-2" />}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{ticket.subject}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(ticket.lastUpdate).toLocaleString('tr-TR')}</p>
                            </div>
                        </button>
                    ))}
                     {filteredTickets.length === 0 && (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Bu kategoride talep bulunmuyor.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className="hidden md:flex w-2/3 flex-col">
                {selectedTicket ? (
                    <>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-dark-blue dark:text-slate-100">{selectedTicket.userName}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTicket.userEmail}</p>
                            </div>
                            <div className="relative">
                                <button onClick={() => setIsStatusMenuOpen(prev => !prev)} className="flex items-center gap-2">
                                    <StatusBadge status={selectedTicket.status as any} />
                                    <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isStatusMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                        {TABS.map(status => (
                                            <button key={status} onClick={() => handleStatusChange(status)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <ChatView
                                messages={selectedTicket.messages}
                                onSendMessage={(msg) => onSendMessageToTicket(selectedTicket.id, msg, 'support')}
                                isUserMessage={(sender) => sender === 'user'}
                                isClosed={selectedTicket.status === 'Çözüldü'}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-slate-500">Görüntülemek için bir talep seçin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSupportPage;