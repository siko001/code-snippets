'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

// Helper function to syntax highlight YAML
const highlightYaml = (yaml) => {
    if (!yaml) return '';
    
    // Key-value pairs with quotes
    let highlighted = yaml
        .replace(/([\w-]+):/g, '<span style="color: #7dd3fc">$1</span>:')
        .replace(/: (['"])(.*?)\1/g, ': <span style="color: #86efac">$1$2$1</span>')
        .replace(/: (true|false|null|\d+)/g, ': <span style="color: #d8b4fe">$1</span>')
        .replace(/(#.*$)/gm, '<span style="color: #9ca3af">$1</span>');
    
    // Indentation
    highlighted = highlighted.replace(/^(\s+)/gm, (match) => 
        match.replace(/ /g, '<span style="display: inline-block; width: 1rem;"></span>')
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
        <div style={{ position: 'relative' }} className={className}>
            <pre style={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                overflowX: 'auto',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                position: 'relative'
            }}>
                <code 
                    style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        color: '#e5e7eb',
                        display: 'block',
                        whiteSpace: 'pre'
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightedCode || code }}
                />
                {copyButton && (
                    <button 
                        onClick={copyToClipboard}
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            padding: '0.375rem',
                            borderRadius: '0.25rem',
                            backgroundColor: 'rgba(31, 41, 55, 0.9)',
                            color: '#d1d5db',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.9)';
                            e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.9)';
                            e.currentTarget.style.color = '#d1d5db';
                        }}
                        title="Copy to clipboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                )}
            </pre>
        </div>
    );
}
