import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '../icons/outline';
import { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
  isSending: boolean;
  currentUser: 'user' | 'support';
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isSending, currentUser }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800/50">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender !== currentUser && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">
                                {msg.sender === 'support' ? 'S' : 'U'}
                            </div>
                        )}
                        <div
                            className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                                msg.sender === currentUser
                                    ? 'bg-primary text-white rounded-br-lg'
                                    : 'bg-slate-200 dark:bg-slate-700 text-dark-blue dark:text-slate-200 rounded-bl-lg'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-line">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === currentUser ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'} text-right`}>
                                {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                         {msg.sender === currentUser && (
                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-bold text-white">
                                {msg.sender === 'support' ? 'S' : 'U'}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <button type="button" className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-focus">
                        <PaperClipIcon className="w-5 h-5" />
                    </button>
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSend(e); } }}
                        placeholder="Mesajınızı yazın..."
                        rows={1}
                        className="flex-1 bg-white dark:bg-slate-700 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-primary focus:border-primary resize-none"
                        disabled={isSending}
                    />
                    <button type="submit" className="p-2 bg-primary text-white rounded-full hover:bg-primary-focus disabled:bg-primary/70" disabled={isSending || !newMessage.trim()}>
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;