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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Port Number</label>
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
        <div className="space-y-4">
            <div className="flex space-x-1 p-1 bg-gray-700 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">{activeCommand.title}</h4>
                <p className="text-gray-300 text-sm mb-3">{activeCommand.description}</p>
                {activeCommand.input}
                <div className="mt-4">
                    <CodeSnippet code={activeCommand.command} language="bash" />
                </div>
            </div>
        </div>
    );
}
