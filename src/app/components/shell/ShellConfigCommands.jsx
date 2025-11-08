'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function ShellConfigCommands() {
    const [aliasName, setAliasName] = useState('pa');
    const [aliasCommand, setAliasCommand] = useState('php artisan');
    const [configFile, setConfigFile] = useState('~/.zshrc');
    const [activeTab, setActiveTab] = useState('edit');

    const tabs = [
        { id: 'edit', label: 'Edit Config' },
        { id: 'alias', label: 'Create Alias' },
        { id: 'apply', label: 'Apply Changes' }
    ];

    const commands = {
        edit: {
            title: 'Edit Shell Configuration',
            description: 'Open your shell configuration file for editing',
            command: `nano ${configFile}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Config File</label>
                    <select
                        value={configFile}
                        onChange={(e) => setConfigFile(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="~/.zshrc">Zsh Config (~/.zshrc)</option>
                        <option value="~/.bashrc">Bash Config (~/.bashrc)</option>
                        <option value="~/.bash_profile">Bash Profile (~/.bash_profile)</option>
                    </select>
                </div>
            )
        },
        alias: {
            title: 'Create Alias',
            description: 'Create a shell command alias',
            command: `alias ${aliasName}="${aliasCommand}"`,
            input: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Alias Name</label>
                        <input
                            type="text"
                            value={aliasName}
                            onChange={(e) => setAliasName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., pa"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Command</label>
                        <input
                            type="text"
                            value={aliasCommand}
                            onChange={(e) => setAliasCommand(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., php artisan"
                        />
                    </div>
                </div>
            )
        },
        apply: {
            title: 'Apply Configuration Changes',
            description: 'Reload your shell configuration to apply changes',
            command: `source ${configFile}`,
            note: 'Run this after making changes to your config file or adding new aliases.'
        }
    };

    const activeCommand = commands[activeTab];

    return (
        <div className="space-y-4 comp">
            <h3  className="text-xl font-semibold !text-blue-400 mb-4">Commands</h3>
            <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                                  ? 'bg-blue-600 text-white !cursor-default'
                                : ' hover:text-white unselected-hover'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-4 component-bg rounded-lg">
                <h4 className="text-lg font-medium  mb-2">{activeCommand.title}</h4>
                <p className="description text-sm mb-3">{activeCommand.description}</p>
                {activeCommand.input}
                <div className="mt-4">
                    <CodeSnippet code={activeCommand.command} language="bash" />
                </div>
                {activeCommand.note && (
                    <p className="text-yellow-400 text-xs mt-3 italic">{activeCommand.note}</p>
                )}
            </div>
        </div>
    );
}
