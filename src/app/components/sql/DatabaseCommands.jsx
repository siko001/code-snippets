'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

const DatabaseCommands = () => {
    const [dbName, setDbName] = useState('my_database');
    const [action, setAction] = useState('show'); // 'show', 'create', 'drop', 'use'

    const getCommand = () => {
        switch(action) {
            case 'show':
                return 'SHOW DATABASES;';
            case 'create':
                return `CREATE DATABASE ${dbName};`;
            case 'create_if_not_exists':
                return `CREATE DATABASE IF NOT EXISTS ${dbName};`;
            case 'drop':
                return `DROP DATABASE ${dbName};`;
            case 'use':
                return `USE ${dbName};`;
            default:
                return 'SHOW DATABASES;';
        }
    };

    const getDescription = () => {
        switch(action) {
            case 'show':
                return 'List all databases';
            case 'create':
                return 'Create a new database';
            case 'create_if_not_exists':
                return 'Create database if it doesn\'t exist';
            case 'drop':
                return '⚠️ Delete a database (irreversible!)';
            case 'use':
                return 'Select a database to work with';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Action</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    >
                        <option value="show">Show Databases</option>
                        <option value="create">Create Database</option>
                        <option value="create_if_not_exists">Create If Not Exists</option>
                        <option value="drop">Drop Database</option>
                        <option value="use">Use Database</option>
                    </select>
                </div>
                
                {action !== 'show' && (
                    <div>
                        <label className="block text-gray-300 text-sm mb-1">
                            {action === 'drop' ? '⚠️ Database to delete' : 'Database Name'}
                        </label>
                        <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="database_name"
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <CodeSnippet 
                        code={getCommand()}
                        className="mb-1"
                        copyButton={true}
                    />
                    <p className={`text-xs ${action === 'drop' ? 'text-red-400' : 'text-gray-400'}`}>
                        {getDescription()}
                    </p>
                </div>

                {action === 'drop' && (
                    <div className="p-3 bg-red-900/20 border border-red-800 rounded text-sm">
                        <p className="text-red-300 font-medium mb-1">Warning:</p>
                        <p className="text-xs text-red-300">
                            This will permanently delete the database and all its tables. This action cannot be undone.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatabaseCommands;
