'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function GitCommand({
    title,
    id,
    initialCommand = '',
    children,
    initialValues = {},
    onValuesChange
}) {
    const [displayCommand, setDisplayCommand] = useState(initialCommand);
    const [canCopy, setCanCopy] = useState(false);
    const commandRef = useRef(initialCommand);
    const [inputValues, setInputValues] = useState(initialValues);

    // Notify parent of value changes
    useEffect(() => {
        if (onValuesChange) {
            onValuesChange(inputValues);
        }
    }, [inputValues, onValuesChange]);

    // Handle command updates from children
    const handleCommandUpdate = useCallback((cmd) => {
        if (typeof cmd === 'object' && cmd !== null) {
            commandRef.current = cmd.command || '';
            setDisplayCommand(cmd.command || '');
            setCanCopy(!!cmd.isCopyable);
        } else {
            commandRef.current = cmd || '';
            setDisplayCommand(cmd || '');
            setCanCopy(!!cmd);
        }
    }, []);

    const handleInputChange = useCallback((key, value) => {
        setInputValues(prev => {
            const newValues = {
                ...prev,
                [key]: value
            };
            return newValues;
        });
    }, []);

    const handleSetInputValues = useCallback((updater) => {
        setInputValues(prev => {
            const newValues = typeof updater === 'function' ? updater(prev) : updater;
            return { ...prev, ...newValues };
        });
    }, []);

    const isFormComplete = useCallback(() => {
        if (typeof initialCommand === 'function') {
            // For function-based commands, we'll consider it complete if the command doesn't contain placeholders
            const cmd = initialCommand(inputValues);
            return !/\{[^}]+\}/.test(cmd);
        }
        
        // For template-based commands, validate required fields
        const requiredFields = [];
        const matches = initialCommand.matchAll(/\{([^}]+)\}/g);
        for (const match of matches) {
            requiredFields.push(match[1]);
        }
        
        return requiredFields.every(field => {
            const value = inputValues[field];
            return value !== undefined && value !== '';
        });
    }, [initialCommand, inputValues]);

    // Always show the command section if there's a command
    const commandSection = displayCommand ? (
        <CodeSnippet
            code={displayCommand}
            className="mb-4"
            copyButton={canCopy}
        />
    ) : null;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 id={id} className="text-xl font-semibold text-blue-400 mb-4">{title}</h3>

            <div className="space-y-4">
                {children({
                    handleInputChange,
                    inputValues: {
                        ...inputValues,
                        setCommand: handleCommandUpdate
                    },
                    setInputValues: handleSetInputValues
                })}

                {commandSection}
            </div>
        </div>
    );
}
