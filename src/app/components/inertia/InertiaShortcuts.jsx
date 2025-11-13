    'use client';

import { useState } from 'react';
import PhpSnippet from '../PhpSnippet';

const InertiaShortcuts = () => {
    const [activeTab, setActiveTab] = useState('refresh');
    const [selectedRefresh, setSelectedRefresh] = useState('current');
    const [selectedNav, setSelectedNav] = useState('visit');
    const [customOptions, setCustomOptions] = useState({
        preserveScroll: true,
        preserveState: false,
        only: [],
        except: [],
        data: '{}',
        method: 'get'
    });

    const tabs = [
        {
            id: 'refresh',
            name: 'Refresh',
            description: 'Common page and resource refresh patterns',
            refreshOptions: [
                {
                    id: 'current',
                    name: 'Refresh Current Page',
                    code: `this.$inertia.reload({
    preserveScroll: true,
    preserveState: false
})`,
                    description: 'Refreshes the current page with default options'
                },
                {
                    id: 'index',
                    name: 'Refresh Resource Index',
                    code: `this.$inertia.reload({
    preserveScroll: true,
    only: ['resources']
})
Nova.$emit('refresh-resources')`,
                    description: 'Refreshes only the resource index without reloading the entire page'
                },
                {
                    id: 'fields',
                    name: 'Refresh Resource Fields',
                    code: `this.$inertia.reload({
    preserveScroll: true,
    only: ['resource']
})
Nova.$emit('refresh-resource-fields')`,
                    description: 'Refreshes resource fields without reloading the entire page'
                },
                {
                    id: 'full',
                    name: 'Full Refresh',
                    code: `this.$inertia.reload({
    preserveScroll: false,
    preserveState: false
})`,
                    description: 'Forces a full page reload, discarding any state'
                }
            ]
        },
        {
            id: 'navigation',
            name: 'Navigation',
            description: 'Common navigation patterns',
            navOptions: [
                {
                    id: 'visit',
                    name: 'Visit URL',
                    code: `this.$inertia.visit(url, {
    method: 'get',
    preserveScroll: true,
    preserveState: false,
    replace: false
})`,
                    description: 'Navigate to a URL with Inertia'
                },
                {
                    id: 'back',
                    name: 'Back Navigation',
                    code: 'window.history.back()',
                    description: 'Go back to the previous page'
                }
            ]
        },
        {
            id: 'custom',
            name: 'Custom',
            description: 'Create custom Inertia requests',
            fields: [
                {
                    name: 'method',
                    label: 'HTTP Method',
                    type: 'select',
                    options: [
                        { value: 'get', label: 'GET' },
                        { value: 'post', label: 'POST' },
                        { value: 'put', label: 'PUT' },
                        { value: 'patch', label: 'PATCH' },
                        { value: 'delete', label: 'DELETE' }
                    ]
                },
              {
                    name: 'only',
                    label: 'Only (comma-separated)',
                    placeholder: 'e.g., resources,resource',
                    help: 'Only reload specific data'
                },
            
            
                {
                    name: 'except',
                    label: 'Except (comma-separated)',
                    placeholder: 'e.g., resources,resource',
                    help: 'Exclude specific data from reload'
                },
                {
                    name: 'data',
                    label: 'Request Data (JSON)',
                    type: 'textarea',
                    placeholder: '{"key": "value"}',
                    help: 'Data to send with the request'
                },
                
                {
                    name: 'preserveState',
                    label: 'Preserve State',
                    type: 'checkbox',
                    default: false
                },
                {
                    name: 'preserveScroll',
                    label: 'Preserve Scroll',
                    type: 'checkbox',
                    default: true
                },
              
            ]
        }
    ];

    const updateCustomOption = (field, value) => {
        setCustomOptions(prev => ({
            ...prev,
            [field]: field === 'data' ? value : value === 'true' ? true : value === 'false' ? false : value
        }));
    };

    const generateCustomCode = () => {
        const options = { ...customOptions };
        
        // Process only/except arrays
        if (options.only && typeof options.only === 'string') {
            options.only = `[${options.only.split(',').map(s => `'${s.trim()}'`).join(', ')}]`;
        } else {
            delete options.only; // Remove if not a string or empty
        }
        
        if (options.except && typeof options.except === 'string') {
            options.except = `[${options.except.split(',').map(s => `'${s.trim()}'`).join(', ')}]`;
        } else {
            delete options.except; // Remove if not a string or empty
        }

        const optionsString = Object.entries(options)
            .filter(([_, v]) => v !== '' && v !== undefined && v !== null)
            .map(([k, v]) => `    ${k}: ${typeof v === 'string' && !['true', 'false'].includes(v) && !v.startsWith('[') ? `'${v}'` : v}`)
            .join(',\n');

        return `this.$inertia.${options.method === 'get' ? 'reload' : 'visit'}(${options.method !== 'get' ? 'url, ' : ''}{
${optionsString}
})`;
    };

    const renderField = (field) => {
        const value = customOptions[field.name];
        
        if (field.type === 'select') {
            return (
                <select
                className="mt-1 flex-1 p-2 bg-gray-700 text-white block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={value}
                    onChange={(e) => updateCustomOption(field.name, e.target.value)}
                >
                    {field.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (field.type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    checked={!!value}
                    onChange={(e) => updateCustomOption(field.name, e.target.checked)}
                />
            );
        }

        if (field.type === 'textarea') {
            return (
                <textarea
                className="mt-1 flex-1 p-2 bg-gray-700 text-white block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={value}
                    onChange={(e) => updateCustomOption(field.name, e.target.value)}
                    rows={3}
                    placeholder={field.placeholder}
                />
            );
        }

        return (
            <input
                type="text"
                className="mt-1 flex-1 p-2 bg-gray-700 text-white block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={value || ''}
                onChange={(e) => updateCustomOption(field.name, e.target.value)}
                placeholder={field.placeholder}
            />
        );
    };

    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold !text-blue-400 mb-4">
                    Inertia Shortcuts
                </h3>
                <div className="hidden sm:block">
                 
                        <nav className=" flex gap-3 text-lg tab-bg py-2 rounded-xl overflow-x-auto px-3">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${activeTab === tab.id
                                        ? '!bg-blue-600 !text-white'
                                        : 'border-transparent text-gray-500 hover hover:text-gray-700'
                                        } whitespace-nowrap p-1.5 rounded-sm font-medium`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>

                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {activeTabData.name}
                    </h3>
                    <p className="mt-1 text-sm description">
                        {activeTabData.description}
                    </p>
                </div>

                {activeTab === 'custom' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {activeTabData.fields.map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <div className="mt-1">
                                        {renderField(field)}
                                        {field.help && (
                                            <p className="mt-1 text-xs description">
                                                {field.help}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <PhpSnippet code={generateCustomCode()} language="javascript" />
                        </div>
                    </div>
                )}

                {activeTab === 'refresh' && (
                    <div className="space-y-4">
                        <div className=" tab-bg px-2 py-1.5 overflow-x-auto rounded-xl">
                            <nav className="flex gap-3">
                                {activeTabData.refreshOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setSelectedRefresh(option.id)}
                                        className={`whitespace-nowrap py-1 px-1.5 rounded-sm font-medium text-sm ${
                                            selectedRefresh === option.id
                                                ? '!bg-blue-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover'
                                        }`}
                                    >
                                        {option.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className=" rounded-md p-4">
                    
                            <p className="text-sm description mb-3">
                                {activeTabData.refreshOptions.find(o => o.id === selectedRefresh)?.description}
                            </p>
                            <PhpSnippet 
                                code={activeTabData.refreshOptions.find(o => o.id === selectedRefresh)?.code || ''} 
                                language="javascript" 
                            />
                        </div>
                    </div>
                )}
                {activeTab === 'navigation' && (
                    <div className="space-y-4">
                            <nav className="flex gap-2 tab-bg rounded-xl py-1.5 px-2 overflow-x-auto">
                                {activeTabData.navOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedNav(option.id)}
                                        className={`whitespace-nowrap py-1 px-1.5 rounded-sm font-medium text-sm ${
                                            selectedNav === option.id
                                                ? '!bg-blue-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover'
                                        }`}
                                    >
                                        {option.name}
                                    </button>
                                ))}
                            </nav>
        
                        <div className=" rounded-md">
                      
                            <p className="text-sm description mb-3">
                                {activeTabData.navOptions.find(o => o.id === selectedNav)?.description}
                            </p>
                            <PhpSnippet 
                                code={activeTabData.navOptions.find(o => o.id === selectedNav)?.code || ''} 
                                language="javascript" 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InertiaShortcuts;
