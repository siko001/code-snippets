'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

// Helper function to clean up any HTML/color spans
const cleanHtml = (text) => {
    if (!text) return '';
    
    // First, handle the specific case of color spans at the start of lines
    let cleaned = text.replace(/^\s*"color: "[^\n]*/gm, '');
    
    // Remove any remaining color spans and just keep their content
    cleaned = cleaned.replace(/<span[^>]*>(.*?)<\/span>/g, '$1');
    
    // Clean up any remaining color artifacts
    cleaned = cleaned
        .replace(/&quot;color: &quot;[^<]*?&quot;>?/g, '')
        .replace(/"color: "[^\n"]*"/g, '')
        .replace(/\s*"color: "[^\n"]*/g, '');
    
    // Remove any lines that only contain whitespace and color artifacts
    cleaned = cleaned.split('\n')
        .filter(line => !line.match(/^\s*("color: "|&quot;color: &quot;).*$/))
        .join('\n');
    
    // Decode HTML entities
    if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = cleaned;
        cleaned = textarea.value;
    }
    
    // Clean up any remaining HTML entities and tags
    const replacements = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#039;': "'"
    };
    
    cleaned = cleaned.replace(/&(?:quot|amp|lt|gt|#039);/g, match => replacements[match] || match);
    cleaned = cleaned.replace(/<[^>]*>?/gm, '');
    
    // Remove any remaining color artifacts that might have been missed
    cleaned = cleaned
        .replace(/^\s*\/\*\*[\s\S]*?\*\/\s*$/gm, '') // Remove docblocks
        .replace(/^\s*\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\s*"color: "[^\n"]*/g, '') // Remove any remaining color declarations
        .replace(/^\s*\n/gm, '') // Remove empty lines
        .trim();
    
    return cleaned;
};

// Helper function to syntax highlight PHP
const highlightPhp = (code) => {
    if (!code) return '';
    
    // Clean the input code first
    let cleanCode = cleanHtml(code);
    
    // Escape HTML to prevent XSS and preserve formatting
    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };
    
    // Start with clean, escaped code
    let highlighted = escapeHtml(cleanCode);
    
    // Handle PHP tags first
    highlighted = highlighted
        .replace(/(&lt;\?php|&lt;\?)/g, '<span style="color: #c084fc">$&</span>')
        .replace(/(\?&gt;)/g, '<span style="color: #c084fc">$1</span>');
    
    // Highlight PHP tags (handle both &lt;?php and <?)
    highlighted = highlighted
        .replace(/(&lt;\?php|&lt;\?)/g, '<span style="color: #c084fc">$1</span>')
        .replace(/(\?&gt;)/g, '<span style="color: #c084fc">$1</span>');
    
    // Highlight docblocks and comments
    highlighted = highlighted
        .replace(/(\/\*\*[\s\S]*?\*\/)/g, '<span style="color: #9ca3af">$&</span>') // Docblocks
        .replace(/(\/\/[^\n]*|#.*)/g, '<span style="color: #9ca3af">$&</span>'); // Single line comments
    
    // Highlight strings (both single and double quoted)
    highlighted = highlighted
        .replace(/(['"])((?:\\.|(?!\1).)*?)\1/g, '<span style="color: #86efac">$&</span>');
    
    // Highlight variables (including $this)
    highlighted = highlighted
        .replace(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, '<span style="color: #fde047">$&</span>');
    
    // Highlight keywords
    const keywords = [
        'public', 'private', 'protected', 'function', 'return', 'new', 'class', 
        'extends', 'use', 'static', 'fn', 'if', 'else', 'elseif', 'foreach', 
        'for', 'while', 'do', 'try', 'catch', 'finally', 'throw', 'namespace',
        'interface', 'trait', 'implements', 'abstract', 'final', 'const', 'var',
        'global', 'instanceof', 'as', 'break', 'continue', 'switch', 'case',
        'default', 'echo', 'print', 'require', 'require_once', 'include',
        'include_once', 'yield', 'yield from', 'list', 'array', 'callable',
        'bool', 'int', 'float', 'string', 'iterable', 'object', 'mixed',
        'self', 'parent', 'void', 'null', 'true', 'false'
    ];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span style="color: #60a5fa">${keyword}</span>`);
    });
    
    // Highlight functions and methods
    highlighted = highlighted
        .replace(/([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)(?=\()/g, 
            '<span style="color: #fef08a">$&</span>');
    
    // Highlight static calls
    highlighted = highlighted
        .replace(/([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)(?=::)/g, 
            '<span style="color: #93c5fd">$&</span>');
    
    // Highlight object properties/methods
    highlighted = highlighted
        .replace(/->([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, 
            '-><span style="color: #fef08a">$1</span>');
    
    // Highlight type hints and return types
    highlighted = highlighted
        .replace(/(\s+)(int|string|bool|float|array|callable|iterable|object|mixed|self|parent|void)(\s+\$|\s*[),:])/g, 
                '$1<span style="color: #60a5fa">$2</span>$3')
        .replace(/(\s+)(int|string|bool|float|array|callable|iterable|object|mixed|self|parent|void)(\s*\?\s*\$|\s*\?\s*[),:])/g,
                '$1<span style="color: #60a5fa">$2</span>$3')
        .replace(/(\s+)(\?\s*[a-zA-Z_\x7f-\x7f][a-zA-Z0-9_\x7f-\x7f]*\s*\$)/g,
                '$1<span style="color: #60a5fa">$2</span>');
    
    // Highlight numbers
    highlighted = highlighted
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #d8b4fe">$1</span>');
    
    // Indentation (handle both spaces and tabs)
    highlighted = highlighted
        .replace(/^(\s+)/gm, (match) => {
            // Convert tabs to 4 spaces for consistent display
            const spaces = match.replace(/\t/g, '    ');
            return spaces.replace(/ /g, '<span style="display: inline-block; width: 1rem;"></span>');
        });
    
    return highlighted;
};

export default function PhpSnippet({ code, className = '', copyButton = true }) {
    const { showNotification } = useNotification();
    const [highlightedCode, setHighlightedCode] = useState('');

    useEffect(() => {
        setHighlightedCode(highlightPhp(code));
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
                position: 'relative',
                margin: 0
            }}>
                <code 
                    style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        color: '#e5e7eb',
                        display: 'block',
                        whiteSpace: 'pre',
                        margin: 0,
                        padding: 0
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
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px'
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
