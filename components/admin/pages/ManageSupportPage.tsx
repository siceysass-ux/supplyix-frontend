import React, { useState, useMemo } from 'react';
import { Conversation, ConversationStatus } from '../../dashboard/types';
import ChatView from '../../dashboard/shared/ChatView';
import { ArchiveBoxIcon, TrashIcon, EnvelopeOpenIcon, EnvelopeIcon, InboxIcon } from '../icons';

interface ManageSupportPageProps {
  conversations: Conversation[];
  onAdminReply: (conversationId: string, messageText: string) => void;
  onSetConversationStatus: (conversationId: string, status: ConversationStatus) => void;
  onToggleReadStatus: (conversationId: string, isRead: boolean) => void;
}

const ManageSupportPage: React.FC<ManageSupportPageProps> = ({ conversations, onAdminReply, onSetConversationStatus, onToggleReadStatus }) => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ConversationStatus>('active');

    const filteredConversations = useMemo(() => {
        return conversations
            .filter(c => c.status === activeTab)
            .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
    }, [conversations, activeTab]);

    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    const handleSelectConversation = (convo: Conversation) => {
        setSelectedConversationId(convo.id);
        if (!convo.isRead) {
            onToggleReadStatus(convo.id, true);
        }
    };
    
    const tabs: { name: string, status: ConversationStatus }[] = [
        { name: 'Gelen Kutusu', status: 'active' },
        { name: 'Arşiv', status: 'archived' },
        { name: 'Spam', status: 'spam' }
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-dark-blue dark:text-slate-100">Destek Mesajları</h2>
                </div>
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="flex -mb-px">
                        {tabs.map(tab => (
                             <button
                                key={tab.status}
                                onClick={() => setActiveTab(tab.status)}
                                className={`flex-1 py-3 px-1 text-center text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.status
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <ul className="overflow-y-auto flex-1">
                    {filteredConversations.map(convo => {
                        const lastMessage = convo.messages[convo.messages.length - 1];
                        return (
                            <li
                                key={convo.id}
                                onClick={() => handleSelectConversation(convo)}
                                className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer group transition-colors ${
                                    selectedConversationId === convo.id ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {!convo.isRead && <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                                        <img src={convo.userAvatar} alt={convo.userName} className="w-10 h-10 rounded-full flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-semibold text-dark-blue dark:text-slate-100 truncate">{convo.userName}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">{new Date(convo.lastMessageTimestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{lastMessage?.text || 'Henüz mesaj yok'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                        {convo.status === 'active' && <button onClick={(e) => { e.stopPropagation(); onSetConversationStatus(convo.id, 'archived')}} className="p-1 text-slate-500 hover:text-primary" title="Arşivle"><ArchiveBoxIcon className="w-4 h-4" /></button>}
                                        {convo.status !== 'spam' && <button onClick={(e) => { e.stopPropagation(); onSetConversationStatus(convo.id, 'spam')}} className="p-1 text-slate-500 hover:text-red-500" title="Spam olarak işaretle"><TrashIcon className="w-4 h-4" /></button>}
                                        <button onClick={(e) => { e.stopPropagation(); onToggleReadStatus(convo.id, !convo.isRead)}} className="p-1 text-slate-500 hover:text-blue-500" title={convo.isRead ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}>
                                            {convo.isRead ? <EnvelopeIcon className="w-4 h-4" /> : <EnvelopeOpenIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Chat View */}
            <div className="w-2/3 flex flex-col">
                {selectedConversation ? (
                    <ChatView
                        messages={selectedConversation.messages}
                        onSendMessage={(msg) => onAdminReply(selectedConversation.id, msg)}
                        isSending={false} // Placeholder
                        currentUser="support"
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-800/50">
                        <InboxIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                        <h3 className="mt-4 text-lg font-semibold text-dark-blue dark:text-slate-200">Bir görüşme seçin</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Başlamak için sol taraftaki listeden bir kullanıcı görüşmesi seçin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSupportPage;