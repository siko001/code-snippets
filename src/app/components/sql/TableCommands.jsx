'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

const TableCommands = () => {
    const [tableName, setTableName] = useState('users');
    const [action, setAction] = useState('show'); // 'show', 'create', 'drop', 'describe'
    const [columns, setColumns] = useState([
        { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'email', type: 'VARCHAR(100)' }
    ]);

    const getCommand = () => {
        switch(action) {
            case 'show':
                return 'SHOW TABLES;';
            case 'describe':
                return `DESCRIBE ${tableName};`;
            case 'create':
                const columnDefs = columns.map(col => `  ${col.name} ${col.type}`).join(',\n');
                return `CREATE TABLE ${tableName} (\n${columnDefs}\n);`;
            case 'drop':
                return `DROP TABLE ${tableName};`;
            case 'truncate':
                return `TRUNCATE TABLE ${tableName};`;
            default:
                return 'SHOW TABLES;';
        }
    };

    const getDescription = () => {
        switch(action) {
            case 'show':
                return 'List all tables in the current database';
            case 'describe':
                return 'Show table structure';
            case 'create':
                return 'Create a new table';
            case 'drop':
                return '⚠️ Delete a table and all its data';
            case 'truncate':
                return '⚠️ Remove all records from a table';
            default:
                return '';
        }
    };

    const addColumn = () => {
        setColumns([...columns, { name: 'new_column', type: 'VARCHAR(100)' }]);
    };

    const updateColumn = (index, field, value) => {
        const newColumns = [...columns];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setColumns(newColumns);
    };

    const removeColumn = (index) => {
        const newColumns = columns.filter((_, i) => i !== index);
        setColumns(newColumns);
    };

    return (
        <div className="space-y-6">
            <h3  className="text-xl font-semibold !text-blue-400 mb-4">Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Action</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    >
                        <option value="show">Show Tables</option>
                        <option value="describe">Describe Table</option>
                        <option value="create">Create Table</option>
                        <option value="drop">Drop Table</option>
                        <option value="truncate">Truncate Table</option>
                    </select>
                </div>
                
                {action !== 'show' && (
                    <div>
                        <label className="block text-gray-300 text-sm mb-1">
                            {['drop', 'truncate'].includes(action) ? '⚠️ Table to ' + action : 'Table Name'}
                        </label>
                        <input
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="table_name"
                        />
                    </div>
                )}
            </div>

            {action === 'create' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="block text-gray-300 text-sm">Table Columns</label>
                        <button
                            onClick={addColumn}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                        >
                            + Add Column
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {columns.map((col, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={col.name}
                                    onChange={(e) => updateColumn(index, 'name', e.target.value)}
                                    className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    placeholder="column_name"
                                />
                                <input
                                    type="text"
                                    value={col.type}
                                    onChange={(e) => updateColumn(index, 'type', e.target.value)}
                                    className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    placeholder="VARCHAR(100)"
                                />
                                <button
                                    onClick={() => removeColumn(index)}
                                    className="p-2 text-red-400 hover:text-red-300"
                                    title="Remove column"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <CodeSnippet 
                        code={getCommand()}
                        className="mb-1"
                        copyButton={true}
                    />
                    <p className={`text-xs font-saria ${['drop', 'truncate'].includes(action) ? 'text-red-400' : 'description'}`}>
                        {getDescription()}
                    </p>
                </div>

                {['drop', 'truncate'].includes(action) && (
                    <div className="p-3 !font-saria bg-red-900/20 border border-red-800 rounded text-sm">
                        <p className="dark:text-red-300 text-red-500 font-medium mb-1">Warning:</p>
                        <p className="text-xs dark:text-red-300 text-red-500">
                            This action {action === 'drop' ? 'will permanently delete the table and all its data' : 'will remove all records from the table'}. 
                            This cannot be undone.
                        </p>
                    </div>
                )}

                {action === 'create' && (
                    <div className="p-3 bg-blue-900/20 border border-blue-800 rounded text-sm">
                        <p className="dark:text-blue-300 text-blue-500 font-medium mb-1">Common Column Types:</p>
                        <ul className="list-disc pl-5 space-y-1 text-xs dark:text-blue-300 text-blue-500 ">
                            <li><code>INT</code> - Integer</li>
                            <li><code>VARCHAR(n)</code> - Variable string (max n characters)</li>
                            <li><code>TEXT</code> - Long text</li>
                            <li><code>DATE</code>, <code>DATETIME</code>, <code>TIMESTAMP</code> - Date/time values</li>
                            <li><code>BOOLEAN</code> - True/false</li>
                            <li><code>FLOAT</code>, <code>DOUBLE</code> - Decimal numbers</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableCommands;
