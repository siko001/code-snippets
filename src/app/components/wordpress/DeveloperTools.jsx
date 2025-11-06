'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function DeveloperTools() {
    const [activeTab, setActiveTab] = useState('theme');
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [transients, setTransients] = useState([]);
    const [selectedTransient, setSelectedTransient] = useState('');
    const [rewriteRules, setRewriteRules] = useState('');
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [translationAction, setTranslationAction] = useState('list');
    const [language, setLanguage] = useState('');

    // Set default command based on active tab
    useEffect(() => {
        if (activeTab === 'theme') {
            setOutput('wp theme list --format=json');
        } else if (activeTab === 'transient') {
            setOutput('wp transient list');
        } else if (activeTab === 'rewrite') {
            setOutput('wp rewrite list');
        } else if (activeTab === 'multisite') {
            setOutput('wp site list');
        } else if (activeTab === 'maintenance') {
            setOutput('wp maintenance-mode status');
        } else if (activeTab === 'translations') {
            setOutput('wp language core list --format=json');
        }
    }, [activeTab]);

    const executeCommand = (command) => {
        setOutput(command);
        // In a real app, you would execute the command here
    };

    const toggleMaintenanceMode = () => {
        const newMode = !maintenanceMode;
        setMaintenanceMode(newMode);
        const command = newMode ? 'wp maintenance-mode activate' : 'wp maintenance-mode deactivate';
        setOutput(command);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <h3 id="wp-dev-tools" className="text-xl font-semibold text-white mb-4">
                Developer Tools
            </h3>
            
            {/* Tabs */}
            <div className="relative mb-6">
                <div className="flex space-x-1 overflow-x-auto pb-2 -mx-1 scrollbar-hide">
                    <div className="flex space-x-1 px-1">
                        {[
                            { id: 'theme', label: 'Theme Management' },
                            { id: 'transient', label: 'Transients' },
                            { id: 'rewrite', label: 'Rewrite Rules' },
                            { id: 'multisite', label: 'Multisite' },
                            { id: 'maintenance', label: 'Maintenance Mode' },
                            { id: 'translations', label: 'Core Translations' },
                        ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 whitespace-nowrap rounded-lg ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white !cursor-auto'
                                : 'bg-gray-600 text-gray-300 cursor-pointer hover:bg-gray-500'
                        }`}
                    >
                        {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900 p-4 rounded-b-lg rounded-tr-lg">
                {/* Theme Management */}
                {activeTab === 'theme' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Select Theme Action
                            </label>
                            <select
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                value={selectedTheme}
                                onChange={(e) => setSelectedTheme(e.target.value)}
                            >
                                <option value="">Select an action...</option>
                                <option value="list">List All Themes</option>
                                <option value="update">Update All Themes</option>
                                <option value="status">Show Active Theme</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                let command = 'wp theme';
                                if (selectedTheme === 'list') command += ' list --format=json';
                                else if (selectedTheme === 'update') command += ' update --all';
                                else if (selectedTheme === 'status') command += ' status';
                                executeCommand(command);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            disabled={!selectedTheme}
                        >
                            Execute
                        </button>
                    </div>
                )}

                {/* Transients */}
                {activeTab === 'transient' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Transient Action
                            </label>
                            <select
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                value={selectedTransient}
                                onChange={(e) => setSelectedTransient(e.target.value)}
                            >
                                <option value="">Select an action...</option>
                                <option value="list">List All Transients</option>
                                <option value="delete-expired">Delete Expired Transients</option>
                                <option value="delete-all">Delete All Transients</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                let command = 'wp transient';
                                if (selectedTransient === 'list') command += ' list';
                                else if (selectedTransient === 'delete-expired') command += ' delete --expired';
                                else if (selectedTransient === 'delete-all') command += ' delete --all';
                                executeCommand(command);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            disabled={!selectedTransient}
                        >
                            Execute
                        </button>
                    </div>
                )}

                {/* Rewrite Rules */}
                {activeTab === 'rewrite' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-lg font-medium text-gray-300">Rewrite Rules</h4>
                            <p className="text-sm text-gray-400">
                                Manage WordPress rewrite rules and permalinks
                            </p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => executeCommand('wp rewrite list')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                List Rewrite Rules
                            </button>
                            <button
                                onClick={() => executeCommand('wp rewrite flush')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                            >
                                Flush Rewrite Rules
                            </button>
                        </div>
                    </div>
                )}

                {/* Multisite */}
                {activeTab === 'multisite' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Multisite Actions
                            </label>
                            <select
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                                value={selectedSite}
                                onChange={(e) => setSelectedSite(e.target.value)}
                            >
                                <option value="">Select an action...</option>
                                <option value="list">List All Sites</option>
                                <option value="create">Create New Site</option>
                                <option value="status">Show Network Info</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                let command = 'wp site';
                                if (selectedSite === 'list') command += ' list';
                                else if (selectedSite === 'create') command += ' create --slug=newsite --title="New Site"';
                                else if (selectedSite === 'status') command += ' status';
                                executeCommand(command);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            disabled={!selectedSite}
                        >
                            Execute
                        </button>
                    </div>
                )}

                {/* Core Translations */}
                {activeTab === 'translations' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Translation Action
                            </label>
                            <div className="flex space-x-4 mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-blue-600"
                                        name="translationAction"
                                        value="list"
                                        checked={translationAction === 'list'}
                                        onChange={(e) => setTranslationAction(e.target.value)}
                                    />
                                    <span className="ml-2 text-gray-300">List Translations</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-blue-600"
                                        name="translationAction"
                                        value="update"
                                        checked={translationAction === 'update'}
                                        onChange={(e) => setTranslationAction(e.target.value)}
                                    />
                                    <span className="ml-2 text-gray-300">Update Translations</span>
                                </label>
                            </div>

                            {translationAction === 'update' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Language Code (e.g., fr_FR, de_DE, es_ES)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                        placeholder="fr_FR"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    />
                                    <p className="mt-1 text-xs text-gray-400">
                                        Leave empty to update all installed languages
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    let command = 'wp language core';
                                    if (translationAction === 'list') {
                                        command += ' list --format=json';
                                    } else {
                                        command += language 
                                            ? ` update ${language} --dry-run`
                                            : ' update --all --dry-run';
                                    }
                                    executeCommand(command);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                {translationAction === 'list' ? 'List Translations' : 'Update Translations'}
                            </button>

                            {translationAction === 'update' && (
                                <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-md">
                                    <p className="text-yellow-400 text-sm">
                                        <span className="font-semibold">Note:</span> The command includes the <code className="bg-gray-800 px-1 py-0.5 rounded">--dry-run</code> flag by default.
                                        Remove it from the generated command to perform the actual update.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Maintenance Mode */}
                {activeTab === 'maintenance' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-medium text-gray-300">Maintenance Mode</h4>
                                <p className="text-sm text-gray-400">
                                    {maintenanceMode 
                                        ? 'Maintenance mode is currently ACTIVE' 
                                        : 'Maintenance mode is currently INACTIVE'}
                                </p>
                            </div>
                            <button
                                onClick={toggleMaintenanceMode}
                                className={`px-4 py-2 rounded-md ${maintenanceMode 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-red-600 hover:bg-red-700'} text-white`}
                            >
                                {maintenanceMode ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">
                                {maintenanceMode 
                                    ? 'Visitors will see a maintenance message.'
                                    : 'Site is currently live and accessible to visitors.'}
                            </p>
                            {maintenanceMode && (
                                <div className="p-3 bg-gray-800 rounded-md">
                                    <p className="text-yellow-400 text-sm">
                                        Note: Don't forget to turn off maintenance mode when you're done!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Command Output */}
                <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-300 mb-2">Command Output</h4>
                    <CodeSnippet code={output} language="bash" />
                </div>
            </div>
        </div>
    );
}
