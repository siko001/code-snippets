'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function ServerToMachineDownload() {
    const [formData, setFormData] = useState({
        port: '22',
        username: '',
        ip: '',
        serverLocation: '',
        fileName: '',
        machineLocation: 'Desktop/'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateSnippet = () => {
        return `scp -P ${formData.port || '{Port}'} ${formData.username || '{Username}'}@${formData.ip || '{IP}'}:~/${formData.serverLocation ? formData.serverLocation.replace(/\/?$/, '/') : '{Server Location}/'}${formData.fileName.startsWith('/') ? formData.fileName.slice(1) : formData.fileName || '{Filename}'} ~/${formData.machineLocation || '{Path on Machine}'}`;
    };

    const isFormComplete = formData.port && formData.username && formData.ip && 
                          formData.serverLocation && formData.fileName && formData.machineLocation;
    
    const snippet = generateSnippet();

    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg">
            <h3 id="server-to-desktop" className="text-blue-400 mb-4">Server to Desktop</h3>
            
            {/* Display the generated snippet */}
            <CodeSnippet 
                code={snippet} 
                className="mb-4"
                copyButton={isFormComplete}
            />

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start text-left">
                <div>
                    <label htmlFor='port' className="block text-sm font-medium text-gray-300 mb-1">Port</label>
                    <input 
                        name="port" 
                        id='port' 
                        type="text" 
                        value={formData.port}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white" 
                        placeholder="22"
                    />
                </div>

                <div>
                    <label htmlFor='username' className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <input 
                        name="username" 
                        id='username' 
                        type="text" 
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white" 
                        placeholder="username"
                    />
                </div>

                <div>
                    <label htmlFor="ip" className="block text-sm font-medium text-gray-300 mb-1">IP Address</label>
                    <input 
                        name="ip" 
                        type="text" 
                        id='ip' 
                        value={formData.ip}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white" 
                        placeholder="123.456.789.0"
                    />
                </div>

                <div>
                    <label htmlFor='serverLocation' className="block text-sm font-medium text-gray-300 mb-1">Server Location</label>
                    <input 
                        name="serverLocation" 
                        id='serverLocation' 
                        type="text" 
                        value={formData.serverLocation}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white" 
                        placeholder="path/to/file/"
                    />
                    <div className="text-xs mt-1 text-gray-400">Without prefixed ~/</div>
                </div>

                <div>
                    <label htmlFor='fileName' className="block text-sm font-medium text-gray-300 mb-1">File name</label>
                    <input 
                        name="fileName" 
                        id='fileName' 
                        type="text" 
                        value={formData.fileName}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white" 
                        placeholder="filename.ext"
                    />
                    <div className="text-xs mt-1 text-gray-400">Include extension</div>
                </div>

                <div>
                    <label htmlFor='machineLocation' className="block text-sm font-medium text-gray-300 mb-1">Local Path</label>
                    <input 
                        name="machineLocation" 
                        id='machineLocation' 
                        type="text" 
                        value={formData.machineLocation}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white" 
                        placeholder="path/to/save/"
                    />
                    <div className="text-xs mt-1 text-gray-400">Without prefixed ~/</div>
                </div>
            </div>
        </div>
    );
}