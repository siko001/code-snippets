'use client';

import MachineToServer from './MachineToServer';
import ServerToMachineDownload from './ServerToMachineDownload';
import ZipOperations from './ZipOperations';
import FileOperations from './FileOperations';

export default function ServerSnippets() {
    return (
        <div className="w-full">
            <h2 id="server-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Server Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">FTP Operations</h3>
                    <ServerToMachineDownload />
                    <MachineToServer />
                </div>  
                
                
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">File & Folder Operations</h3>
                    <ZipOperations />
                    <FileOperations />
                </div>
            </div>
        </div>
    );
}