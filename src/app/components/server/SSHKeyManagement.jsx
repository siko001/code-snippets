'use client';

import { useState, useCallback } from 'react';
import CodeSnippet from '../CodeSnippet';

const SSHKeyManagement = ({ handleInputChange, inputValues = {} }) => {
    const sshCommand = `ssh-keygen -f ~/${inputValues?.sshPath || '.ssh/known_hosts'} -R '${inputValues?.sshHost || 'bitbucket.org'}'`;

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-300 mb-2">Host:</label>
                        <input
                            type="text"
                            value={inputValues?.sshHost || 'bitbucket.org'}
                            onChange={(e) => handleInputChange('sshHost', e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            placeholder="e.g., bitbucket.org, github.com"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-300 mb-2">SSH Key Path:</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l bg-gray-600 text-gray-300 text-sm">
                                ~/
                            </span>
                            <input
                                type="text"
                                value={inputValues?.sshPath || '.ssh/known_hosts'}
                                onChange={(e) => handleInputChange('sshPath', e.target.value)}
                                className="flex-1 p-2 rounded-r bg-gray-700 text-white border border-l-0 border-gray-600"
                                placeholder=".ssh/known_hosts"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <CodeSnippet 
                        code={sshCommand} 
                        className="mb-2"
                        copyButton={true}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        This command removes the old SSH key for the specified host from your known_hosts file.
                    </p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2">When to use this:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>When you get "Host key verification failed" errors</li>
                    <li>After reinstalling your OS or changing SSH keys</li>
                    <li>When connecting to a server that has been reinstalled</li>
                    <li>If you're getting "REMOTE HOST IDENTIFICATION HAS CHANGED" errors</li>
                </ul>
            </div>
        </div>
    );
};

export default SSHKeyManagement;
