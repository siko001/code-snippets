'use client';
import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function FileOperations() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [operation, setOperation] = useState('cp');
    const [isRecursive, setIsRecursive] = useState(false);
    const [flags, setFlags] = useState({
        verbose: false,
        interactive: false,
        noClobber: false,
        update: false
    });
    const [command, setCommand] = useState('cp -r /path/to/source /path/to/destination');

    useEffect(() => {
        let cmd = operation;
        let flagsStr = '';
        
        // Add flags based on state
        if (isRecursive) flagsStr += ' -r';
        if (flags.verbose) flagsStr += ' -v';
        if (flags.interactive) flagsStr += ' -i';
        if (flags.noClobber) flagsStr += ' -n';
        if (flags.update) flagsStr += ' -u';
        
        const src = source || '/path/to/source';
        const dest = destination || '/path/to/destination';
        
        setCommand(`${cmd}${flagsStr} "${src}" "${dest}"`);
    }, [source, destination, operation, isRecursive, flags]);

    // Check if form is complete
    const isFormComplete = !!source && !!destination;

    return (
        <div className="component-wrapper p-6 rounded-lg shadow-lg">
            <h3 id="file-operations"  className="text-xl font-semibold !text-blue-400 mb-4">File Operations</h3>
            
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-medium ${operation === 'cp' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setOperation('cp')}
                    >
                        Copy (cp)
                    </button>
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-medium ${operation === 'mv' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setOperation('mv')}
                    >
                        Move (mv)
                    </button>
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-medium ${isRecursive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setIsRecursive(!isRecursive)}
                    >
                        Recursive (-r)
                    </button>
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">Source Path:</label>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="/path/to/source"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    />
                </div>
                
                <div>
                    <label className="block text-gray-300 mb-2">Destination Path:</label>
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="/path/to/destination"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    />
                </div>
                
                <CodeSnippet 
                    code={command} 
                    className="mb-4"
                    copyButton={isFormComplete}
                />
                
                <div className="text-sm text-gray-400 mt-2">
                    <p className="font-semibold font-quicksand mb-2">Common Flags:</p>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => setFlags(f => ({ ...f, verbose: !f.verbose }))}
                            className={`px-2 py-1 rounded text-xs font-mono ${flags.verbose ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            -v (verbose)
                        </button>
                        <button 
                            onClick={() => setFlags(f => ({ ...f, interactive: !f.interactive }))}
                            className={`px-2 py-1 rounded text-xs font-mono ${flags.interactive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            -i (interactive)
                        </button>
                        <button 
                            onClick={() => setFlags(f => ({ ...f, noClobber: !f.noClobber }))}
                            className={`px-2 py-1 rounded text-xs font-mono ${flags.noClobber ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            -n (no clobber)
                        </button>
                        <button 
                            onClick={() => setFlags(f => ({ ...f, update: !f.update }))}
                            className={`px-2 py-1 rounded text-xs font-mono ${flags.update ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            -u (update)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
