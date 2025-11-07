'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

// Helper function to syntax highlight YAML
const highlightYaml = (yaml) => {
    if (!yaml) return '';
    
    // Key-value pairs with quotes
    let highlighted = yaml
        .replace(/([\w-]+):/g, '<span class="text-blue-400">$1</span>:')
        .replace(/: (['"])(.*?)\1/g, ': <span class="text-green-300">$1$2$1</span>')
        .replace(/: (true|false|null|\d+)/g, ': <span class="text-purple-400">$1</span>')
        .replace(/(#.*$)/gm, '<span class="text-gray-500">$1</span>');
    
    // Indentation
    highlighted = highlighted.replace(/^(\s+)/gm, (match) => 
        match.replace(/ /g, '<span class="inline-block w-4"></span>')
    );
    
    return highlighted;
};

export default function YamlSnippet({ code, className = '', copyButton = true }) {
    const { showNotification } = useNotification();
    const [highlightedCode, setHighlightedCode] = useState('');

    useEffect(() => {
        setHighlightedCode(highlightYaml(code));
    }, [code]);

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
        <div className={`relative ${className}`}>
            <pre className="bg-gray-900/80 p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm relative">
                <code 
                    className="font-mono text-gray-300 block"
                    dangerouslySetInnerHTML={{ __html: highlightedCode || code }}
                />
                {copyButton && (
                    <button 
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 p-1.5 rounded bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 hover:text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                )}
            </pre>
        </div>
    );
}
