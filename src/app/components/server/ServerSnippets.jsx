'use client';

import { useState } from 'react';
import MachineToServer from './MachineToServer';
import ServerToMachineDownload from './ServerToMachineDownload';
import ZipOperations from './ZipOperations';
import FileOperations from './FileOperations';
import SSHKeyManagement from './SSHKeyManagement';
import SSHAgentManagement from './SSHAgentManagement';

export default function ServerSnippets() {
    const [sshValues, setSshValues] = useState({
        sshHost: 'bitbucket.org',
        sshPath: '.ssh/known_hosts'
    });

    const handleSshInputChange = (key, value) => {
        setSshValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

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

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">SSH Key Management</h3>
                    <div className="space-y-6">
                        <div className="component-wrapper p-6 rounded-lg shadow-lg">
                            <SSHKeyManagement 
                                inputValues={sshValues}
                                handleInputChange={handleSshInputChange}
                            />
                        </div>
                        
                        <div className="bg-gray-800 p-6 mt-10 rounded-lg shadow-lg">
                            <SSHAgentManagement />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}