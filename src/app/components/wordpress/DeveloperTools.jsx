'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function DeveloperTools() {
    const [activeTab, setActiveTab] = useState('theme');
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('list');
    const [transients, setTransients] = useState([]);
    const [selectedTransient, setSelectedTransient] = useState('list');
    const [rewriteRules, setRewriteRules] = useState('');
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('list');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [translationAction, setTranslationAction] = useState('list');
    const [language, setLanguage] = useState('');

    const [useJsonFormatTheme, setUseJsonFormatTheme] = useState(true);
    const [useJsonFormatTranslations, setUseJsonFormatTranslations] = useState(true);
    const [useDryRun, setUseDryRun] = useState(false);

    // Update command when selection changes
    useEffect(() => {
        let command = '';
        
        if (activeTab === 'theme') {
            if (selectedTheme === 'list') {
                command = `wp theme list${useJsonFormatTheme ? ' --format=json' : ''}`;
            } else if (selectedTheme === 'update') {
                command = 'wp theme update --all';
            } else if (selectedTheme === 'status') {
                command = 'wp theme status';
            }
        } else if (activeTab === 'transient') {
            if (selectedTransient === 'list') {
                command = 'wp transient list';
            } else if (selectedTransient === 'delete-expired') {
                command = 'wp transient delete --expired';
            } else if (selectedTransient === 'delete-all') {
                command = 'wp transient delete --all';
            } else {
                command = 'wp transient list';
            }
        } else if (activeTab === 'rewrite') {
            command = 'wp rewrite list';
        } else if (activeTab === 'multisite') {
            if (selectedSite === 'list') {
                command = 'wp site list';
            } else if (selectedSite === 'create') {
                command = 'wp site create --slug=newsite --title="New Site"';
            } else if (selectedSite === 'status') {
                command = 'wp site status';
            }
        } else if (activeTab === 'maintenance') {
            command = 'wp maintenance-mode status';
        } else if (activeTab === 'translations') {
            command = 'wp language core list';
            if (useJsonFormatTranslations) command += ' --format=json';
            if (useDryRun) command += ' --dry-run';
        }
        
        setOutput(command);
    }, [activeTab, selectedTheme, selectedTransient, selectedSite, maintenanceMode, translationAction, language, useJsonFormatTheme, useJsonFormatTranslations, useDryRun]);

    const toggleMaintenanceMode = () => {
        const newMode = !maintenanceMode;
        setMaintenanceMode(newMode);
        const command = newMode ? 'wp maintenance-mode activate' : 'wp maintenance-mode deactivate';
        setOutput(command);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <h3 id="wp-dev-tools"  className="text-xl font-semibold text-blue-400 mb-4">
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
            <div className="0 p-4 rounded-b-lg rounded-tr-lg">
                {/* Theme Management */}
                {activeTab === 'theme' && (
                    <div className="space-y-4">
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
                                    <option value="list">List All Themes</option>
                                    <option value="update">Update All Themes</option>
                                    <option value="status">Show Active Theme</option>
                                </select>
                            </div>
                            {selectedTheme === 'list' && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="jsonFormatTheme"
                                        checked={useJsonFormatTheme}
                                        onChange={(e) => setUseJsonFormatTheme(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                                    />
                                    <label htmlFor="jsonFormatTheme" className="ml-2 text-sm text-gray-300">
                                        Use JSON Format
                                    </label>
                                </div>
                            )}
                        </div>
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
                                <option value="list">List All Transients</option>
                                <option value="delete-expired">Delete Expired Transients</option>
                                <option value="delete-all">Delete All Transients</option>
                            </select>
                        </div>
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
                                onClick={() => setOutput('wp rewrite list')}
                                className={`px-4 py-2 rounded-md ${
                                    output === 'wp rewrite list'
                                        ? 'bg-blue-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                List Rewrite Rules
                            </button>
                            <button
                                onClick={() => setOutput('wp rewrite flush')}
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
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Multisite Actions
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                    value={selectedSite}
                                    onChange={(e) => setSelectedSite(e.target.value)}
                                >
                                    <option value="list">List All Sites</option>
                                    <option value="create">Create New Site</option>
                                    <option value="status">Show Network Info</option>
                                </select>
                            </div>
                            {selectedSite === 'create' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Site Slug
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="newsite"
                                            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                            onChange={(e) => setOutput(`wp site create --slug=${e.target.value || 'newsite'} --title="${e.target.value ? e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) : 'New Site'}"`)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Core Translations */}
                {activeTab === 'translations' && (
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 focus:ring-blue-500"
                                        name="translationAction"
                                        value="list"
                                        checked={translationAction === 'list'}
                                        onChange={(e) => setTranslationAction(e.target.value)}
                                    />
                                    <span className="ml-2 text-sm text-gray-300">List Translations</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 focus:ring-blue-500"
                                        name="translationAction"
                                        value="update"
                                        checked={translationAction === 'update'}
                                        onChange={(e) => setTranslationAction(e.target.value)}
                                    />
                                    <span className="ml-2 text-sm text-gray-300">Update Translations</span>
                                </label>
                            </div>

                            {translationAction === 'update' && (
                                <div className="mb-4 space-y-4">
                                    <div>
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

                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={useDryRun}
                                                onChange={(e) => setUseDryRun(e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-300">Dry Run (--dry-run)</span>
                                        </label>
                                        {useDryRun && (
                                            <p className="text-yellow-400 text-sm p-2 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-md">
                                                <span className="font-semibold">Note:</span> The command includes the <code className="bg-gray-800 px-1 py-0.5 rounded">--dry-run</code> flag. Uncheck to perform the actual update.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="jsonFormatTranslations"
                                    checked={useJsonFormatTranslations}
                                    onChange={(e) => setUseJsonFormatTranslations(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 focus:ring-blue-500"
                                />
                                <label htmlFor="jsonFormatTranslations" className="text-sm text-gray-300">
                                    Use JSON Format
                                </label>
                            </div>
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
