'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function LandoBasicCommands() {
    const [activeTab, setActiveTab] = useState('start');
    const [selectedCommand, setSelectedCommand] = useState(0);

    const commandGroups = {
        start: {
            title: 'Start/Stop Lando',
            description: 'Control your Lando environment',
            commands: [
                { cmd: 'lando start',btn: 'Start', desc: 'Start all services' },
                { cmd: 'lando stop', btn: 'Stop', desc: 'Stop all services' },
                { cmd: 'lando restart', btn: 'Restart', desc: 'Restart all services' },
                { cmd: 'lando poweroff', btn: 'Poweroff', desc: 'Completely stop Lando and all running services' }
            ]
        },
        ssh: {
            title: 'SSH into Container',
            description: 'Connect to your Lando containers',
            commands: [
                { cmd: 'lando ssh', btn: 'Appserver', desc: 'SSH into the appserver container' },
                { cmd: 'lando ssh --service database', btn: 'Database', desc: 'SSH into the database container' },
                { cmd: 'lando ssh --service pma', btn: 'PMA', desc: 'SSH into the phpMyAdmin container' }
            ]
        },
        rebuild: {
            title: 'Rebuild Services',
            description: 'Rebuild your Lando services',
            commands: [
                { cmd: 'lando rebuild', btn: 'Rebuild', desc: 'Rebuild all services' },
                { cmd: 'lando rebuild --yes', btn: 'No Confirm', desc: 'Rebuild without confirmation' },
                { cmd: 'lando rebuild --clear', btn: 'Clear', desc: 'Clear caches before rebuilding' },
                { cmd: 'lando rebuild --clear --yes', btn: 'Force', desc: 'Force rebuild without confirmation' }
            ]
        },
        info: {
            title: 'Service Information',
            description: 'Get information about your Lando services',
            commands: [
                { cmd: 'lando info', btn: 'Info', desc: 'Show all service information' },
                { cmd: 'lando info --format json', btn: 'JSON', desc: 'Show info in JSON format' },
                { cmd: 'lando status', btn: 'Status', desc: 'Show service status' },
                { cmd: 'lando version', btn: 'Version', desc: 'Show Lando version' }
            ]
        },
        logs: {
            title: 'View Logs',
            description: 'View service logs',
            commands: [
                { cmd: 'lando logs', btn: 'Logs', desc: 'Show all service logs' },
                { cmd: 'lando logs --follow', btn: 'Follow', desc: 'Follow logs in real-time' },
                { cmd: 'lando logs --service appserver', btn: 'Appserver', desc: 'Show appserver logs' },
                { cmd: 'lando logs --service database', btn: 'Database', desc: 'Show database logs' },
                { cmd: 'lando logs --tail=100', btn: 'Tail', desc: 'Show last 100 log lines' }
            ]
        }
    };

    const activeGroup = commandGroups[activeTab];
    const activeCmd = activeGroup.commands[selectedCommand] || activeGroup.commands[0];

    return (
        <div className="space-y-4">
            <h3  className="text-xl font-semibold !text-blue-400 mb-4">Commands</h3>
            {/* Main Tabs */}
            <div className="flex flex-wrap gap-1 p-1.5 tab-bg rounded-lg">
                {Object.entries(commandGroups).map(([id, group]) => (
                    <button
                        key={id}
                        onClick={() => {
                            setActiveTab(id);
                            setSelectedCommand(0);
                        }}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            activeTab === id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-300 hover:text-white hover:bg-gray-600'
                        }`}
                        title={group.description}
                    >
                        {group.title}
                    </button>
                ))}
            </div>

            <div className="py-4 rounded-lg space-y-4">
                
                <div className="flex flex-wrap gap-2">
                    {activeGroup.commands.map((cmd, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedCommand(index)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                selectedCommand === index
                                    ? '!bg-blue-700 !text-white shadow-md'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                            title={cmd.desc}
                        >
                            {cmd.btn}
                        </button>
                    ))}
                </div>

                <div className="mt-2">
                    <CodeSnippet 
                        code={activeCmd.cmd} 
                        language="bash" 
                        className="mt-2"
                    />
                </div>
                
                <p className="text-sm description mt-2">
                    {activeCmd.desc}
                </p>
            </div>
        </div>
    );
}
