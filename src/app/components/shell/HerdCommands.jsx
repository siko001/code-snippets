'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function HerdCommands() {
    const [serviceName, setServiceName] = useState('herd');
    const [activeTab, setActiveTab] = useState('status');
    const [serviceStatus, setServiceStatus] = useState('');
    const [showServiceInfo, setShowServiceInfo] = useState(false);
    const [serviceForDetails, setServiceForDetails] = useState('');
    const [serviceInfo, setServiceInfo] = useState(null);
    const [hasManuallyEditedService, setHasManuallyEditedService] = useState(false);

    const tabs = [
        { id: 'status', label: 'Service Status' },
        { id: 'start', label: 'Start Service' },
        { id: 'stop', label: 'Stop Service' },
        { id: 'restart', label: 'Restart Service' },
        { id: 'kill', label: 'Kill Process' },
        { id: 'list', label: 'List Services' }
    ];

    const commands = {
        status: {
            title: 'Check Service Status',
            description: 'Check the status of a specific service',
            command: `brew services list | grep -i ${serviceName}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium  mb-1">Service Name</label>
                    <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., herd, nginx, php-fpm"
                    />
                </div>
            )
        },
        start: {
            title: 'Start Service',
            description: 'Start a specific service using brew services',
            command: `brew services start ${serviceName}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
                    <select
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="herd">Herd (herd)</option>
                        <option value="nginx">Nginx (nginx)</option>
                        <option value="php-fpm">PHP-FPM (php-fpm)</option>
                    </select>
                </div>
            )
        },
        stop: {
            title: 'Stop Service',
            description: 'Stop a specific service using brew services',
            command: `brew services stop ${serviceName}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
                    <select
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="herd">Herd (herd)</option>
                        <option value="nginx">Nginx (nginx)</option>
                        <option value="php-fpm">PHP-FPM (php-fpm)</option>
                    </select>
                </div>
            )
        },
        restart: {
            title: 'Restart Service',
            description: 'Restart a specific service using brew services',
            command: `brew services restart ${serviceName}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
                    <select
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="herd">Herd (herd)</option>
                        <option value="nginx">Nginx (nginx)</option>
                        <option value="php-fpm">PHP-FPM (php-fpm)</option>
                    </select>
                </div>
            )
        },
        kill: {
            title: 'Kill Process',
            description: 'Force kill all processes matching a pattern',
            command: `sudo pkill -f ${serviceName}`,
            input: (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Process Name</label>
                    <select
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="herd">Herd (herd)</option>
                        <option value="nginx">Nginx (nginx)</option>
                        <option value="php-fpm">PHP-FPM (php-fpm)</option>
                    </select>
                </div>
            )
        },
        list: {
            title: 'List All Services',
            description: 'List all services managed by brew services',
            command: 'brew services list',
            input: null
        }
    };



    // Fetch service status when tab is active
    useEffect(() => {
        if (activeTab === 'status' && !serviceStatus) {
            // Simulate service status fetch
            setTimeout(() => {
                setServiceStatus('herd started');
            }, 500);
        }
    }, [activeTab, serviceStatus]);

    // Reset service info when switching away from status tab
    useEffect(() => {
        if (activeTab !== 'status') {
            setShowServiceInfo(false);
            setServiceInfo(null);
            setServiceForDetails('');
            setHasManuallyEditedService(false);
        }
    }, [activeTab]);

    // Set service for details to current service when available (only if not manually edited)
    useEffect(() => {
        if (activeTab === 'status' && serviceName && !serviceForDetails && !hasManuallyEditedService) {
            setServiceForDetails(serviceName);
        }
    }, [activeTab, serviceName, serviceForDetails, hasManuallyEditedService]);


    const activeCommand = commands[activeTab];

    return (
        <div className="w-full">
            <h3  className="text-xl font-semibold !text-green-400 mb-4">Herd</h3>
            <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                                ? 'bg-green-600 text-white !cursor-default shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
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
            </div>
        </div>
    );
}
