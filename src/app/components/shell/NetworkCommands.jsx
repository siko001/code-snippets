'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function NetworkCommands() {
    const [port, setPort] = useState('3000');
    const [networkInterface, setNetworkInterface] = useState('en0');
    const [activeTab, setActiveTab] = useState('listening');
    const [publicIp, setPublicIp] = useState('');
    const [showIpInfo, setShowIpInfo] = useState(false);
    const [ipForDetails, setIpForDetails] = useState('');
    const [ipInfo, setIpInfo] = useState(null);
    const [loadingIpInfo, setLoadingIpInfo] = useState(false);
    const [hasManuallyEditedIp, setHasManuallyEditedIp] = useState(false);

    const tabs = [
        { id: 'listening', label: 'List Listening Ports' },
        { id: 'check', label: 'Check Port' },
        { id: 'iplist', label: 'List Network IPs' },
        { id: 'getip', label: 'Get IP' },
        { id: 'publicip', label: 'Public IP' }
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
        },
        publicip: {
            title: 'Get Public IP Address',
            description: 'Get your public IP address using various methods',
            command: 'curl ifconfig.me',
            input: null
        }
    };

    // Fetch IP info when toggle is enabled and IP is entered
    useEffect(() => {
        const fetchIpInfo = async () => {
            if (!showIpInfo || !ipForDetails) return;
            
            setLoadingIpInfo(true);
            try {
                const response = await fetch(`https://ipinfo.io/${ipForDetails}/json`);
                if (!response.ok) {
                    throw new Error('Failed to fetch IP information');
                }
                const data = await response.json();
                setIpInfo(data);
            } catch (error) {
                console.error('Failed to fetch IP info:', error);
                setIpInfo({ error: String(error.message || 'Failed to fetch IP information') });
            } finally {
                setLoadingIpInfo(false);
            }
        };

        fetchIpInfo();
    }, [showIpInfo, ipForDetails]);

    // Fetch public IP when tab is active
    useEffect(() => {
        if (activeTab === 'publicip' && !publicIp) {
            fetch('https://api.ipify.org?format=text')
                .then(res => res.text())
                .then(ip => setPublicIp(ip.trim()))
                .catch(() => {
                    // Fallback if primary service fails
                    fetch('https://ifconfig.me/ip')
                        .then(res => res.text())
                        .then(ip => setPublicIp(ip.trim()))
                        .catch(() => setPublicIp('Unable to fetch IP'));
                });
        }
    }, [activeTab, publicIp]);

    // Reset IP info when switching away from publicip tab
    useEffect(() => {
        if (activeTab !== 'publicip') {
            setShowIpInfo(false);
            setIpInfo(null);
            setIpForDetails('');
            setHasManuallyEditedIp(false);
        }
    }, [activeTab]);

    // Set IP for details to public IP when available (only if not manually edited)
    useEffect(() => {
        if (activeTab === 'publicip' && publicIp && !ipForDetails && !hasManuallyEditedIp) {
            setIpForDetails(publicIp);
        }
    }, [activeTab, publicIp, ipForDetails, hasManuallyEditedIp]);

    // Reset to default IP
    const resetToDefaultIp = () => {
        setIpForDetails(publicIp);
        setHasManuallyEditedIp(false);
        setIpInfo(null);
    };

    const activeCommand = commands[activeTab];

    return (
        <div className="w-full">
            <h3  className="text-xl font-semibold !text-blue-400 mb-4">Network</h3>
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

            <div className="p-1 component-bg rounded-lg">
                <h4 className="text-lg font-quicksand font-medium  mb-2">{activeCommand.title}</h4>
                <div className="text-sm  description mb-3">{activeCommand.description}</div>
                {activeCommand.input}
                <div className="mt-4">
                    <CodeSnippet code={activeCommand.command} language="bash" />
                </div>
                {activeTab === 'publicip' && (
                    <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showIpInfo}
                                onChange={(e) => setShowIpInfo(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-300">
                                Show detailed IP information
                            </span>
                        </label>
                        {showIpInfo && (
                            <div className="mt-4">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-medium text-gray-300">IP Address</label>
                                        {publicIp && ipForDetails !== publicIp && (
                                            <button
                                                onClick={resetToDefaultIp}
                                                className="text-xs text-blue-400 hover:text-blue-300 underline"
                                                title="Reset to your public IP"
                                            >
                                                Reset to default
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={ipForDetails}
                                        onChange={(e) => {
                                            setIpForDetails(e.target.value);
                                            setHasManuallyEditedIp(true);
                                        }}
                                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                                        placeholder="Enter IP address (e.g., 8.8.8.8)"
                                    />
                                </div>
                                {ipForDetails && (
                                    <div className="mb-4">
                                        <CodeSnippet code={`curl ipinfo.io/${ipForDetails}`} language="bash" />
                                    </div>
                                )}
                            </div>
                        )}
                        {showIpInfo && ipForDetails && (
                            <div className="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-700 description">
                                {loadingIpInfo ? (
                                    <div className="text-sm text-gray-400">Loading IP information...</div>
                                ) : ipInfo ? (
                                    ipInfo.error ? (
                                        <div className="text-sm text-red-400">{String(ipInfo.error)}</div>
                                    ) : (
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold text-blue-400 mb-3">IP Details</h5>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                {ipInfo.ip && (
                                                    <>
                                                        <div className="text-gray-400">IP Address:</div>
                                                        <div className="text-white font-mono">{ipInfo.ip}</div>
                                                    </>
                                                )}
                                                {ipInfo.hostname && (
                                                    <>
                                                        <div className="text-gray-400">Hostname:</div>
                                                        <div className="text-white">{ipInfo.hostname}</div>
                                                    </>
                                                )}
                                                {ipInfo.city && (
                                                    <>
                                                        <div className="text-gray-400">City:</div>
                                                        <div className="text-white">{ipInfo.city}</div>
                                                    </>
                                                )}
                                                {ipInfo.region && (
                                                    <>
                                                        <div className="text-gray-400">Region:</div>
                                                        <div className="text-white">{ipInfo.region}</div>
                                                    </>
                                                )}
                                                {ipInfo.country && (
                                                    <>
                                                        <div className="text-gray-400">Country:</div>
                                                        <div className="text-white">{ipInfo.country}</div>
                                                    </>
                                                )}
                                                {ipInfo.loc && (
                                                    <>
                                                        <div className="text-gray-400">Location:</div>
                                                        <div className="text-white">{ipInfo.loc}</div>
                                                    </>
                                                )}
                                                {ipInfo.org && (
                                                    <>
                                                        <div className="text-gray-400">Organization:</div>
                                                        <div className="text-white">{ipInfo.org}</div>
                                                    </>
                                                )}
                                                {ipInfo.postal && (
                                                    <>
                                                        <div className="text-gray-400">Postal Code:</div>
                                                        <div className="text-white">{ipInfo.postal}</div>
                                                    </>
                                                )}
                                                {ipInfo.timezone && (
                                                    <>
                                                        <div className="text-gray-400">Timezone:</div>
                                                        <div className="text-white">{ipInfo.timezone}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ) : null}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
