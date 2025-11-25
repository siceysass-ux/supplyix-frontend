import React, { useState, useRef } from 'react';
import { ChatMessage } from '../types';
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '../icons/outline';

interface ChatViewProps {
    messages: ChatMessage[];
    onSendMessage: (message: Pick<ChatMessage, 'text' | 'imageUrls'>) => void;
    isUserMessage: (sender: 'user' | 'support') => boolean;
    isClosed: boolean;
    onUploadFile?: (file: File) => Promise<string>;
    userLabel?: string;
    adminLabel?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isUserMessage, isClosed, onUploadFile, userLabel = 'Siz', adminLabel = 'Destek Ekibi' }) => {
    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isReplying, setIsReplying] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() || attachments.length > 0) {
            let imageUrls: string[] = [];

            if (attachments.length > 0) {
                if (onUploadFile) {
                    try {
                        imageUrls = await Promise.all(attachments.map(onUploadFile));
                    } catch (error) {
                        console.error("Failed to upload files:", error);
                        alert("Dosya yüklenirken bir hata oluştu.");
                        return;
                    }
                } else {
                    imageUrls = await Promise.all(attachments.map(fileToBase64));
                }
            }

            onSendMessage({
                text: newMessage.trim(),
                imageUrls,
            });
            setNewMessage('');
            setAttachments([]);
            setIsReplying(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="space-y-6">
                {messages.map((msg, index) => {
                    const isUser = isUserMessage(msg.sender);
                    return (
                        <div key={index} className="flex flex-col">
                            <div className={`w-full p-4 rounded-lg border ${isUser ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700' : 'bg-primary/10 border-primary/20'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className={`text-sm font-bold ${isUser ? 'text-dark-blue dark:text-slate-100' : 'text-primary'}`}>
                                        {isUser ? userLabel : adminLabel}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{msg.timestamp}</p>
                                </div>
                                {msg.text && <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{msg.text}</p>}
                                {msg.imageUrls && msg.imageUrls.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {msg.imageUrls.map((url, i) => (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square">
                                                <img src={url} alt={`Ek ${i + 1}`} className="w-full h-full object-cover rounded-md border border-slate-300 dark:border-slate-600" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                {isClosed ? (
                    <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Bu destek talebi çözülmüştür ve yeni mesaj gönderilemez.</p>
                    </div>
                ) : isReplying ? (
                    <div className="space-y-3">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Mesajınızı buraya yazın..."
                            rows={5}
                            className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        {attachments.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {attachments.map((file, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img src={URL.createObjectURL(file)} alt="Önizleme" className="w-full h-full object-cover rounded-md" />
                                        <button type="button" onClick={() => handleRemoveAttachment(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80">
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-primary rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                                <PaperClipIcon className="w-6 h-6" />
                            </button>
                            <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} accept="image/*" className="hidden" />
                            <div className="flex gap-3">
                                <button onClick={() => { setIsReplying(false); setAttachments([]); }} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500">
                                    İptal
                                </button>
                                <button onClick={handleSendMessage} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus flex items-center gap-2">
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsReplying(true)} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">
                        Talebi Yanıtla
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatView;