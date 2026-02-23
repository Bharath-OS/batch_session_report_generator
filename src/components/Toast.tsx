'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'error' | 'success' | 'info';
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = 'error', duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        error: 'bg-danger-light text-danger-dark border-danger/20',
        success: 'bg-success-light text-success-dark border-success/20',
        info: 'bg-primary-light text-primary-dark border-primary/20',
    };

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`px-6 py-3 rounded-2xl shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${typeStyles[type]}`}>
                {type === 'error' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                )}
                {type === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                )}
                <span className="font-semibold text-sm">{message}</span>
                <button
                    onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                    className="ml-2 hover:opacity-70 transition-opacity"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    );
}
