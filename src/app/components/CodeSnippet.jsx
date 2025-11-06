'use client';

import { useNotification } from '../contexts/NotificationContext';

export default function CodeSnippet({ code, className = '', copyButton = true }) {
    const { showNotification } = useNotification();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            showNotification('Copied!', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy', 'error');
        }
    };

    return (
        <div className={`bg-gray-900 p-2 rounded relative ${className}`}>
            <code className="text-green-400 block pr-16 overflow-x-auto">
                {code}
            </code>
            {copyButton && (
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-[50%] translate-y-[-50%] right-2 px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                    title="Copy to clipboard"
                >
                    Copy
                </button>
            )}
        </div>
    );
}
