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
    onUploadFile: (file: File) => Promise<string>;
}

const ManageSupportPage: React.FC<ManageSupportPageProps> = ({ supportTickets, onSendMessageToTicket, onChangeTicketStatus, onMarkTicketAsRead, onUploadFile }) => {
    const TABS: (TicketStatus | 'Tümü' | 'Okunmamış')[] = ['Tümü', 'Açık', 'Yanıt Bekleniyor', 'Çözüldü', 'Okunmamış'];
    const [activeTab, setActiveTab] = useState<TicketStatus | 'Tümü' | 'Okunmamış'>('Tümü');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets = useMemo(() => {
        if (!Array.isArray(supportTickets)) return [];

        return supportTickets
            .filter(t => {
                if (!t) return false;

                // Search filter
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const matchesSearch =
                        t.ticketNumber.toString().includes(query) ||
                        t.subject.toLowerCase().includes(query) ||
                        t.userName.toLowerCase().includes(query) ||
                        t.userEmail.toLowerCase().includes(query);

                    if (!matchesSearch) return false;
                }

                if (activeTab === 'Tümü') return true;
                if (activeTab === 'Okunmamış') return !t.isReadByAdmin;
                return t.status === activeTab;
            })
            .sort((a, b) => {
                if (a.isReadByAdmin !== b.isReadByAdmin) {
                    return a.isReadByAdmin ? 1 : -1; // Unread first
                }
                const dateA = a.lastUpdate ? new Date(a.lastUpdate).getTime() : 0;
                const dateB = b.lastUpdate ? new Date(b.lastUpdate).getTime() : 0;
                return dateB - dateA; // Then by last update
            });
    }, [supportTickets, activeTab, searchQuery]);

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

    const STATUS_OPTIONS: TicketStatus[] = ['Açık', 'Yanıt Bekleniyor', 'Çözüldü'];

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Ticket List */}
            <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
                    <h2 className="text-lg font-bold text-dark-blue dark:text-slate-100">Destek Talepleri</h2>
                    <input
                        type="text"
                        placeholder="Talep ara (No, Konu, İsim, E-posta)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                {/* Filter Tabs */}
                <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                    <div className="flex px-2 min-w-max">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-3 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${activeTab === tab
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
                            className={`w-full text-left p-4 border-b border-slate-200 dark:border-slate-700 flex items-start gap-3 transition-colors ${selectedTicketId === ticket.id ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                } ${!ticket.isReadByAdmin ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                        >
                            <div className="flex-shrink-0 pt-1">
                                {ticket.isReadByAdmin ? <EnvelopeOpenIcon className="w-5 h-5 text-slate-400" /> : <EnvelopeIcon className="w-5 h-5 text-primary animate-pulse" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold truncate ${!ticket.isReadByAdmin ? 'text-primary' : 'text-dark-blue dark:text-slate-100'}`}>{ticket.userName}</p>
                                    {!ticket.isReadByAdmin && <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 ml-2 shadow-sm shadow-primary/50" />}
                                </div>
                                <p className={`text-sm truncate ${!ticket.isReadByAdmin ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>{ticket.subject}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-slate-400">#{ticket.ticketNumber}</p>
                                    <p className="text-xs text-slate-400">{new Date(ticket.lastUpdate).toLocaleString('tr-TR')}</p>
                                </div>
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
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                        #{selectedTicket.ticketNumber}
                                    </span>
                                </div>
                                <h3 className="font-bold text-dark-blue dark:text-slate-100">{selectedTicket.subject}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span>{selectedTicket.userName}</span>
                                    <span>&bull;</span>
                                    <span>{selectedTicket.userEmail}</span>
                                </div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setIsStatusMenuOpen(prev => !prev)} className="flex items-center gap-2">
                                    <StatusBadge status={selectedTicket.status as any} />
                                    <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isStatusMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                        {STATUS_OPTIONS.map(status => (
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
                                messages={Array.isArray(selectedTicket.messages) ? selectedTicket.messages : []}
                                onSendMessage={(msg) => onSendMessageToTicket(selectedTicket.id, msg, 'support')}
                                isUserMessage={(sender) => sender === 'user'}
                                isClosed={selectedTicket.status === 'Çözüldü'}
                                onUploadFile={onUploadFile}
                                userLabel="Müşteri"
                                adminLabel="Siz"
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