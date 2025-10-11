import React from 'react';
import PageHeader from '../shared/PageHeader';
import { ChatMessage } from '../types';
import ChatView from '../shared/ChatView';

interface SupportCenterPageProps {
  chatHistory: ChatMessage[];
  onSendMessage: (messageText: string) => void;
}

const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ chatHistory, onSendMessage }) => {
    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col">
            <PageHeader
                title="Supplyix Danışmanı"
                subtitle="Sorularınız ve destek talepleriniz için buradayız."
            />
            <div className="flex-grow bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <ChatView
                    messages={chatHistory}
                    onSendMessage={onSendMessage}
                    isSending={false} // Placeholder, can be enhanced with state
                    currentUser="user"
                />
            </div>
        </div>
    );
};

export default SupportCenterPage;
