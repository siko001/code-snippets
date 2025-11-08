'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

// Helper function to parse YAML into tokens for syntax highlighting
const parseYaml = (yaml) => {
    if (!yaml) return [];
    
    return yaml.split('\n').map((line, i) => {
        // Match key-value pairs
        const keyMatch = line.match(/^(\s*)([\w-]+):/);
        const valueMatch = line.match(/:\s*(['"]?)(.*?)(['"]?)$/);
        const commentMatch = line.match(/(#.*)$/);
        
        const parts = [];
        
        // Add indentation
        if (keyMatch && keyMatch[1]) {
            const spaces = keyMatch[1].length;
            parts.push({ type: 'indent', value: ' '.repeat(spaces) });
        }
        
        // Add key
        if (keyMatch && keyMatch[2]) {
            parts.push({ type: 'key', value: keyMatch[2] + ':' });
        }
        
        // Add value
        if (valueMatch && valueMatch[2]) {
            const quote = valueMatch[1] || '';
            parts.push({ 
                type: 'value', 
                value: valueMatch[2],
                quoted: !!valueMatch[1],
                isBoolean: ['true', 'false'].includes(valueMatch[2].toLowerCase()),
                isNumber: !isNaN(valueMatch[2]) && valueMatch[2].trim() !== ''
            });
        }
        
        // Add comment
        if (commentMatch) {
            parts.push({ type: 'comment', value: commentMatch[1] });
        }
        
        return { line: i + 1, parts };
    });
};

export default function YamlSnippet({ code, className = '', copyButton = true }) {
    const { showNotification } = useNotification();
    const [parsedYaml, setParsedYaml] = useState([]);

    useEffect(() => {
        setParsedYaml(parseYaml(code));
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
                        whiteSpace: 'pre',
                        lineHeight: '1.5'
                    }}
                >
                    {parsedYaml.map((line, i) => (
                        <div key={i} style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {line.parts.map((part, j) => {
                                let style = { color: '#e5e7eb' };
                                
                                switch(part.type) {
                                    case 'key':
                                        style.color = '#7dd3fc';
                                        break;
                                    case 'value':
                                        if (part.quoted) {
                                            style.color = '#86efac';
                                        } else if (part.isBoolean) {
                                            style.color = '#d8b4fe';
                                        } else if (part.isNumber) {
                                            style.color = '#fca5a5';
                                        } else {
                                            style.color = '#e5e7eb';
                                        }
                                        break;
                                    case 'comment':
                                        style.color = '#9ca3af';
                                        break;
                                    case 'indent':
                                        return (
                                            <span key={j} style={{ display: 'inline-block', width: `${part.value.length * 0.5}rem` }} />
                                        );
                                    default:
                                        break;
                                }
                                
                                return (
                                    <span key={j} style={style}>
                                        {part.value}
                                    </span>
                                );
                            })}
                        </div>
                    ))}
                </code>
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
