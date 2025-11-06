'use client';

import { useEffect, useRef } from 'react';
import { useNotification } from "../contexts/NotificationContext";
import gsap from 'gsap';
function Toast({ toast, onDone, index }) {
    const ref = useRef(null);
    const timeoutRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        if (!toast) return;
        if (animRef.current) {
            animRef.current.kill();
            animRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (ref.current) {
            gsap.fromTo(ref.current, 
                { x: 60, opacity: 0 }, 
                { 
                    x: -175,      
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                }
            );
        }

        timeoutRef.current = setTimeout(() => {
            onDone(toast.id);
        }, toast.timeout);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [toast, onDone]);

    const toastStyles = 'bg-blue-600 text-white capitalize';

    return (
        <div
            ref={ref}
            className={`${toastStyles} 
                       px-4 py-3 rounded-md shadow-lg mb-2 font-medium text-sm
                       transform transition-all duration-200 ease-out 
                       inline-flex items-start`}
            style={{
                marginTop: index === 0 ? 0 : 8,
                wordBreak: 'break-word',
                width: 'auto',
                maxWidth: '90vw',
                marginRight: '1rem'
            }}
        >
            {toast.message}
        </div>
    );
}

export default function Notification() {
    const { toasts, removeToast } = useNotification();
    if (!toasts?.length) return null;
    
    return (
        <div className="fixed bottom-4 -right-40 z-50 flex flex-col items-end">
            {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    index={index}
                    onDone={removeToast}
                />
            ))}
        </div>
    );
}
