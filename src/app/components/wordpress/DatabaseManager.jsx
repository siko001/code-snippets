'use client';

import { useState, useRef, useCallback } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function DatabaseManager() {
    const [activeTab, setActiveTab] = useState('export');
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Export options
        filename: `db-${new Date().toISOString().split('T')[0]}.sql`,
        gzip: false,
        excludeTables: [],
        
        // Import options
        importFile: null,
        backupBeforeImport: true,
        dropTables: false,
        
        // Common options
        host: 'localhost',
        user: 'root',
        password: '',
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (type === 'file' && files && files[0]) {
            setFormData(prev => ({
                ...prev,
                importFile: files[0]
            }));
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData(prev => ({
                ...prev,
                importFile: e.dataTransfer.files[0]
            }));
        }
    }, []);

    const preventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const generateExportCommand = () => {
        let cmd = 'wp db export';
        
        // Add filename
        let filename = formData.filename.endsWith('.sql') 
            ? formData.filename 
            : `${formData.filename}.sql`;
            
        if (formData.gzip) {
            filename += '.gz';
            cmd += ' --add-drop-table --single-transaction --quick';
        }
        
        cmd += ` ${filename}`;
        
        // Add excluded tables if any
        if (formData.excludeTables.length > 0) {
            cmd += ` --tables=$(wp db tables --all-tables-with-prefix | grep -v "${formData.excludeTables.join('\\|')}" | tr '\\n' ' ')`;
        }
        
        return cmd;
    };

    const generateImportCommand = () => {
        if (!formData.importFile) return '';
        
        let cmd = '';
        
        // Create backup if requested
        if (formData.backupBeforeImport) {
            const backupFile = `db-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
            cmd += `wp db export ${backupFile} && echo "Backup created: ${backupFile}" && `;
        }
        
        // Drop tables if requested
        if (formData.dropTables) {
            cmd += 'wp db reset --yes && ';
        }
        
        // Add import command
        cmd += `wp db import ${formData.importFile.name}`;
        
        return cmd;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let generatedCommand = '';
        
        if (activeTab === 'export') {
            generatedCommand = generateExportCommand();
        } else if (activeTab === 'import' && formData.importFile) {
            generatedCommand = generateImportCommand();
        }
        
        setCommand(generatedCommand);
        
        // Clear any previous output
        setOutput('');
    };

    const commonTablesToExclude = [
        'commentmeta', 'comments', 'links', 'options', 'postmeta', 
        'posts', 'termmeta', 'terms', 'term_relationships', 'term_taxonomy',
        'usermeta', 'users', 'wc_download_log', 'wc_webhooks',
        'woocommerce_sessions', 'woocommerce_api_keys', 'woocommerce_attribute_taxonomies',
        'woocommerce_downloadable_product_permissions', 'woocommerce_order_itemmeta',
        'woocommerce_order_items', 'woocommerce_payment_tokenmeta', 'woocommerce_payment_tokens',
        'woocommerce_tax_rates', 'woocommerce_tax_rate_locations', 'woocommerce_shipping_zones',
        'woocommerce_shipping_zone_locations', 'woocommerce_shipping_zone_methods',
        'woocommerce_tax_rate_shipping', 'woocommerce_tax_rates', 'actionscheduler_actions',
        'actionscheduler_claims', 'actionscheduler_groups', 'actionscheduler_logs',
        'rank_math_analytics_gsc', 'rank_math_analytics_objects', 'rank_math_internal_links',
        'rank_math_internal_meta', 'rank_math_redirections', 'rank_math_redirections_cache',
        'slim_events', 'slim_events_archive', 'slim_stats', 'slim_stats_archive',
        'wpforms_tasks_meta', 'wfblockediplog', 'wfblocks7', 'wfcrawlers', 'wffilechanges',
        'wffilemods', 'wfhits', 'wfhoover', 'wfissues', 'wfknownfilelist', 'wflivetraffichuman',
        'wflocs', 'wflogins', 'wfls_2fa_secrets', 'wfls_settings', 'wfnotifications', 'wfpendingissues',
        'wfreversecache', 'wfSNIPCache', 'wfstatus', 'wfthrottlelog', 'wfvulnscanners', 'wfwebhooks'    ];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <h3 id="wp-database-manager"  className="text-xl font-semibold text-blue-400 mb-4">Database Manager</h3>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('export')}
                    className={`py-2 px-4 font-medium ${activeTab === 'export' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                >
                    Export Database
                </button>
                <button
                    onClick={() => setActiveTab('import')}
                    className={`py-2 px-4 font-medium ${activeTab === 'import' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                >
                    Import Database
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'export' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Output Filename
                            </label>
                            <input
                                type="text"
                                name="filename"
                                value={formData.filename}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="database-export.sql"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="gzip"
                                name="gzip"
                                checked={formData.gzip}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                            />
                            <label htmlFor="gzip" className="ml-2 text-sm text-gray-300">
                                Compress with GZIP
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Exclude Tables (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="excludeTablesInput"
                                value={formData.excludeTables.join(', ')}
                                onChange={(e) => {
                                    const tables = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                                    setFormData(prev => ({ ...prev, excludeTables: tables }));
                                }}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="wp_options, wp_usermeta"
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {commonTablesToExclude.slice(0, 5).map(table => (
                                    <button
                                        key={table}
                                        type="button"
                                        onClick={() => {
                                            if (!formData.excludeTables.includes(table)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    excludeTables: [...prev.excludeTables, table]
                                                }));
                                            }
                                        }}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
                                    >
                                        {table}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'import' && (
                    <div className="space-y-4">
                        <div 
                            onDrop={handleDrop}
                            onDragOver={preventDefault}
                            onDragEnter={preventDefault}
                            onDragLeave={preventDefault}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleChange}
                                accept=".sql,.sql.gz"
                                className="hidden"
                            />
                            {formData.importFile ? (
                                <div className="text-green-400">
                                    <p>Selected file: {formData.importFile.name}</p>
                                    <p className="text-xs text-gray-400 mt-2">Click to change file</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-300">Drag & drop your SQL file here</p>
                                    <p className="text-sm text-gray-500 mt-2">or click to browse files</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="backupBeforeImport"
                                    name="backupBeforeImport"
                                    checked={formData.backupBeforeImport}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                                />
                                <label htmlFor="backupBeforeImport" className="ml-2 text-sm text-gray-300">
                                    Create backup before import
                                </label>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="dropTables"
                                        name="dropTables"
                                        checked={formData.dropTables}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-red-600 rounded border-red-500 focus:ring-red-500"
                                    />
                                </div>
                                <div className="ml-3">
                                    <label htmlFor="dropTables" className="text-sm font-medium text-red-500">
                                        Drop all tables before import
                                    </label>
                                    <p className="text-xs text-red-400 mt-1">
                                        ⚠️ DANGEROUS: This will permanently delete all existing database tables!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        disabled={isLoading || (activeTab === 'import' && !formData.importFile)}
                    >
                        {isLoading ? 'Processing...' : activeTab === 'export' ? 'Generate Export Command' : 'Generate Import Command'}
                    </button>
                </div>
            </form>

            {command && (
                <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-300 mb-2">
                        {activeTab === 'export' ? 'Export' : 'Import'} Command:
                    </h4>
                    <CodeSnippet code={command} language="bash" />
                    
                    {output && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-md">
                            <h4 className="text-md font-medium text-gray-300 mb-2">Output:</h4>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap">{output}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
