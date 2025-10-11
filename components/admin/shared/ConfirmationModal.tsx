import React from 'react';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel, confirmText = "Onayla", cancelText = "İptal" }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-dark-blue">{title}</h2>
                    <p className="text-sm text-slate-600 mt-2">{message}</p>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
                    <button onClick={onCancel} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300">{cancelText}</button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;