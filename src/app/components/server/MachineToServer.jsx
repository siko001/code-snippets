'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function MachineToServer() {
    const [formData, setFormData] = useState({
        port: '22',
        username: '',
        ip: '',
        localPath: '',
        fileName: '',
        serverPath: '~/'  // Default server path
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

 
    const generateSnippet = () => {
        const localFile = `${formData.localPath ? formData.localPath.replace(/\/?$/, '/') : ''}${formData.fileName || '{filename}'}`;
        const serverPath = formData.serverPath.replace(/\/+$/, ''); // Remove trailing slashes
        return `scp -P ${formData.port || '{Port}'} ${localFile} ${formData.username || '{Username}'}@${formData.ip || '{IP}'}:${serverPath}`;
    };

    const isFormComplete = formData.port && formData.username && formData.ip && 
                          formData.fileName;
    
    const snippet = generateSnippet();

    return (
  <div className="w-full bg-gray-800 p-4 rounded-lg">
            <h3 id="machine-to-server" className="text-xl font-semibold text-blue-400 mb-4">Machine to Server</h3>
            
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
                        className="w-full p-2 rounded-md bg-gray-700 text-white" 
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
                        className="w-full p-2 rounded-md bg-gray-700 text-white" 
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
                        className="w-full p-2 rounded-md bg-gray-700 text-white" 
                        placeholder="123.456.789.0"
                    />
                </div>

                <div>
                    <label htmlFor='localPath' className="block text-sm font-medium text-gray-300 mb-1">Local Path</label>
                    <input 
                        name="localPath" 
                        id='localPath' 
                        type="text" 
                        value={formData.localPath}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white" 
                        placeholder="path/to/local/folder/"
                    />
                    <div className="text-xs mt-1 text-gray-400">Local directory path (e.g., Downloads/)</div>
                </div>

                <div>
                    <label htmlFor='fileName' className="block text-sm font-medium text-gray-300 mb-1">File Name</label>
                    <input 
                        name="fileName" 
                        id='fileName' 
                        type="text" 
                        value={formData.fileName}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white" 
                        placeholder="file.ext or folder/"
                    />
                    <div className="text-xs mt-1 text-gray-400">File name or folder to upload</div>
                </div>

                <div>
                    <label htmlFor='serverPath' className="block text-sm font-medium text-gray-300 mb-1">Server Path</label>
                    <input 
                        name="serverPath" 
                        id='serverPath' 
                        type="text" 
                        value={formData.serverPath}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white" 
                        placeholder="~/path/on/server/"
                    />
                    <div className="text-xs mt-1 text-gray-400">Destination path on server</div>
                </div>
            </div>
        </div>
    );
}