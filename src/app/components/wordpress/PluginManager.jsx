'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function PluginManager() {
    const [formData, setFormData] = useState({
        view: 'list', // 'list', 'single', 'bulk'
        pluginAction: 'update', // 'update', 'activate', 'deactivate', 'toggle', 'delete'
        pluginName: '',
        bulkAction: 'none', // 'all-active', 'all-inactive', 'all-update', 'all-delete'
        networkWide: false,
        skipPlugins: [],
        skipPluginsInput: '',
        force: false,
    });

    const resetForm = () => {
        setFormData({
            view: 'list',
            pluginAction: 'activate',
            pluginName: '',
            bulkAction: 'none',
            networkWide: false,
            skipPlugins: [],
            skipPluginsInput: '',
            force: false,
        });
    };

    const commonPlugins = [
        'akismet/akismet',
        'wordpress-seo/wp-seo',
        'contact-form-7/wp-contact-form-7',
        'woocommerce/woocommerce',
        'elementor/elementor',
        'jetpack/jetpack',
        'wpforms-lite/wpforms',
        'wordfence/wordfence',
        'wp-rocket/wp-rocket',
        'advanced-custom-fields-pro/acf',
        'metabox-io/meta-box',
        'gravityforms/gravityforms',
        'js_composer/js_composer',
        'js_composer_theme/js_composer',
        'wp-bakery-page-builder/js_composer',
        'better-wp-security/better-wp-security',
        'ithemes-security-pro/ithemes-security-pro',
        'classic-editor/classic-editor',
        'wp-mail-smtp/wp_mail_smtp',
        'litespeed-cache/litespeed-cache',
        'autoptimize/autoptimize',
        'redirection/redirection',
        'duplicate-post/duplicate-post',
        'wp-super-cache/wp-cache',
        'wp-super-minify/wp-super-minify',
        'wp-optimize/wp-optimize',
        'wpforms-lite/wpforms',
        'wpforms-pro/wpforms',
        'all-in-one-seo-pack/all_in_one_seo_pack',
        'seo-by-rank-math/rank-math',
        'wp-fastest-cache/wpFastestCache',
        'wp-file-manager/file_folder_manager',
        'wp-super-cache/wp-cache',
        'wp-super-minify/wp-super-minify',
        'wp-optimize/wp-optimize',
        'wpforms-lite/wpforms',
        'wpforms-pro/wpforms',
    ];

    // Remove duplicates while preserving order
    const uniquePlugins = [...new Set(commonPlugins)];

    const generateCommand = () => {
        let cmd = 'wp plugin';
        
        // Default list view
        if (formData.view === 'list') {
            return 'wp plugin list';
        }
        
        // Single plugin action
        if (formData.pluginName) {
            if (formData.pluginAction === 'toggle') {
                cmd += ' is-active ' + formData.pluginName + ' && wp plugin ';
                cmd += '$(wp plugin is-active ' + formData.pluginName + ' && echo "deactivate" || echo "activate") ' + formData.pluginName;
            } else {
                cmd += ` ${formData.pluginAction} ${formData.pluginName}`;
            }
        } 
        // Bulk actions
        else if (formData.bulkAction !== 'none') {
            switch(formData.bulkAction) {
                case 'all-active':
                    cmd += ' activate --all';
                    break;
                case 'all-inactive':
                    cmd += ' deactivate --all';
                    break;
                case 'all-update':
                    return 'wp plugin update --all';
                case 'all-delete':
                    return 'wp plugin delete --all';
            }
        }

        // Add flags
        if (formData.networkWide) cmd += ' --network';
        if (formData.force) cmd += ' --force';
        if (formData.skipPlugins.length > 0) {
            cmd += ` --skip-plugins=${formData.skipPlugins.join(',')}`;
        }

        return cmd;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addSkipPlugin = (plugin) => {
        if (plugin && !formData.skipPlugins.includes(plugin)) {
            setFormData(prev => ({
                ...prev,
                skipPlugins: [...prev.skipPlugins, plugin],
                skipPluginsInput: ''
            }));
        }
    };

    const removeSkipPlugin = (plugin) => {
        setFormData(prev => ({
            ...prev,
            skipPlugins: prev.skipPlugins.filter(p => p !== plugin)
        }));
    };

    const command = generateCommand();

    return (
        <div className="component-wrapper p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 id="wp-plugin-manager"  className="text-xl font-semibold !text-blue-400 mb-4">Plugin Manager</h3>
                <button
                    onClick={resetForm}
                    className="px-3 py-1 cursor-pointer text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md"
                >
                    Reset to List
                </button>
            </div>
            
            <div className="space-y-6">
                {/* View Toggle */}
                <div className="flex space-x-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, view: 'list' }))}
                        className={`px-4 py-2 rounded-md ${
                            formData.view === 'list' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        List Plugins
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, view: 'single' }))}
                        className={`px-4 py-2 rounded-md ${
                            formData.view === 'single' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Single Plugin
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, view: 'bulk' }))}
                        className={`px-4 py-2 rounded-md ${
                            formData.view === 'bulk' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Bulk Actions
                    </button>
                </div>
                {/* Single Plugin Actions */}
                <div className={`space-y-4 ${formData.view !== 'single' ? 'hidden' : ''}`}>
                    <h4 className="text-lg font-medium description">Single Plugin</h4>
                    
                    <div className="flex flex-col ">
                          <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Plugin Name
                            </label>
                            <div className="flex gap-2 overflow-hidden">
                                    <input
                                        type="text"
                                        name="pluginName"
                                        value={formData.pluginName}
                                        onChange={handleChange}
                                        className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                        placeholder="plugin-folder/plugin-file.php"
                                    />
                                    <select
                                        name="pluginAction"
                                        value={formData.pluginAction}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-600 rounded-md cursor-pointer bg-gray-700 text-white"
                                    >
                                        <option value="update">Update</option>
                                        <option value="activate">Activate</option>
                                        <option value="deactivate">Deactivate</option>
                                        <option value="toggle">Toggle</option>
                                        <option value="delete">Delete</option>
                                    </select>
                            </div>
                          </div>
                       <div className="flex-1  overflow-scroll">    
                                <div className="mt-2 w-full ">
                                    <div className="relative w-full">
                                        <div className="flex overflow-x-auto tab-bg p-1.5 gap-1  rounded py-2 ">
                                            <div className="flex gap-2 ">
                                                {uniquePlugins.map(plugin => {
                                                    // Extract the main plugin name for display
                                                    const displayName = plugin.split('/')[0].replace(/-/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase());
                                                    return (
                                                        <button
                                                            key={plugin}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                pluginName: plugin,
                                                                view: 'single'
                                                            }))}
                                                            className="px-3 py-1.5 text-xs bg-gray-700 focus:!text-white focus:!bg-blue-600 dark:!text-gray-300 rounded-md whitespace-nowrap transition-colors"
                                                            title={plugin}
                                                        >
                                                            {displayName}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                             
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className={`space-y-4 ${formData.view !== 'bulk' ? 'hidden' : ''}`}>
                    <h4 className="text-lg font-medium font-saira text-gray-300">Bulk Actions</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                pluginName: '',
                                bulkAction: 'all-active'
                            }))}
                            className={`p-3 rounded-md text-left ${
                                formData.bulkAction === 'all-active' 
                                    ? '!bg-blue-600 !text-white' 
                                    : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <div className="font-medium">Activate All Plugins</div>
                            <div className="text-xs opacity-75">wp plugin activate --all</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                pluginName: '',
                                bulkAction: 'all-inactive'
                            }))}
                            className={`p-3 rounded-md text-left ${
                                formData.bulkAction === 'all-inactive' 
                                    ? 'dark:!bg-yellow-600 !bg-yellow-500 focus:!ring-yellow-400 focus:ring-yellow-600 !text-white' 
                                    : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <div className="font-medium">Deactivate All Plugins</div>
                            <div className="text-xs opacity-75">wp plugin deactivate --all</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                pluginName: '',
                                bulkAction: 'all-update'
                            }))}
                            className={`p-3 rounded-md text-left ${
                                formData.bulkAction === 'all-update' 
                                    ? 'dark:!bg-green-600 !bg-green-500 focus:!ring-green-400 focus:ring-green-600 !text-white' 
                                    : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <div className="font-medium">Update All Plugins</div>
                            <div className="text-xs opacity-75">wp plugin update --all</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                pluginName: '',
                                bulkAction: 'all-delete'
                            }))}
                            className={`p-3 rounded-md text-left ${
                                formData.bulkAction === 'all-delete' 
                                    ? '!bg-red-600 focus:!ring-red-400 focus:ring-red-600 !text-white' 
                                    : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <div className="font-medium">Delete All Plugins</div>
                            <div className="text-xs opacity-75">wp plugin delete --all</div>
                            <div className="text-xs text-red-300 mt-1">⚠️ This will delete all plugin files</div>
                        </button>
                    </div>
                </div>

                {/* Options - Only show when in bulk actions view */}
                {formData.view === 'bulk' && (
                    <div className="space-y-4 mt-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="networkWide"
                                        checked={formData.networkWide}
                                        onChange={handleChange}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm description">Network Wide (Multisite)</span>
                                </label>
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="force"
                                        checked={formData.force}
                                        onChange={handleChange}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm description">Force</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Skip Plugins (comma separated)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="skipPluginsInput"
                                    value={formData.skipPluginsInput}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && formData.skipPluginsInput) {
                                            e.preventDefault();
                                            addSkipPlugin(formData.skipPluginsInput);
                                        }
                                    }}
                                    className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 "
                                    placeholder="plugin-folder/plugin-file.php"
                                />
                                <button
                                    type="button"
                                    onClick={() => formData.skipPluginsInput && addSkipPlugin(formData.skipPluginsInput)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    Add
                                </button>
                            </div>
                            {formData.skipPlugins.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.skipPlugins.map(plugin => (
                                        <span 
                                            key={plugin} 
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100"
                                        >
                                            {plugin}
                                            <button
                                                type="button"
                                                onClick={() => removeSkipPlugin(plugin)}
                                                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-800 hover:text-blue-200"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Generated Command */}
                <div className="mt-6">
                    <h4 className="text-md font-medium description mb-2">WP-CLI Command:</h4>
                    <CodeSnippet 
                        code={command} 
                        language="bash"
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    );
}