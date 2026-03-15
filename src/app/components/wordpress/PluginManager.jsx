'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function PluginManager() {
    const [formData, setFormData] = useState({
        view: 'list', // 'list', 'single', 'bulk', 'hide-updates'
        pluginAction: 'update', // 'update', 'activate', 'deactivate', 'toggle', 'delete'
        pluginName: '',
        bulkAction: 'none', // 'all-active', 'all-inactive', 'all-update', 'all-delete'
        networkWide: false,
        skipPlugins: [],
        skipPluginsInput: '',
        force: false,
        hideUpdatesPath: '', // Path for hiding update notifications
        hideUpdatesPaths: [], // Multiple paths for hiding update notifications
        hideUpdatesInput: '', // Input for adding multiple paths
        showDebugCode: false, // Toggle for debug code
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
            hideUpdatesPath: '',
            hideUpdatesPaths: [],
            hideUpdatesInput: '',
            showDebugCode: false,
        });
    };

    const commonPlugins = [
        'akismet/akismet.php',
        'wordpress-seo/wp-seo.php',
        'contact-form-7/wp-contact-form-7.php',
        'woocommerce/woocommerce.php',
        'elementor/elementor.php',
        'jetpack/jetpack.php',
        'wpforms-lite/wpforms.php',
        'wordfence/wordfence.php',
        'wp-rocket/wp-rocket.php',
        'advanced-custom-fields-pro/acf.php',
        'metabox-io/meta-box.php',
        'gravityforms/gravityforms.php',
        'js_composer/js_composer.php',
        'js_composer_theme/js_composer.php',
        'wp-bakery-page-builder/js_composer.php',
        'better-wp-security/better-wp-security.php',
        'ithemes-security-pro/ithemes-security-pro.php',
        'classic-editor/classic-editor.php',
        'wp-mail-smtp/wp_mail_smtp.php',
        'litespeed-cache/litespeed-cache.php',
        'autoptimize/autoptimize.php',
        'redirection/redirection.php',
        'duplicate-post/duplicate-post.php',
        'wp-super-cache/wp-cache.php',
        'wp-super-minify/wp-super-minify.php',
        'wp-optimize/wp-optimize.php',
        'wpforms-lite/wpforms.php',
        'wpforms-pro/wpforms.php',
        'all-in-one-seo-pack/all_in_one_seo_pack.php',
        'seo-by-rank-math/rank-math.php',
        'wp-fastest-cache/wpFastestCache.php',
        'wp-file-manager/file_folder_manager.php',
        'wp-super-cache/wp-cache.php',
        'wp-super-minify/wp-super-minify.php',
        'wp-optimize/wp-optimize.php',
        'wpforms-lite/wpforms.php',
        'wpforms-pro/wpforms.php',
    ];

    // Remove duplicates while preserving order
    const uniquePlugins = [...new Set(commonPlugins)];

    const addHideUpdatesPath = (path) => {
        if (path && !formData.hideUpdatesPaths.includes(path)) {
            setFormData(prev => ({
                ...prev,
                hideUpdatesPaths: [...prev.hideUpdatesPaths, path],
                hideUpdatesInput: ''
            }));
        }
    };

    const removeHideUpdatesPath = (path) => {
        setFormData(prev => ({
            ...prev,
            hideUpdatesPaths: prev.hideUpdatesPaths.filter(p => p !== path)
        }));
    };

    const generateHideUpdatesCode = () => {
        // Show debug code if checkbox is checked
        if (formData.showDebugCode) {
            return `<?php

/**
 * Debug: Show all available plugin paths
 * Use this to find the correct path for your plugins
 */
add_action('admin_init', function() {
    if (!current_user_can('manage_options')) return;
    
    $all_plugins = get_plugins();
    echo '<div style="background: #f1f1f1; padding: 10px; margin: 10px; border: 1px solid #ccc;">';
    echo '<h3>Available Plugin Paths:</h3>';
    echo '<pre>';
    foreach ($all_plugins as $plugin_file => $plugin_data) {
        echo $plugin_file . ' - ' . $plugin_data['Name'] . '\\n';
    }
    echo '</pre>';
    echo '</div>';
});`;
        }
        
        const paths = formData.hideUpdatesPaths.length > 0 ? formData.hideUpdatesPaths : 
                     (formData.hideUpdatesPath.trim() ? [formData.hideUpdatesPath] : []);
        
        if (paths.length === 0) {
            return '// Please add plugins or enable debug mode to generate code';
        }
        
        // Generate individual unset statements for each plugin
        const unsetStatements = paths.map(path => 
            `    if ( isset( $updates->response['${path}'] ) ) {\n        unset( $updates->response['${path}'] );\n    }`
        ).join('\n');
        
        return `
function hide_specific_plugin_updates( $updates ) {
    if ( isset( $updates->response ) ) {
${unsetStatements}
    }
    return $updates;
}

add_filter( 'site_transient_update_plugins', 'hide_specific_plugin_updates', 999 );`;
    };

    const generateCommand = () => {
        // Hide updates view
        if (formData.view === 'hide-updates') {
            return generateHideUpdatesCode();
        }
        
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
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, view: 'hide-updates' }))}
                        className={`px-4 py-2 rounded-md ${
                            formData.view === 'hide-updates' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 cursor-pointer text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Hide Updates
                    </button>
                </div>
                {/* Hide Updates */}
                <div className={`space-y-4 ${formData.view !== 'hide-updates' ? 'hidden' : ''}`}>
                    <h4 className="text-lg font-medium description">Hide Update Notifications</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Generate PHP code to hide update notifications for specific plugins. Add this code to your theme's functions.php or a custom plugin.
                    </p>
                    
                    {/* Debug checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="showDebugCode"
                            checked={formData.showDebugCode}
                            onChange={handleChange}
                            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <label className="text-sm description text-gray-300">
                            Show Debug Code (displays all plugin paths)
                        </label>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                        {/* Single plugin input (for backward compatibility) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Single Plugin Path
                            </label>
                            <input
                                type="text"
                                name="hideUpdatesPath"
                                value={formData.hideUpdatesPath}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="plugin-folder/plugin-file.php"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Use this for a single plugin or add multiple plugins below
                            </p>
                        </div>
                        
                        {/* Multiple plugins section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Multiple Plugin Paths
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="hideUpdatesInput"
                                    value={formData.hideUpdatesInput}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && formData.hideUpdatesInput) {
                                            e.preventDefault();
                                            addHideUpdatesPath(formData.hideUpdatesInput);
                                        }
                                    }}
                                    className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                    placeholder="plugin-folder/plugin-file.php"
                                />
                                <button
                                    type="button"
                                    onClick={() => formData.hideUpdatesInput && addHideUpdatesPath(formData.hideUpdatesInput)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    Add
                                </button>
                            </div>
                            
                            {formData.hideUpdatesPaths.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.hideUpdatesPaths.map(path => (
                                        <span 
                                            key={path} 
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100"
                                        >
                                            {path}
                                            <button
                                                type="button"
                                                onClick={() => removeHideUpdatesPath(path)}
                                                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-800 hover:text-blue-200"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Quick selection buttons */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Quick Add Common Plugins:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {uniquePlugins.slice(0, 12).map(plugin => {
                                    return (
                                        <button
                                            key={plugin}
                                            type="button"
                                            onClick={() => addHideUpdatesPath(plugin)}
                                            className="px-3 py-1.5 text-xs bg-gray-700 focus:!text-white focus:!bg-blue-600 dark:!text-gray-300 rounded-md whitespace-nowrap transition-colors"
                                            title={plugin}
                                        >
                                            {plugin.split('/')[0].replace(/-/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase())}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
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
                    <h4 className="text-md font-medium description mb-2">
                        {formData.view === 'hide-updates' ? 'Generated PHP Code:' : 'WP-CLI Command:'}
                    </h4>
                    <CodeSnippet 
                        code={command} 
                        language={formData.view === 'hide-updates' ? 'php' : 'bash'}
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    );
}