'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

const TABS = {
    REMOVE_KEY: 'remove_key',
    GENERATE_KEY: 'generate_key',
    INSTALL_SSH: 'install_ssh'
};

const SSHKeyManagement = ({ handleInputChange, inputValues = {} }) => {
    const [activeTab, setActiveTab] = useState(TABS.REMOVE_KEY);
    
    const [keyOptions, setKeyOptions] = useState({
        keyType: 'rsa',
        keyBits: '4096',
        keyFile: '/home/site/.ssh/id_rsa',
        keyComment: ''
    });

    const handleKeyOptionChange = (option, value) => {
        setKeyOptions(prev => ({
            ...prev,
            [option]: value
        }));
    };

    const generateKeyCommand = `ssh-keygen -t ${keyOptions.keyType} -b ${keyOptions.bits} -f ${keyOptions.keyFile}${keyOptions.keyComment ? ` -C "${keyOptions.keyComment}"` : ''}`;

    const commands = {
        [TABS.REMOVE_KEY]: {
            title: 'Remove Host Key',
            command: `ssh-keygen -f ~/${inputValues?.sshPath || '.ssh/known_hosts'} -R '${inputValues?.sshHost || 'bitbucket.org'}'`,
            description: 'Removes the old SSH key for the specified host from your known_hosts file.'
        },
        [TABS.GENERATE_KEY]: {
            title: 'Generate SSH Key',
            command: generateKeyCommand,
            description: 'Generates a new SSH key pair (public/private) with the specified options.'
        },
        [TABS.INSTALL_SSH]: {
            title: 'Install OpenSSH',
            command: 'apk add --no-cache openssh-client',
            description: 'Install OpenSSH client on Alpine Linux. Use `apt-get install -y openssh-client` for Debian/Ubuntu.'
        }
    };

    return (
        <div className="space-y-4">
            
            <h3 id='ssh-key-management' className="text-lg font-semibold text-blue-400">Key Management</h3>
            {/* Tabs */}
            <div className="flex space-x-2  bg-gray-800 rounded-lg">
                {Object.entries(TABS).map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(value)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === value 
                                ? 'bg-blue-600 !cursor-default text-white' 
                                : 'text-gray-300 bg-gray-600 hover:bg-gray-700'
                        }`}
                    >
                        {commands[value].title}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className=" bg-gray-800 rounded-lg">
                {activeTab === TABS.GENERATE_KEY && (
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Key Type</label>
                                <select
                                    value={keyOptions.keyType}
                                    onChange={(e) => handleKeyOptionChange('keyType', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                >
                                    <option value="rsa">RSA</option>
                                    <option value="ed25519">ED25519</option>
                                    <option value="ecdsa">ECDSA</option>
                                    <option value="dsa">DSA</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Key Bits</label>
                                <select
                                    value={keyOptions.bits}
                                    onChange={(e) => handleKeyOptionChange('bits', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                >
                                    <option value="2048">2048 bits (RSA minimum)</option>
                                    <option value="3072">3072 bits (RSA recommended)</option>
                                    <option value="4096">4096 bits (RSA high security)</option>
                                    <option value="256">256 bits (ED25519/ECDSA)</option>
                                    <option value="384">384 bits (ECDSA only)</option>
                                    <option value="521">521 bits (ECDSA only)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-300 text-sm mb-1">Key File Path</label>
                                <input
                                    type="text"
                                    value={keyOptions.keyFile}
                                    onChange={(e) => handleKeyOptionChange('keyFile', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    placeholder="/path/to/private_key"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-300 text-sm mb-1">Comment (optional)</label>
                                <input
                                    type="text"
                                    value={keyOptions.keyComment}
                                    onChange={(e) => handleKeyOptionChange('keyComment', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    placeholder="e.g., user@example.com"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === TABS.REMOVE_KEY && (
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
                    </div>
                )}

                <div className="mt-4">
                    <CodeSnippet 
                        code={commands[activeTab].command} 
                        className="mb-2"
                        copyButton={true}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        {commands[activeTab].description}
                    </p>
                </div>

                {activeTab === TABS.INSTALL_SSH && (
                    <div className="mt-4 p-3 bg-gray-700 rounded text-sm">
                        <p className="text-yellow-300 font-medium mb-1">Note:</p>
                        <p className="text-gray-300">
                            For Debian/Ubuntu, use: 
                            <code className="bg-gray-600 px-2 py-1 rounded ml-1">
                                apt-get install -y openssh-client
                            </code>
                        </p>
                    </div>
                )}
            </div>

            {/* Usage Tips */}
            <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-blue-400 text-sm font-medium mb-2">When to use these commands:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-300">
                    <li><span className="font-medium">Remove Host Key:</span> When getting "Host key verification failed" errors</li>
                    <li><span className="font-medium">Generate SSH Key:</span> When setting up a new server or need new SSH keys</li>
                    <li><span className="font-medium">Install OpenSSH:</span> If you get "ssh: command not found" errors</li>
                </ul>
            </div>
        </div>
    );
};

export default SSHKeyManagement;
