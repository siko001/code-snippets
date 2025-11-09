'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function SearchReplace() {
    const [formData, setFormData] = useState({
        search: '',
        replace: '',
        previewMode: true,
        searchMode: 'exact', // 'exact' or 'regex'
        allTables: true,
        network: false,
        skipColumns: '',
        skipColumnsList: ['guid'],
        includeColumns: '',
        includeColumnsList: [],
        showAdvanced: false,
        previewRows: 10,
        regex: false,
        regexFlags: 'i'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleAdvanced = () => {
        setFormData(prev => ({
            ...prev,
            showAdvanced: !prev.showAdvanced
        }));
    };

    const addSkipColumn = () => {
        if (formData.skipColumns && !formData.skipColumnsList.includes(formData.skipColumns)) {
            setFormData(prev => ({
                ...prev,
                skipColumnsList: [...prev.skipColumnsList, formData.skipColumns],
                skipColumns: ''
            }));
        }
    };

    const removeSkipColumn = (column) => {
        setFormData(prev => ({
            ...prev,
            skipColumnsList: prev.skipColumnsList.filter(col => col !== column)
        }));
    };

    const addIncludeColumn = () => {
        if (formData.includeColumns && !formData.includeColumnsList.includes(formData.includeColumns)) {
            setFormData(prev => ({
                ...prev,
                includeColumnsList: [...prev.includeColumnsList, formData.includeColumns],
                includeColumns: ''
            }));
        }
    };

    const removeIncludeColumn = (column) => {
        setFormData(prev => ({
            ...prev,
            includeColumnsList: prev.includeColumnsList.filter(col => col !== column)
        }));
    };

    const generateSnippet = () => {
        const { 
            search, 
            replace, 
            previewMode,
            searchMode,
            allTables, 
            network, 
            skipColumnsList, 
            includeColumnsList,
            previewRows,
            regex,
            regexFlags
        } = formData;

        let command = 'wp search-replace';
        
        // Add search and replace terms with proper escaping
        command += ` '${search.replace(/'/g, "'\\''")}'`;
        command += ` '${replace.replace(/'/g, "'\\''")}'`;
        
        // Add flags
        if (previewMode) {
            command += ' --dry-run --preview';
            if (previewRows > 0) command += ' --precise';
        }
        if (allTables) command += ' --all-tables';
        if (network) command += ' --network';
        
        // Handle search mode
        const useRegex = searchMode === 'regex' || regex;
        if (useRegex) {
            command += ' --regex';
            if (regexFlags) command += ` --regex-flags=${regexFlags}`;
        }
        
        // Add column filters
        if (skipColumnsList.length > 0) {
            command += ` --skip-columns="${skipColumnsList.join(',')}"`;
        }
        
        if (includeColumnsList.length > 0) {
            command += ` --include-columns="${includeColumnsList.join(',')}"`;
        }

        return command;
    };

    const isFormComplete = formData.search.trim() !== '';
    const snippet = generateSnippet();

    return (
        <div className="w-full component-wrapper p-6 rounded-lg mt-6">
            <h3 id="wp-search-replace"  className="text-xl font-semibold !text-blue-400 mb-4">Search & Replace</h3>

            <CodeSnippet
                code={snippet}
                className="mb-4"
                copyButton={isFormComplete}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start text-left">
                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search for</label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        value={formData.search}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="Text or pattern to search for"
                    />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="replace" className="block text-sm font-medium text-gray-300 mb-1">Replace with</label>
                    <input
                        type="text"
                        id="replace"
                        name="replace"
                        value={formData.replace}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="Replacement text"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="previewMode"
                            name="previewMode"
                            checked={formData.previewMode}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                        />
                        <label htmlFor="previewMode" className="ml-2 text-sm text-gray-300">
                            Preview Mode (Safe - No Changes)
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="allTables"
                            name="allTables"
                            checked={formData.allTables}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                        />
                        <label htmlFor="allTables" className="ml-2 text-sm text-gray-300">
                            All Tables
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="network"
                            name="network"
                            checked={formData.network}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                        />
                        <label htmlFor="network" className="ml-2 text-sm text-gray-300">
                            Network (Multisite)
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm description">Search Mode:</span>
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, searchMode: 'exact' }))}
                                    className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                                        formData.searchMode === 'exact' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Exact Match
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, searchMode: 'regex' }))}
                                    className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                                        formData.searchMode === 'regex' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Regex
                                </button>
                            </div>
                        </div>
                        
                        {formData.searchMode === 'regex' && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="regex"
                                    name="regex"
                                    checked={formData.regex}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                                />
                                <label htmlFor="regex" className="ml-2 text-sm text-gray-300">
                                    Enable Regex
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="regex"
                            name="regex"
                            checked={formData.regex}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                        />
                        <label htmlFor="regex" className="ml-2 text-sm text-gray-300">
                            Use Regex
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="button"
                        onClick={toggleAdvanced}
                        className="text-sm focus:!outline-0 focus:!border-0 focus:!ring-0 !shadow-none !bg-transparent text-blue-400 hover:text-blue-300 flex items-center"
                    >
                        {formData.showAdvanced ? '▼' : '▶'} Advanced Options
                    </button>
                    
                    {formData.showAdvanced && (
                        <div className="mt-2 p-3 dark:bg-gray-700 bg-gray-50 rounded-md space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="previewRows" className="block text-sm font-medium text-gray-300 mb-1">
                                        Preview Rows (0 = all)
                                    </label>
                                    <input
                                        type="number"
                                        id="previewRows"
                                        name="previewRows"
                                        min="0"
                                        value={formData.previewRows}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                                    />
                                </div>

                                {formData.regex && (
                                    <div>
                                        <label htmlFor="regexFlags" className="block text-sm font-medium text-gray-300 mb-1">
                                            Regex Flags
                                        </label>
                                        <input
                                            type="text"
                                            id="regexFlags"
                                            name="regexFlags"
                                            value={formData.regexFlags}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                                            placeholder="e.g., i for case-insensitive"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Skip Columns</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={formData.skipColumns}
                                        onChange={(e) => setFormData(prev => ({ ...prev, skipColumns: e.target.value }))}
                                        className="flex-1 p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                                        placeholder="e.g., guid, user_pass"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkipColumn}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skipColumnsList.map(column => (
                                        <span key={column} className="inline-flex items-center items-center dark:bg-gray-600 bg-gray-50 dark:text-white text-gray-600 px-2 py-1 rounded text-sm">
                                            {column}
                                            <button 
                                                type="button" 
                                                onClick={() => removeSkipColumn(column)}
                                                className="ml-1 text-gray-300 !bg-red-500 grid place-items-center rounded-full h-4 w-4 hover:!text-white"
                                            >
                                               <span className="text-xs text-white relative -left-[0.5px] -top-[0.5px]"> × </span>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Include Only Columns</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={formData.includeColumns}
                                        onChange={(e) => setFormData(prev => ({ ...prev, includeColumns: e.target.value }))}
                                        className="flex-1 p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                                        placeholder="e.g., post_content, post_title"
                                    />
                                    <button
                                        type="button"
                                        onClick={addIncludeColumn}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.includeColumnsList.map(column => (
                                        <span key={column} className="inline-flex items-center bg-gray-600 text-white px-2 py-1 rounded text-sm">
                                            {column}
                                            <button 
                                                type="button" 
                                                onClick={() => removeIncludeColumn(column)}
                                                className="ml-1 text-gray-300 hover:text-white"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 p-3 font-quicksand dark:bg-gray-700 bg-gray-100 rounded-md">
                <h4 className="text-sm font-medium description mb-2">Usage Tips:</h4>
                <ul className="text-xs dark:text-gray-400 text-gray-700 space-y-1 list-disc pl-5">
                    <li>Always run with <code className="dark:bg-gray-800 bg-gray-300 px-1 rounded">--dry-run</code> first to preview changes</li>
                    <li>For URLs, include the protocol (http:// or https://)</li>
                    <li>The <code className="dark:bg-gray-800  bg-gray-300 px-1 rounded">guid</code> column is skipped by default as it should not be modified in most cases</li>
                    <li>Use regex for complex search patterns (enable the regex option)</li>
                    <li>For large databases, consider using <code className="dark:bg-gray-800  bg-gray-300 px-1 rounded">--preview</code> with a row limit</li>
                </ul>
            </div>
        </div>
    );
}
