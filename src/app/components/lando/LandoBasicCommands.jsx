'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function LandoBasicCommands() {
    const [activeTab, setActiveTab] = useState('start');

    const tabs = [
        { id: 'start', label: 'Start/Stop' },
        { id: 'ssh', label: 'SSH' },
        { id: 'rebuild', label: 'Rebuild' },
        { id: 'info', label: 'Info' },
        { id: 'logs', label: 'Logs' }
    ];

    const commands = {
        start: {
            title: 'Start/Stop Lando',
            description: 'Start or stop your Lando environment',
            commands: [
                { cmd: 'lando start', desc: 'Start all services' },
                { cmd: 'lando stop', desc: 'Stop all services' },
                { cmd: 'lando restart', desc: 'Restart all services' },
                { cmd: 'lando poweroff', desc: 'Completely stop Lando and all running services' }
            ]
        },
        ssh: {
            title: 'SSH into Container',
            description: 'Connect to your Lando container via SSH',
            commands: [
                { cmd: 'lando ssh', desc: 'SSH into the appserver container' },
                { cmd: 'lando ssh --service database', desc: 'SSH into the database container' },
                { cmd: 'lando ssh --service pma', desc: 'SSH into the phpMyAdmin container' }
            ]
        },
        rebuild: {
            title: 'Rebuild Services',
            description: 'Rebuild your Lando services',
            commands: [
                { cmd: 'lando rebuild', desc: 'Rebuild all services' },
                { cmd: 'lando rebuild --yes', desc: 'Rebuild without confirmation' },
                { cmd: 'lando rebuild --clear', desc: 'Clear caches before rebuilding' }
            ]
        },
        info: {
            title: 'Service Information',
            description: 'Get information about your Lando services',
            commands: [
                { cmd: 'lando info', desc: 'Show all service information' },
                { cmd: 'lando info --format json', desc: 'Show info in JSON format' },
                { cmd: 'lando status', desc: 'Show service status' }
            ]
        },
        logs: {
            title: 'View Logs',
            description: 'View service logs',
            commands: [
                { cmd: 'lando logs', desc: 'Show all service logs' },
                { cmd: 'lando logs --follow', desc: 'Follow logs in real-time' },
                { cmd: 'lando logs --service appserver', desc: 'Show appserver logs' },
                { cmd: 'lando logs --service database', desc: 'Show database logs' }
            ]
        }
    };

    const activeCommand = commands[activeTab];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-1 p-1 bg-gray-700 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
                <p className="text-gray-300 text-sm mb-4">{activeCommand.description}</p>
                <div className="space-y-3">
                    {activeCommand.commands.map((item, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-400">{item.desc}</span>
                            </div>
                            <CodeSnippet code={item.cmd} language="bash" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
