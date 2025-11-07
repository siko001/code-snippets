'use client';

import NetworkCommands from '@/app/components/shell/NetworkCommands';
import ShellConfigCommands from '@/app/components/shell/ShellConfigCommands';

export default function ShellPage() {
    return (
        <div className="w-full">
            <h2 id="shell-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Shell Commands</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <h3 id="shell-network" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Network Utilities
                    </h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <NetworkCommands />
                    </div>

                    <h3 id="shell-config" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Shell Configuration
                    </h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <ShellConfigCommands />
                    </div>
                </div>
            </div>
        </div>
    );
}
