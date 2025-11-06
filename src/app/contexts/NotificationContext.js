'use client';

import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);
    const lastToastRef = useRef({message: null, time: 0});

    // Show notification: add to queue
    const showNotification = useCallback((message, type = 'success', timeout = 3000) => {
        const now = Date.now();
        const id = now + Math.random();
        
        // Update the toasts array by adding the new toast
        setToasts(prevToasts => [...prevToasts, { id, message, type, timeout }]);
        
        // Remove the toast after its timeout
        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, timeout);
    }, []);

    // Remove a toast by id
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const contextValue = useMemo(
        () => ({
            toasts,
            showNotification,
            removeToast,
        }),
        [toasts, showNotification, removeToast]
    );

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
