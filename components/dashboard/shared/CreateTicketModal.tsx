import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '../icons/outline';
import { ChatMessage } from '../types';

interface CreateTicketModalProps {
    onClose: () => void;
    onCreateTicket: (subject: string, initialMessage: Pick<ChatMessage, 'text' | 'imageUrls'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ onClose, onCreateTicket }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!subject.trim() || !message.trim()) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        setIsSubmitting(true);
        try {
            const imageUrls = await Promise.all(attachments.map(fileToBase64));
            onCreateTicket(subject, { text: message, imageUrls });
            onClose();
        } catch (err) {
            console.error("File conversion error:", err);
            setError("Görseller yüklenirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Yeni Destek Talebi Oluştur</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Konu *</label>
                            <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mesajınız *</label>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Görsel Yükle (Opsiyonel)</label>
                            <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer hover:border-primary">
                                <div className="space-y-1 text-center">
                                    <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Görsel seçmek için tıklayın</p>
                                </div>
                            </div>
                            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
                            {attachments.length > 0 && (
                                <div className="mt-2 grid grid-cols-4 gap-2">
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
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50">İptal</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:bg-primary/70 disabled:cursor-wait">
                           {isSubmitting ? 'Gönderiliyor...' : 'Talep Gönder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketModal;