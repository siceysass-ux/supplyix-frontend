import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon, DocumentTextIcon } from '../icons/outline';

interface SupportCenterPageProps {
    chatMessages: ChatMessage[];
    onSendMessage: (messageText: string, file?: File) => void;
}

const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ chatMessages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() || attachedFile) {
            onSendMessage(newMessage.trim(), attachedFile || undefined);
            setNewMessage('');
            setAttachedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 flex items-center space-x-3 flex-shrink-0">
                    <div className="relative">
                        <img src="/logo.png" alt="Supplyix Danışmanı" className="w-10 h-10 rounded-full object-contain bg-slate-100 p-1" />
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                    </div>
                    <div>
                        <h2 className="text-md font-semibold text-dark-blue">Supplyix Danışmanı</h2>
                        <p className="text-xs text-slate-500">Çevrimiçi</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'consultant' && (
                                <img src={msg.avatar} alt="Danışman" className="w-8 h-8 rounded-full self-start flex-shrink-0" />
                            )}
                            <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                {msg.text && <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>}
                                {msg.file && (
                                    <div className={`mt-2 p-2.5 rounded-lg flex items-center space-x-3 ${msg.sender === 'user' ? 'bg-primary-focus' : 'bg-slate-200'}`}>
                                        <DocumentTextIcon className={`w-6 h-6 flex-shrink-0 ${msg.sender === 'user' ? 'text-white' : 'text-slate-500'}`} />
                                        <div className="text-xs min-w-0">
                                            <p className={`font-semibold truncate ${msg.sender === 'user' ? 'text-white' : 'text-slate-700'}`}>{msg.file.name}</p>
                                            <p className={`${msg.sender === 'user' ? 'text-white/80' : 'text-slate-500'}`}>{`${(msg.file.size / 1024).toFixed(1)} KB`}</p>
                                        </div>
                                    </div>
                                )}
                                <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0">
                    {attachedFile && (
                        <div className="p-3 border-t border-b border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-slate-600 min-w-0">
                                <PaperClipIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate flex-1" title={attachedFile.name}>{attachedFile.name}</span>
                            </div>
                            <button onClick={() => { setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
                                aria-label="Dosya Ekle"
                            >
                                <PaperClipIcon className="w-6 h-6" />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Mesajınızı buraya yazın..."
                                className="w-full bg-white p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white p-3 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-110 disabled:bg-primary/50 disabled:scale-100 disabled:cursor-not-allowed"
                                disabled={!newMessage.trim() && !attachedFile}
                                aria-label="Gönder"
                            >
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportCenterPage;