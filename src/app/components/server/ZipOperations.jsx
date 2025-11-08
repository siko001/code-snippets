'use client';
import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function ZipOperations() {
    const [folderName, setFolderName] = useState('');
    const [fileName, setFileName] = useState('');
    const [isUnzip, setIsUnzip] = useState(false);
    const [command, setCommand] = useState('');
    const [flags, setFlags] = useState({
        maxCompression: false,
        verbose: false,
        encrypt: false
    });

    useEffect(() => {
        let cmd = isUnzip ? 'unzip' : 'zip';
        let flagsStr = '';
        
        // Add flags based on state
        if (!isUnzip) {
            if (flags.maxCompression) flagsStr += ' -9';
            flagsStr += ' -r';  // Always include -r for zip
            if (flags.encrypt) flagsStr += ' -e';
            if (flags.verbose) flagsStr += ' -v';
        } else {
            if (flags.verbose) flagsStr += ' -v';
        }
        
        if (isUnzip) {
            const fname = fileName || 'filename';
            setCommand(`${cmd}${flagsStr} ${fname}.zip`);
        } else {
            const fname = fileName || 'archive';
            const folder = folderName || 'folder';
            // Only add -r if it's not already in flagsStr
            const rFlag = flagsStr.includes(' -r') ? '' : ' -r';
            setCommand(`${cmd}${flagsStr}${rFlag} ${fname}.zip ${folder}/`);
        }
    }, [folderName, fileName, isUnzip, flags]);

    // Check if form is complete
    const isFormComplete = isUnzip ? !!fileName : (!!folderName && !!fileName);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(command);
        // You can add a small notification here if you want
    };

    return (
        <div className="component-wrapper p-6 rounded-lg shadow-lg">
            <h3 id="zip-operations" className="text-xl font-semibold !text-blue-400 mb-4">Zip/Unzip Operations</h3>
            
            <div className="space-y-4">
                <div className="flex space-x-2 mb-4">
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-medium ${!isUnzip ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setIsUnzip(false)}
                    >
                        Zip
                    </button>
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-medium ${isUnzip ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setIsUnzip(true)}
                    >
                        Unzip
                    </button>
                </div>

                {!isUnzip && (
                    <div>
                        <label className="block text-gray-300 mb-2">Folder to Zip:</label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="folder-name"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                )}
                
                <div>
                    <label className="block text-gray-300 mb-2">
                        {isUnzip ? 'Zip File (without .zip):' : 'Output Filename (without .zip):'}
                    </label>
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder={isUnzip ? 'archive' : 'archive'}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    />
                </div>
            
                          
                {/* Display the generated snippet */}
                <CodeSnippet 
                    code={command} 
                    className="mb-4"
                    copyButton={isFormComplete}
                />

                
                <div className="text-sm text-gray-400 mt-2">
                    <p className="font-semibold mb-2">Common Flags:</p>
                    <div className="flex flex-wrap gap-2">
                        {!isUnzip && (
                            <button 
                                onClick={() => setFlags(f => ({ ...f, maxCompression: !f.maxCompression }))}
                                className={`px-2 py-1 rounded text-xs font-mono ${flags.maxCompression ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                -9 (max compression)
                            </button>
                        )}
                        <button 
                            onClick={() => setFlags(f => ({ ...f, verbose: !f.verbose }))}
                            className={`px-2 py-1 rounded text-xs font-mono ${flags.verbose ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            -v (verbose)
                        </button>
                        {!isUnzip && (
                            <>
                                <button 
                                    onClick={() => setFlags(f => ({ ...f, encrypt: !f.encrypt }))}
                                    className={`px-2 py-1 rounded text-xs font-mono ${flags.encrypt ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    -e (encrypt)
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
