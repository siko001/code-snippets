'use client';

import MachineToServer from './MachineToServer';
import ServerToMachineDownload from './ServerToMachineDownload';

export default function ServerSnippets() {
    return (
        <div className="w-full">
            <h2 id="server-snippets" className='text-center text-2xl font-semibold my-6 text-blue-600'>Server Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <ServerToMachineDownload />
                <MachineToServer />
            </div>
        </div>
    );
}