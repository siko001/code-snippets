'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

const SSHAgentManagement = () => {
    const [sshPath, setSshPath] = useState('/home/site/.ssh/');
    const privateKeyPath = sshPath;
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [useEval, setUseEval] = useState(true);

    const handleCopyAll = () => {
        const commands = [];
        if (useEval) {
            commands.push('eval `ssh-agent`');
        }
        commands.push(`ssh-add ${privateKeyPath}`);
        navigator.clipboard.writeText(commands.join('\n'));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <h3 id='ssh-agent-management' className="text-lg font-semibold !text-blue-400">Agent Management</h3>
                
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="useEval"
                            checked={useEval}
                            onChange={(e) => setUseEval(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="useEval" className="ml-2 text-sm text-gray-300">
                            Start SSH Agent (eval `ssh-agent`)
                        </label>
                    </div>

                    <div>
                        <label htmlFor="sshPath" className="block text-sm font-medium text-gray-300 mb-1">
                            SSH Key Path:
                        </label>
                        <input
                            type="text"
                            id="sshPath"
                            value={sshPath}
                            onChange={(e) => setSshPath(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {useEval && (
                        <CodeSnippet 
                            code="eval `ssh-agent`"
                            className="mb-2"
                            copyButton={true}
                        />
                    )}
                    <CodeSnippet 
                        code={`ssh-add ${privateKeyPath}`}
                        className="mb-2"
                        copyButton={true}
                    />
                </div>
            </div>

            <div className="p-4 dark:bg-gray-800 bg-gray-100 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2 text-sm">When to use this:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs dark:text-gray-300 text-gray-700">
                    <li>When you need to authenticate with a private key on a remote server</li>
                    <li>Before running Git operations that require SSH authentication</li>
                    <li>When working with deployment scripts that need SSH access</li>
                    <li>After server restarts when the SSH agent needs to be restarted</li>
                </ul>
            </div>
        </div>
    );
};

export default SSHAgentManagement;
