'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function NetworkCommands() {
    const [port, setPort] = useState('3000');
    const [networkInterface, setNetworkInterface] = useState('en0');
    const [activeTab, setActiveTab] = useState('listening');

    const tabs = [
        { id: 'listening', label: 'List Listening Ports' },
        { id: 'check', label: 'Check Port' },
        { id: 'iplist', label: 'List Network IPs' },
        { id: 'getip', label: 'Get IP' }
    ];

    const commands = {
        listening: {
            title: 'List Listening Ports',
            description: 'Show all ports that are currently listening for connections',
            command: 'netstat -an | grep LISTEN'
        },
        check: {
            title: 'Check Port Usage',
            description: 'Show which process is using a specific port',
            command: `lsof -i :${port}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium  mb-1">Port Number</label>
                    <input
                        type="text"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., 3000"
                    />
                </div>
            )
        },
        iplist: {
            title: 'List Network IPs',
            description: 'Show all network interfaces and their IP addresses',
            command: 'ifconfig | grep inet'
        },
        getip: {
            title: 'Get IP Address',
            description: 'Get the IP address of a specific network interface',
            command: `ipconfig getifaddr ${networkInterface}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Network Interface</label>
                    <select
                        value={networkInterface}
                        onChange={(e) => setNetworkInterface(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="en0">Wi-Fi (en0)</option>
                        <option value="en1">Ethernet (en1)</option>
                        <option value="lo0">Loopback (lo0)</option>
                    </select>
                </div>
            )
        }
    };

    const activeCommand = commands[activeTab];

    return (
        <div className="w-full">
            <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-4 component-bg rounded-lg">
                <h4 className="text-lg font-medium  mb-2">{activeCommand.title}</h4>
                <div className="text-sm  description mb-3">{activeCommand.description}</div>
                {activeCommand.input}
                <div className="mt-4">
                    <CodeSnippet code={activeCommand.command} language="bash" />
                </div>
            </div>
        </div>
    );
}
