'use client';
import { useState, useEffect, useCallback } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function GitCommand({
    title,
    id,
    initialCommand = '',
    children,
    initialValues = {},
    onValuesChange
}) {
    const [command, setCommand] = useState(initialCommand);
    const [inputValues, setInputValues] = useState(initialValues);

    // Notify parent of value changes
    useEffect(() => {
        if (onValuesChange) {
            onValuesChange(inputValues);
        }
    }, [inputValues, onValuesChange]);

    // Update command when input values or initialCommand changes
    useEffect(() => {
        let updatedCommand = '';
        
        if (typeof initialCommand === 'function') {
            // If initialCommand is a function, call it with the current input values
            updatedCommand = initialCommand(inputValues);
        } else {
            // Otherwise treat it as a template string
            updatedCommand = initialCommand;
            Object.entries(inputValues).forEach(([key, value]) => {
                updatedCommand = updatedCommand.replace(
                    new RegExp(`\\{${key}\\}`,"g"), 
                    value || `[${key}]`
                );
            });
        }

        setCommand(updatedCommand);
    }, [inputValues, initialCommand]);

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
    const commandSection = command ? (
        <CodeSnippet
            code={command}
            className="mb-4"
            copyButton={true}  // Always show copy button when there's a command
        />
    ) : null;

    return (
        <div className="component-wrapper p-6 rounded-lg shadow-lg">
            <h3 id={id} className="text-xl font-semibold !text-blue-400 mb-4">{title}</h3>

            <div className="space-y-4">
                {children({
                    handleInputChange,
                    inputValues: {
                        ...inputValues,
                        setCommand: (cmd) => setCommand(cmd || '')
                    },
                    setInputValues: handleSetInputValues
                })}

                {commandSection}
            </div>
        </div>
    );
}
