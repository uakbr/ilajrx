import { useState, useCallback } from 'react';
import { ToastType } from '../components/Toast';

interface ToastState {
    show: boolean;
    message: string;
    type: ToastType;
}

export function useToast(duration = 3000) {
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'info',
    });

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ show: true, message, type });
        const timer = setTimeout(hideToast, duration);
        return () => clearTimeout(timer);
    }, [duration, hideToast]);

    return {
        toast,
        showToast,
        hideToast,
    };
} 