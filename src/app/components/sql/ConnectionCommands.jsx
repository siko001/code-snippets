'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

const ConnectionCommands = () => {
    const [username, setUsername] = useState('root');
    const [host, setHost] = useState('localhost');
    const [database, setDatabase] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Generate connection command based on input
    const getConnectionCommand = () => {
        let command = `mysql`;
        if (username) command += ` -u ${username}`;
        if (host) command += ` -h ${host}`;
        if (database) command += ` ${database}`;
        if (showPassword) command += ' -p';
        return command;
    };

    // Generate remove password command
    const getRemovePasswordCommand = () => {
        return `ALTER USER '${username}'@'${host}' IDENTIFIED WITH caching_sha2_password BY '';\nFLUSH PRIVILEGES;`;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        placeholder="username"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Host</label>
                    <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        placeholder="localhost"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Database (optional)</label>
                    <input
                        type="text"
                        value={database}
                        onChange={(e) => setDatabase(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        placeholder="database_name"
                    />
                </div>
                <div className="flex items-end">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="showPassword" className="ml-2 text-sm text-gray-300">
                            Prompt for password
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <CodeSnippet 
                        code={getConnectionCommand()}
                        className="mb-1"
                        copyButton={true}
                    />
                    <p className="text-xs description">Connect to MySQL server</p>
                </div>

                <div>
                    <CodeSnippet 
                        code={getRemovePasswordCommand()}
                        className="mb-1"
                        copyButton={true}
                    />
                    <p className="text-xs description">Remove password for user (run in MySQL shell)</p>
                </div>
            </div>
        </div>
    );
};

export default ConnectionCommands;
