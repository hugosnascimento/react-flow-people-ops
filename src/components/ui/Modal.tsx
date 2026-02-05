import React from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './index';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in border border-slate-100">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">{title}</h3>
                    <IconButton icon="close" onClick={onClose} />
                </div>

                <div className="p-6">
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
